import { getService, getServices, getVideo, getVideos } from "./loader";
import type { Service, Video } from "./types";

export {
  getServices,
  getVideos,
  getService,
  getVideo,
  clearContentCache,
  ContentError,
} from "./loader";
export { validateContent } from "./validate";
export {
  SERIES,
  PLATFORMS,
  SERVICE_STATUS,
  RESERVED_PATHS,
  type Series,
  type Platform,
  type ServiceStatus,
  type Service,
  type Video,
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

/** 필터 UI 가 쓸 태그 목록. 많이 쓰인 순, 동수면 가나다순. */
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

export function getRelatedServices(video: Video): Service[] {
  return video.relatedServices
    .map((slug) => getService(slug))
    .filter((s): s is Service => s !== undefined);
}

/**
 * 앱스토어에 올라간 앱인지. `url` 하나만 보고 판별한다.
 *
 * 히어로가 "앱스토어까지"를 약속하는데(components/hero.tsx) 그 근거가 목록에
 * 하나도 안 보였다 — 카드는 `url` 을 쓰지 않아서 아홉 장이 전부 같은 얼굴이고,
 * 앱스토어 앱이라는 사실은 상세 본문까지 들어가야 나왔다. 그 약속을 그리드에서
 * 받아주는 게 이 함수의 유일한 목적이라, 뱃지 글자도 "앱스토어"로 맞춰 뒀다.
 * 히어로에서 읽은 단어가 카드에 그대로 있어야 증거로 이어진다.
 *
 * ⚠️ 슬러그를 적지 않는다. 여기에 `mobile-prompt` 를 박으면 iOS 앱을 하나 더
 * 올릴 때 코드를 고쳐야 하고, 그건 "서비스 추가 = MDX 하나"(CLAUDE.md 5번)가
 * 깨지는 지점이다. 호스트만 보므로 새 앱은 frontmatter 만으로 뱃지를 얻는다.
 *
 * ⚠️ "외부 주소인가"로 넓히지 말 것. 퍼플즈(perplz.com)까지 걸려서 `팀` 과
 * 뱃지 두 개가 겹치고, 무엇보다 "외부"는 아무 무게도 없는 정보다. 이 뱃지가
 * 값어치를 갖는 건 아홉 장 중 한 장에만 붙기 때문이다.
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
