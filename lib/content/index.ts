import { getService, getServices, getThoughts, getVideo, getVideos } from "./loader";
import { THOUGHT_SERIES, type Service, type Thought, type ThoughtSeries, type Video } from "./types";

export {
  getServices,
  getVideos,
  getThoughts,
  getService,
  getVideo,
  getThought,
  clearContentCache,
  ContentError,
} from "./loader";
export { validateContent } from "./validate";
export {
  SERIES,
  THOUGHT_SERIES,
  PLATFORMS,
  SERVICE_STATUS,
  RESERVED_PATHS,
  type Series,
  type ThoughtSeries,
  type Platform,
  type ServiceStatus,
  type Service,
  type Video,
  type Thought,
} from "./types";

/** 스펙 5번: 목록에 태그 필터와 정렬을 처음부터 넣어둔다. */
export type SortOrder = "featured" | "recent" | "oldest";

function applySort<T extends { featured?: boolean; publishedAt: string; slug: string }>(
  items: T[],
  sort: SortOrder,
): T[] {
  const sorted = [...items];
  switch (sort) {
    case "recent":
      return sorted.sort(
        (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug),
      );
    case "oldest":
      return sorted.sort(
        (a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug),
      );
    // getServices/getVideos 가 이미 featured 우선 정렬로 돌려준다.
    case "featured":
    default:
      return sorted;
  }
}

export function filterServices(
  options: { tags?: string[]; sort?: SortOrder } = {},
): Service[] {
  const { tags, sort = "featured" } = options;
  let items = getServices();
  if (tags?.length) {
    items = items.filter((s) => tags.every((t) => s.tags.includes(t)));
  }
  return applySort(items, sort);
}

export function filterVideos(
  options: { series?: string; platform?: string; sort?: SortOrder } = {},
): Video[] {
  const { series, platform, sort = "recent" } = options;
  let items = getVideos();
  if (series) items = items.filter((v) => v.series === series);
  if (platform) items = items.filter((v) => (v.platform as string[]).includes(platform));
  return applySort(items, sort);
}

export function filterThoughts(
  options: { series?: string; tags?: string[]; sort?: SortOrder } = {},
): Thought[] {
  const { series, tags, sort = "featured" } = options;
  let items = getThoughts();
  if (series) items = items.filter((t) => t.series === series);
  if (tags?.length) {
    items = items.filter((t) => tags.every((tag) => t.tags.includes(tag)));
  }
  return applySort(items, sort);
}

/**
 * 글 시리즈 칩. 영상의 필터와 달리 **글이 하나도 없는 축은 그리지 않는다.**
 * 시리즈 셋을 다 세워두고 "0" 을 붙이면, 아직 안 쓴 축이 빈 약속으로 보인다.
 */
export function getThoughtSeries(): { series: ThoughtSeries; count: number }[] {
  const counts = new Map<ThoughtSeries, number>();
  for (const thought of getThoughts()) {
    counts.set(thought.series, (counts.get(thought.series) ?? 0) + 1);
  }
  // THOUGHT_SERIES 의 선언 순서를 따른다 — 개수순으로 하면 글을 올릴 때마다
  // 칩이 자리를 바꿔서, 늘 같은 자리를 누르던 사람이 다른 축으로 떨어진다.
  return THOUGHT_SERIES.filter((series) => counts.has(series)).map((series) => ({
    series,
    count: counts.get(series) ?? 0,
  }));
}

/**
 * 읽는 데 걸리는 시간(분).
 *
 * frontmatter 로 받지 않는 이유: 본문을 고칠 때마다 숫자가 어긋나고, 어긋난 걸
 * 아무도 못 알아챈다. 계산해서 쓰면 늘 맞다.
 *
 * 한국어 성인 묵독 속도를 분당 500자로 잡는다. 코드블록·표가 섞이면 실제보다
 * 짧게 나오지만, 이 숫자가 하는 일은 "지금 읽을까 나중에 읽을까"를 정하게
 * 해주는 것뿐이라 그 정도 오차는 상관없다. 0분은 안 나오게 최소 1.
 */
export function readingMinutes(body: string): number {
  const chars = body.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

/**
 * 필터 UI 가 쓸 태그 목록. 많이 쓰인 순, 동수면 가나다순.
 *
 * ⚠️ 여기서 거르는 서비스가 있으면 /services 목록에서도 같은 기준으로 걸러야 한다.
 * 한쪽만 빼면 칩에 적힌 개수와 실제 카드 수가 어긋나고, 그 서비스만 쓰던 태그는
 * 눌러도 빈 화면이 나오는 칩이 된다.
 */
export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const service of getServices()) {
    for (const tag of service.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
}

/**
 * 연결 조회. 참조 무결성은 validateContent 가 빌드 타임에 보장하므로
 * 여기서는 끊긴 링크를 고려하지 않는다.
 */
export function getRelatedVideos(service: Service): Video[] {
  return service.relatedVideos
    .map((slug) => getVideo(slug))
    .filter((v): v is Video => v !== undefined);
}

/**
 * 영상과 글 양쪽이 쓴다. 둘 다 `relatedServices` 를 갖고 있어서 구조 타입으로 받는다 —
 * 타입이 늘 때마다 오버로드를 하나씩 더하는 대신.
 *
 * ⚠️ 영상의 링크는 양방향이 보장되지만(validate.ts) **글의 링크는 단방향이다.**
 * 여기서 갈리는 건 없다 — 어느 쪽이든 가리키는 서비스가 실재하는 건 검증된다.
 */
export function getRelatedServices(item: { relatedServices: string[] }): Service[] {
  return item.relatedServices
    .map((slug) => getService(slug))
    .filter((s): s is Service => s !== undefined);
}

/**
 * 앱스토어에 올라간 앱인지. `url` 하나만 보고 판별한다.
 *
 * 히어로가 "앱스토어까지"를 약속하는데(components/hero.tsx) 그 근거가 목록에
 * 하나도 안 보였다 — 카드는 `url` 을 쓰지 않아서 여덟 장이 전부 같은 얼굴이고,
 * 앱스토어 앱이라는 사실은 상세 본문까지 들어가야 나왔다. 그 약속을 그리드에서
 * 받아주는 게 이 함수의 유일한 목적이라, 뱃지 글자도 "앱스토어"로 맞춰 뒀다.
 * 히어로에서 읽은 단어가 카드에 그대로 있어야 증거로 이어진다.
 *
 * ⚠️ 슬러그를 적지 않는다. 여기에 `mobile-prompt` 를 박으면 iOS 앱을 하나 더
 * 올릴 때 코드를 고쳐야 하고, 그건 "서비스 추가 = MDX 하나"(CLAUDE.md 5번)가
 * 깨지는 지점이다. 호스트만 보므로 새 앱은 frontmatter 만으로 뱃지를 얻는다.
 *
 * ⚠️ "외부 주소인가"로 넓히지 말 것. 남의 도메인에 사는 것이 하나만 늘어도
 * 뱃지가 거기 붙는데, "외부"는 아무 무게도 없는 정보다. 이 뱃지가 값어치를
 * 갖는 건 여덟 장 중 한 장에만 붙기 때문이다.
 */
export function isAppStoreApp(url: string | undefined): boolean {
  if (!url) return false;
  try {
    return new URL(url).hostname.endsWith("apps.apple.com");
  } catch {
    // 내부 경로(`/navigator`)는 URL 로 파싱되지 않는다 — 그게 정상이다
    return false;
  }
}
