import type { Service, Video } from "./content/types";

/**
 * 좋아요 개수를 서버에서 읽는다 (읽기 전용).
 *
 * 테이블 정의와 왜 함수/뷰로만 여는지는 supabase/likes.sql 에 있다.
 * 누르는 쪽은 브라우저가 직접 RPC 를 부른다 (components/like-button.tsx).
 *
 * ⚠️ 이 파일은 **절대 던지지 않는다.** 랜딩이 이걸 부르기 때문이다 —
 * Supabase 셀프호스팅은 컨테이너가 10개짜리라 안 뜨는 날이 있고, 그날
 * kyulolong.com 대문이 같이 죽으면 안 된다 (CLAUDE.md 11번).
 * 실패하면 빈 객체를 주고, 부르는 쪽은 "좋아요 0" 이 아니라 "모름" 으로 다룬다.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isLikesConfigured = Boolean(url && anon);

/** 서비스와 영상이 같은 테이블을 kind 로 나눠 쓴다 (supabase/likes.sql) */
export const LIKE_KINDS = ["service", "video"] as const;
export type LikeKind = (typeof LIKE_KINDS)[number];

/** kind 별 { 슬러그: 개수 }. 슬러그는 services/videos 사이에서 겹칠 수 있다. */
export type LikeCounts = Record<LikeKind, Record<string, number>>;

export function emptyCounts(): LikeCounts {
  return { service: {}, video: {} };
}

/** 응답을 기다리다 페이지 생성이 물리지 않게 한다 */
const TIMEOUT_MS = 4000;

/**
 * @param revalidate 초 단위. 넘기면 Next 데이터 캐시에 그만큼 얹는다.
 *
 * ⚠️ 랜딩은 반드시 이 값을 넘겨야 한다. `no-store` 로 두면 그 fetch 하나가
 * 페이지를 통째로 동적 렌더로 끌어내려서, 방문자 요청마다 Supabase 를 부르게 된다 —
 * 하루 한 번만 굽자고 정한 것이 정반대가 된다. API 라우트는 자기 메모리 캐시를
 * 따로 들고 있으므로 여기서는 캐시하지 않는다.
 */
export async function getLikeCounts(revalidate?: number): Promise<LikeCounts> {
  if (!url || !anon) return emptyCounts();

  try {
    const res = await fetch(`${url}/rest/v1/content_like_counts?select=kind,slug,likes`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(revalidate === undefined
        ? { cache: "no-store" as const }
        : { next: { revalidate } }),
    });
    if (!res.ok) return emptyCounts();

    const rows: unknown = await res.json();
    if (!Array.isArray(rows)) return emptyCounts();

    const counts = emptyCounts();
    for (const row of rows) {
      const { kind, slug, likes } = row as { kind?: unknown; slug?: unknown; likes?: unknown };
      if (
        typeof slug === "string" &&
        typeof likes === "number" &&
        (kind === "service" || kind === "video")
      ) {
        counts[kind][slug] = likes;
      }
    }
    return counts;
  } catch {
    // 네트워크 실패·타임아웃·JSON 깨짐 전부 여기로 모인다. 숫자는 장식이다.
    return emptyCounts();
  }
}

/**
 * 랜딩에 세울 순서.
 *
 *   첫 자리 = 가장 최근에 올린 것 (좋아요와 무관하게 고정)
 *   나머지  = 좋아요 많은 순 → 동수면 들어온 순서(추천 우선 + 최신순)
 *
 * 첫 자리를 고정하는 이유: 매주 하나씩 올리는 채널이라 이번 주에 올린 게
 * 대문에 없으면 그 주의 릴스가 갈 곳을 잃는다. 새 것은 좋아요가 늘 0에서
 * 시작하므로, 순수 좋아요순으로 두면 새 것은 영영 대문에 못 선다.
 *
 * 좋아요를 못 읽었을 때(Supabase 다운)는 counts 가 비어서 전부 동수가 되고,
 * 결과적으로 지금과 같은 기본 정렬이 된다 — 순서가 이상해지는 게 아니라
 * 원래 순서로 돌아간다.
 *
 * @param canPin 첫 자리에 설 자격. 목록에서 빼는 게 아니라 **고정석에만** 거는
 *   조건이라, 자격이 없는 것도 뒤쪽 자리에는 좋아요순으로 그대로 들어온다.
 */
function newestThenLiked<T extends { slug: string; publishedAt: string }>(
  items: T[],
  counts: Record<string, number>,
  canPin: (item: T) => boolean = () => true,
): T[] {
  if (items.length === 0) return [];

  const pinnable = items.filter(canPin);
  // 세울 게 하나도 없으면(전부 준비 중) 고정석을 비우고 통째로 좋아요순으로 간다
  const newest = pinnable.length
    ? pinnable.reduce((a, b) => (b.publishedAt.localeCompare(a.publishedAt) > 0 ? b : a))
    : null;

  const rest = items
    .filter((item) => item.slug !== newest?.slug)
    // 들어온 순서를 tiebreak 로 쓰려면 안정 정렬이어야 한다. Array#sort 는 안정이다.
    .sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0));

  return newest ? [newest, ...rest] : rest;
}

export function orderServicesForHome(
  services: Service[],
  counts: Record<string, number>,
): Service[] {
  /**
   * 팀으로 만든 것은 랜딩에 세우지 않는다.
   *
   * 대문 네 장이 "혼자서 이만큼 된다" 를 말하는 자리라(CLAUDE.md 4번) 거기
   * 팀 산출물이 섞이면 그 말이 흐려진다. 특히 '최신작 고정' 자리는 날짜만
   * 보므로, 거르지 않으면 팀 프로젝트 하나가 그 자리를 계속 차지한다.
   *
   * 지금 team: true 인 MDX 는 하나도 없다 — 유일했던 퍼플즈를 2026-08-28 에
   * 뺐다. 이 줄은 다시 생길 때를 위한 것이라 지우지 않는다.
   *
   * ⚠️ **아직 못 여는 것(status: soon)은 첫 자리에 세우지 않는다.**
   * 그 자리가 말하는 건 "이번 주에 올린 것"인데, 준비 중인 카드는 눌러 들어가도
   * "아직 열어드릴 수 있는 주소가 없어요"로 끝난다. 대문에서 가장 먼저 닿는
   * 카드가 막다른 길이면 바로 위 섹션의 "전부 로그인 없이 바로 열립니다"가
   * 첫 클릭에서 깨진다. 날짜만 보던 때 실제로 밟았다 — 트릭(2026-08-14, soon)이
   * 주소가 없는 채로 대문 첫 카드를 차지했다.
   *
   * 목록에서 빼는 게 아니라 **고정석에서만** 뺀다. 준비 중인 것도 뒷자리에는
   * 좋아요순으로 들어온다. 다음에 뭐가 오는지는 대문에 보일 만한 정보다.
   *
   * 이 사이트 자신(url 이 "/")은 예전에 여기서 걸렀는데 지금은 세운다.
   * 카드가 가리키는 곳이 대문이 아니라 소개 페이지(/services/kyulolong-site)라
   * 지금 보고 있는 페이지로 돌려보내는 게 아니고, 거기에는 이 레포의
   * 프롬프트·소스·걸린 시간이 있다 — 아직 안 본 문서다. 이 채널의 논지가
   * "가져다 마음껏 만들어라"라(CLAUDE.md 4번) 채널 자신의 소스를 여는 편이
   * 그 논지에 더 맞는다.
   */
  return newestThenLiked(
    services.filter((s) => !s.team),
    counts,
    (s) => s.status === "live",
  );
}

/**
 * 영상도 같은 규칙이다 — 첫 자리는 이번 주 편, 그 뒤는 좋아요순.
 *
 * 서비스와 다른 점은 하나뿐이다: 영상은 연재물이라 회차 순서가 뒤섞이는 값을
 * 치른다. 그래도 첫 자리를 최신으로 고정해두면 "지금 연재 중"이라는 신호는
 * 남는다 — 대문에 이번 주 편이 없는 게 더 큰 손해다.
 */
export function orderVideosForHome(videos: Video[], counts: Record<string, number>): Video[] {
  return newestThenLiked(videos, counts);
}
