import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import {
  serviceFrontmatterSchema,
  thoughtFrontmatterSchema,
  videoFrontmatterSchema,
  type Service,
  type Thought,
  type Video,
} from "./types";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const SERVICES_DIR = path.join(CONTENT_DIR, "services");
const VIDEOS_DIR = path.join(CONTENT_DIR, "videos");
const THOUGHTS_DIR = path.join(CONTENT_DIR, "thoughts");

/** 스키마 위반을 파일 단위로 모아서 한 번에 보고하기 위한 에러 */
export class ContentError extends Error {
  constructor(public readonly problems: string[]) {
    super(
      `콘텐츠 검증 실패 (${problems.length}건)\n\n` +
        problems.map((p) => `  • ${p}`).join("\n") +
        "\n",
    );
    this.name = "ContentError";
  }
}

/**
 * YAML 은 `publishedAt: 2026-07-15` 를 Date 객체로 파싱한다.
 * 스키마는 YYYY-MM-DD 문자열을 기대하므로 여기서 맞춰준다.
 */
function normalizeDates(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    out[key] =
      value instanceof Date ? value.toISOString().slice(0, 10) : value;
  }
  return out;
}

function formatIssues(file: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const at = issue.path.length ? issue.path.join(".") : "(최상위)";
    return `${file} — ${at}: ${issue.message}`;
  });
}

function readCollection<T extends z.ZodType>(
  dir: string,
  schema: T,
  label: string,
): { slug: string; data: z.infer<T>; body: string }[] {
  if (!fs.existsSync(dir)) {
    throw new ContentError([
      `${label} 디렉토리가 없습니다: ${path.relative(process.cwd(), dir)}`,
    ]);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const problems: string[] = [];
  const entries: { slug: string; data: z.infer<T>; body: string }[] = [];

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);

    const parsed = schema.safeParse(normalizeDates(data));
    if (!parsed.success) {
      problems.push(...formatIssues(`${label}/${file}`, parsed.error));
      continue;
    }

    entries.push({ slug, data: parsed.data, body: content.trim() });
  }

  if (problems.length) throw new ContentError(problems);
  return entries;
}

/**
 * 스펙 5번의 기본 정렬: featured 를 상단 고정하고 그 안에서 최신순.
 * publishedAt 이 YYYY-MM-DD 라 문자열 비교로 날짜순이 맞는다.
 */
function byFeaturedThenRecent<T extends { featured?: boolean; publishedAt: string; slug: string }>(
  a: T,
  b: T,
): number {
  if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
  if (a.publishedAt !== b.publishedAt) return b.publishedAt.localeCompare(a.publishedAt);
  return a.slug.localeCompare(b.slug);
}

// 빌드 한 번에 파일을 여러 번 읽지 않도록 캐시한다.
let servicesCache: Service[] | null = null;
let videosCache: Video[] | null = null;
let thoughtsCache: Thought[] | null = null;

/**
 * 작업 번호를 매긴다 — 인스타 썸네일의 `#5` 와 같은 번호.
 *
 * publishedAt 오름차순, 즉 **만든 순서**다. 목록의 기본 정렬(추천순)과는 별개라
 * 어떻게 정렬해도 번호는 그대로 따라다닌다.
 *
 * 팀으로 만든 것은 세지 않는다. 이 번호가 세는 건 혼자 만든 줄이고,
 * 그게 이 채널의 논지라서다 (스펙 4번).
 *
 * ⚠️ 과거 날짜로 서비스를 하나 끼워 넣으면 그 뒤 번호가 전부 밀린다.
 * 이미 인스타에 `#5` 로 올린 편과 어긋나므로, 새로 올리는 건 늘 최신 날짜여야 한다.
 */
function assignSeq(services: Omit<Service, "seq">[]): Service[] {
  const order = new Map<string, number>();
  let n = 0;

  for (const s of [...services].sort(
    (a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug),
  )) {
    if (s.team) continue;
    order.set(s.slug, (n += 1));
  }

  return services.map((s) => ({ ...s, seq: order.get(s.slug) }));
}

export function getServices(): Service[] {
  if (!servicesCache) {
    const parsed = readCollection(SERVICES_DIR, serviceFrontmatterSchema, "services").map(
      ({ slug, data, body }) => ({ slug, ...data, body }),
    );
    servicesCache = assignSeq(parsed).sort(byFeaturedThenRecent);
  }
  return servicesCache;
}

export function getVideos(): Video[] {
  if (!videosCache) {
    videosCache = readCollection(VIDEOS_DIR, videoFrontmatterSchema, "videos")
      .map(({ slug, data, body }) => ({ slug, ...data, body }))
      .sort(byFeaturedThenRecent);
  }
  return videosCache;
}

/**
 * 글 목록. assignSeq 를 태우지 않는다 — 작업 번호는 "혼자 만든 줄"을 세는 것이고
 * (스펙 4번) 글은 그 줄이 아니다. 글에 번호를 붙이면 회차처럼 읽혀서, 순서대로
 * 읽어야 하는 연재물이라는 인상을 준다. 글은 아무 데서나 들어와도 되는 것이다.
 */
export function getThoughts(): Thought[] {
  if (!thoughtsCache) {
    thoughtsCache = readCollection(THOUGHTS_DIR, thoughtFrontmatterSchema, "thoughts")
      .map(({ slug, data, body }) => ({ slug, ...data, body }))
      .sort(byFeaturedThenRecent);
  }
  return thoughtsCache;
}

export function getService(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}

export function getVideo(slug: string): Video | undefined {
  return getVideos().find((v) => v.slug === slug);
}

export function getThought(slug: string): Thought | undefined {
  return getThoughts().find((t) => t.slug === slug);
}

/** 테스트/검증 스크립트가 캐시를 비우고 다시 읽을 때 쓴다. */
export function clearContentCache(): void {
  servicesCache = null;
  videosCache = null;
  thoughtsCache = null;
}
