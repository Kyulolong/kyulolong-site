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
