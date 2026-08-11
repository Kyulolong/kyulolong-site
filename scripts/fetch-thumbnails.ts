/**
 * 영상 썸네일을 한 번 받아서 레포 안에 저장한다.
 *
 *   npm run thumbs           # thumbnail 이 비어 있는 것만
 *   npm run thumbs -- --force  # 이미 있는 것도 다시 받는다
 *
 * ── 왜 받아서 저장하나 (핫링크가 아니라)
 *
 * 인스타 CDN 주소에는 `?oh=…&oe=<만료시각>` 서명이 붙는다. 며칠 지나면 만료돼서
 * 카드가 조용히 전부 빈칸이 된다. 실패가 눈에 안 띄는 종류라 더 나쁘다.
 * 게다가 런타임에 남의 CDN 을 부르면 그쪽이 흔들릴 때 목록이 같이 흔들린다 —
 * 스펙 11번이 DB 를 필수 경로에서 뺀 것과 같은 이유다.
 *
 * ── 소스별로 방법이 갈린다
 *
 *   유튜브   i.ytimg.com 규칙이라 파싱이 필요 없다
 *   퍼플즈   og:image 가 공개 스토리지를 가리켜서 그대로 받아진다
 *   인스타   로그인 벽 + 서명 만료. **여기서는 못 가져온다.**
 *            직접 만든 커버 이미지를 public/videos/<slug>.jpg 로 넣고
 *            MDX 에 thumbnail 한 줄 적는 게 빠르고 화질도 낫다.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const VIDEOS_DIR = path.join(process.cwd(), "content", "videos");
const OUT_DIR = path.join(process.cwd(), "public", "videos");
/** MDX 에 적히는 경로. public/ 아래라 앞의 /videos 가 그대로 URL 이 된다. */
const PUBLIC_PREFIX = "/videos";

const force = process.argv.includes("--force");

/** 로그인 벽에 막히는 곳이 있어 크롤러 UA 로 요청한다. */
const UA =
  "Mozilla/5.0 (compatible; kyulolong-thumbs/1.0; +https://kyulolong.com)";

function youtubeId(url: string): string | null {
  const m =
    url.match(/[?&]v=([\w-]{11})/) ??
    url.match(/youtu\.be\/([\w-]{11})/) ??
    url.match(/\/(?:embed|shorts)\/([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * og:image / twitter:image 를 찾는다. 정규식으로 긁는 이유는 파서를 하나 더
 * 들이기엔 찾는 게 한 줄이라서다. property 와 content 의 순서가 뒤바뀐
 * 마크업도 있어서 양쪽을 다 본다.
 */
function findOgImage(html: string): string | null {
  const metas = html.match(/<meta[^>]+>/gi) ?? [];
  const candidates = ["og:image", "twitter:image"];

  for (const key of candidates) {
    for (const tag of metas) {
      if (!tag.includes(key)) continue;
      const content = tag.match(/content=["']([^"']+)["']/i);
      if (content) return decodeHtmlEntities(content[1]);
    }
  }
  return null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** 받아서 저장하고 확장자를 돌려준다. 이미지가 아니면 저장하지 않는다. */
async function download(url: string, slug: string): Promise<string | null> {
  let res: Response;
  try {
    res = await fetch(url, { headers: { "user-agent": UA } });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return null;

  const ext = type.includes("png") ? "png" : type.includes("webp") ? "webp" : "jpg";
  const buf = Buffer.from(await res.arrayBuffer());

  // 유튜브는 없는 해상도를 요청해도 404 대신 120x90 회색 이미지를 준다.
  // 크기로 거른다 — 이게 걸리면 호출부가 다음 후보로 넘어간다.
  if (buf.byteLength < 3000) return null;

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.${ext}`), buf);
  return ext;
}

/** 후보 주소들을 순서대로 시도한다. 유튜브는 maxres 가 없는 영상이 흔하다. */
async function resolveCandidates(
  data: Record<string, unknown>,
): Promise<string[]> {
  const external = typeof data.externalUrl === "string" ? data.externalUrl : undefined;
  const embed = typeof data.embedUrl === "string" ? data.embedUrl : undefined;
  const page = external ?? embed;
  if (!page) return [];

  const yt = youtubeId(page);
  if (yt) {
    return [
      `https://i.ytimg.com/vi/${yt}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`,
    ];
  }

  const html = await fetchText(page);
  if (!html) return [];
  const og = findOgImage(html);
  return og ? [new URL(og, page).toString()] : [];
}

/**
 * frontmatter 에 thumbnail 한 줄을 끼워 넣는다.
 *
 * matter.stringify 를 쓰지 않는 이유: YAML 을 통째로 다시 써서 주석이 날아간다.
 * 이 레포의 MDX frontmatter 에는 "왜 이렇게 뒀는지"가 주석으로 붙어 있고,
 * 그게 파일을 여는 사람이 제일 먼저 읽는 것이다.
 */
function insertThumbnail(file: string, publicPath: string): void {
  const raw = fs.readFileSync(file, "utf8");
  const lines = raw.split("\n");
  // 0번 줄이 여는 ---, 그 다음 --- 이 닫는 자리다.
  const close = lines.indexOf("---", 1);
  if (close === -1) throw new Error(`frontmatter 를 찾지 못했습니다: ${file}`);

  lines.splice(close, 0, `thumbnail: ${publicPath}`);
  fs.writeFileSync(file, lines.join("\n"));
}

async function main() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error(`✗ ${path.relative(process.cwd(), VIDEOS_DIR)} 가 없습니다`);
    process.exit(1);
  }

  const files = fs.readdirSync(VIDEOS_DIR).filter((f) => f.endsWith(".mdx")).sort();
  let saved = 0;
  let skipped = 0;
  const failed: string[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const full = path.join(VIDEOS_DIR, file);
    const { data } = matter(fs.readFileSync(full, "utf8"));

    if (data.thumbnail && !force) {
      skipped += 1;
      continue;
    }

    const candidates = await resolveCandidates(data as Record<string, unknown>);
    if (candidates.length === 0) {
      failed.push(`${slug} — og:image 를 찾지 못했습니다 (인스타는 여기서 안 됩니다)`);
      continue;
    }

    let ext: string | null = null;
    for (const url of candidates) {
      ext = await download(url, slug);
      if (ext) break;
    }

    if (!ext) {
      failed.push(`${slug} — 이미지를 받지 못했습니다`);
      continue;
    }

    const publicPath = `${PUBLIC_PREFIX}/${slug}.${ext}`;
    if (!data.thumbnail) insertThumbnail(full, publicPath);
    console.log(`✓ ${slug} → public${publicPath}`);
    saved += 1;
  }

  console.log(
    `\n썸네일 ${saved}개 저장, ${skipped}개 건너뜀${failed.length ? `, ${failed.length}개 실패` : ""}`,
  );
  for (const f of failed) console.log(`  • ${f}`);

  // 실패해도 exit 0 이다. 인스타 편은 원래 여기서 안 되는 게 정상이고,
  // 이걸 빌드 실패로 만들면 썸네일 없는 영상을 못 올리게 된다 (스펙 5번).
}

void main();
