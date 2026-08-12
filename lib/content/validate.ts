import { ContentError, getServices, getVideos } from "./loader";
import { RESERVED_PATHS } from "./types";

const RESERVED = new Set<string>(RESERVED_PATHS);

/** "/navigator" -> "navigator", 외부 URL 이거나 아직 없으면 null */
function rootSegment(url: string | undefined): string | null {
  if (!url?.startsWith("/")) return null;
  return url.split("/").filter(Boolean)[0] ?? null;
}

/**
 * 가짜 링크가 배포되는 걸 막는다.
 *
 * "TODO" 만 대소문자를 가린다. todo-app 같은 정상 레포명이 걸리는 걸 피하려고
 * 대문자 표기일 때만 자리표시자로 본다. 나머지 둘은 대소문자를 안 가린다.
 */
const FAKE_URL_MARKERS: { needle: string; caseSensitive: boolean }[] = [
  { needle: "placeholder", caseSensitive: false },
  { needle: "example.com", caseSensitive: false },
  { needle: "TODO", caseSensitive: true },
];

function checkFakeUrl(
  file: string,
  field: string,
  value: string | undefined,
  problems: string[],
): void {
  if (!value) return;
  for (const { needle, caseSensitive } of FAKE_URL_MARKERS) {
    const haystack = caseSensitive ? value : value.toLowerCase();
    const target = caseSensitive ? needle : needle.toLowerCase();
    if (haystack.includes(target)) {
      problems.push(
        `${file} — ${field} 이 자리표시자로 보입니다 ("${needle}" 포함): ${value}\n` +
          `    실제 주소로 바꾸거나, 아직 없으면 해당 필드를 지우세요.`,
      );
      return;
    }
  }
}

/**
 * processUrl 의 퍼플즈 주소가 **임베드로 바뀔 수 있는 형식인지** 본다.
 *
 * app/videos/[slug]/page.tsx 의 perplzEmbedUrl() 은 `perplz.com/sync/<해시>` 하나만
 * `perplz.com/embed/sync/<해시>` 로 바꾼다. 정규식이라 네트워크를 안 타고, 안 걸리면
 * undefined 를 줘서 **iframe 없이 링크 한 줄만 남는다. 빌드는 그대로 통과한다.**
 * 인스타 CDN 만료를 두고 한 얘기와 같은 종류다 — 실패가 눈에 안 띄어서 더 나쁘다.
 *
 * 하필 퍼플즈 공유 다이얼로그가 주는 주소 셋 중 **둘이 여기에 안 걸린다.**
 *
 *   공유 링크    https://perplz.com/s/EmYLdzGU            ← 안 걸림
 *   임베드 링크  https://perplz.com/embed/sync/PwG4kMBJ   ← 안 걸림
 *   주소창       https://perplz.com/sync/PwG4kMBJ         ← 이것만 맞다
 *
 * 받아주는 쪽으로 고칠 수가 없다. 단축코드(`EmYLdzGU`)와 싱크 해시(`PwG4kMBJ`)는
 * 서로 다른 네임스페이스라(short_links 테이블 vs video id 의 hashid) 문자열만 보고는
 * 변환이 안 되고 퍼플즈 DB 를 거쳐야 한다. 그래서 받는 대신 빌드에서 막는다.
 *
 * 단축링크는 한 가지가 더 있다: `/s/<code>` 는 **클릭을 기록한 뒤** 리다이렉트하므로,
 * npm run thumbs 가 그 주소를 긁을 때마다 퍼플즈의 공유 카운트가 올라간다.
 */
const PERPLZ_URL = /^https?:\/\/(?:www\.)?perplz\.com\//;
const PERPLZ_EMBEDDABLE = /^https:\/\/perplz\.com\/sync\/[\w-]+\/?$/;

function checkPerplzProcessUrl(file: string, value: string | undefined, problems: string[]): void {
  if (!value || !PERPLZ_URL.test(value) || PERPLZ_EMBEDDABLE.test(value)) return;

  // 임베드 주소는 `/embed` 만 떼면 되므로 고칠 주소를 바로 적어준다.
  const hash = value.match(/\/embed\/sync\/([\w-]+)/)?.[1];
  const hint = hash
    ? `    "임베드 링크" 를 넣으셨습니다. /embed 를 뺀 https://perplz.com/sync/${hash} 로 바꾸세요.`
    : `    "공유 링크"(/s/…) 는 단축코드라 임베드 주소로 바꿀 수 없습니다. 그 링크를 브라우저에서\n` +
      `    열면 주소창에 정본이 뜹니다 — https://perplz.com/sync/<해시> 를 적으세요.`;

  problems.push(
    `${file} — processUrl 이 임베드로 바뀌지 않는 형식입니다: ${value}\n` +
      hint +
      `\n    (그대로 두면 빌드는 통과하지만 작업 과정 영상이 안 뜨고 썸네일도 안 받아집니다.)`,
  );
}

function findDuplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const v of values) {
    if (seen.has(v)) dupes.add(v);
    seen.add(v);
  }
  return [...dupes];
}

/**
 * 스펙 6번: 양방향 참조를 빌드 타임에 검증한다.
 * 한쪽만 걸린 링크는 빌드 실패로 잡는다 — 60개가 되면 손으로는 못 잡는다.
 *
 * 검사 항목
 *   1. 서비스 슬러그 / 배포 경로가 예약 경로를 침범하는지 (스펙 2번)
 *   2. 참조 대상이 실제로 존재하는지
 *   3. 참조가 양쪽에 다 걸려 있는지 (한쪽만 걸리면 실패)
 *   4. 같은 대상을 중복 참조하는지
 *   5. URL 필드가 자리표시자인지 (가짜 링크 배포 방지)
 *   6. processUrl 의 퍼플즈 주소가 임베드로 바뀔 수 있는 형식인지
 */
export function validateContent(): void {
  const services = getServices();
  const videos = getVideos();

  const serviceSlugs = new Set(services.map((s) => s.slug));
  const videoSlugs = new Set(videos.map((v) => v.slug));
  const problems: string[] = [];

  for (const service of services) {
    // 1. 예약 경로 침범
    if (RESERVED.has(service.slug)) {
      problems.push(
        `services/${service.slug}.mdx — 슬러그 "${service.slug}" 는 홈페이지 예약 경로입니다. ` +
          `루트에서 충돌하니 다른 이름을 쓰세요. (예약: ${RESERVED_PATHS.join(", ")})`,
      );
    }
    const segment = rootSegment(service.url);
    if (segment && RESERVED.has(segment)) {
      problems.push(
        `services/${service.slug}.mdx — url "${service.url}" 의 첫 경로 "${segment}" 가 홈페이지 예약 경로입니다.`,
      );
    }

    // 5. 자리표시자 링크
    const serviceFile = `services/${service.slug}.mdx`;
    checkFakeUrl(serviceFile, "url", service.url, problems);
    checkFakeUrl(serviceFile, "github", service.github, problems);
    checkFakeUrl(serviceFile, "thumbnail", service.thumbnail, problems);
    // ogImage 는 대개 남의 컨테이너에 있는 파일이라(예: /prompt/og.png) 존재를
    // 확인할 수 없다. 적어도 자리표시자 주소가 박힌 채 나가는 건 여기서 잡는다.
    checkFakeUrl(serviceFile, "ogImage", service.ogImage, problems);

    for (const dupe of findDuplicates(service.relatedVideos)) {
      problems.push(`services/${service.slug}.mdx — relatedVideos 에 "${dupe}" 가 중복 있습니다.`);
    }

    for (const videoSlug of service.relatedVideos) {
      // 2. 대상 존재 여부
      if (!videoSlugs.has(videoSlug)) {
        problems.push(
          `services/${service.slug}.mdx — relatedVideos 의 "${videoSlug}" 에 해당하는 ` +
            `content/videos/${videoSlug}.mdx 가 없습니다.`,
        );
        continue;
      }
      // 3. 반대편에도 걸려 있는지
      const video = videos.find((v) => v.slug === videoSlug)!;
      if (!video.relatedServices.includes(service.slug)) {
        problems.push(
          `양방향 참조 불일치: services/${service.slug}.mdx 는 "${videoSlug}" 를 가리키는데, ` +
            `videos/${videoSlug}.mdx 의 relatedServices 에 "${service.slug}" 가 없습니다.`,
        );
      }
    }
  }

  for (const video of videos) {
    const videoFile = `videos/${video.slug}.mdx`;
    checkFakeUrl(videoFile, "embedUrl", video.embedUrl, problems);
    checkFakeUrl(videoFile, "externalUrl", video.externalUrl, problems);
    checkFakeUrl(videoFile, "processUrl", video.processUrl, problems);
    checkFakeUrl(videoFile, "thumbnail", video.thumbnail, problems);
    // 6. 퍼플즈 주소가 임베드로 바뀔 수 있는 형식인지
    checkPerplzProcessUrl(videoFile, video.processUrl, problems);

    for (const dupe of findDuplicates(video.relatedServices)) {
      problems.push(`videos/${video.slug}.mdx — relatedServices 에 "${dupe}" 가 중복 있습니다.`);
    }

    for (const serviceSlug of video.relatedServices) {
      if (!serviceSlugs.has(serviceSlug)) {
        problems.push(
          `videos/${video.slug}.mdx — relatedServices 의 "${serviceSlug}" 에 해당하는 ` +
            `content/services/${serviceSlug}.mdx 가 없습니다.`,
        );
        continue;
      }
      const service = services.find((s) => s.slug === serviceSlug)!;
      if (!service.relatedVideos.includes(video.slug)) {
        problems.push(
          `양방향 참조 불일치: videos/${video.slug}.mdx 는 "${serviceSlug}" 를 가리키는데, ` +
            `services/${serviceSlug}.mdx 의 relatedVideos 에 "${video.slug}" 가 없습니다.`,
        );
      }
    }
  }

  if (problems.length) throw new ContentError(problems);
}
