import { emptyCounts, getLikeCounts, type LikeCounts } from "@/lib/likes";

/**
 * 카드에 붙는 좋아요 숫자가 읽는 곳.
 *
 * app/api/visitors 와 같은 이유로 라우트를 따로 둔다 (CLAUDE.md 11번):
 * 서비스 카드는 랜딩·목록·상세에 다 있어서 서버 렌더에 숫자를 물리면 사이트
 * 전체가 Supabase 에 묶인다. 페이지는 정적으로 나가고, 숫자만 여기서 받아간다.
 *
 * 랜딩은 예외적으로 서버에서 한 번 읽는다 — 순서를 정해야 해서다. 대신 하루에
 * 한 번만 다시 굽고, 못 읽으면 원래 순서로 떨어진다 (lib/likes.ts).
 */

/** 빌드 때 미리 그리려다 Supabase 를 두드리는 일이 없도록 못을 박는다 */
export const dynamic = "force-dynamic";

/**
 * 컨테이너가 하나라 메모리 캐시로 충분하다.
 * 누른 사람 눈에는 자기 화면이 이미 +1 이므로(낙관적 갱신), 남의 숫자가
 * 1분 늦게 도는 건 문제가 되지 않는다.
 */
const OK_TTL_MS = 60 * 1000;
const FAIL_TTL_MS = 15 * 1000;

let cached: { at: number; counts: LikeCounts | null } | null = null;
/** 캐시가 비었을 때 몰려든 요청이 Supabase 를 여러 번 때리지 않도록 묶는다 */
let pending: Promise<LikeCounts | null> | null = null;

function isFresh(entry: { at: number; counts: LikeCounts | null }): boolean {
  return Date.now() - entry.at < (entry.counts === null ? FAIL_TTL_MS : OK_TTL_MS);
}

export async function GET() {
  if (!cached || !isFresh(cached)) {
    pending ??= getLikeCounts()
      // getLikeCounts 는 스스로 다 잡지만, 여기서 reject 되면 pending 이 영원히
      // 그 실패한 프로미스로 남아 라우트가 계속 500 을 뱉는다 (visitors 와 같은 함정).
      .catch(() => null)
      .then((counts) => {
        cached = { at: Date.now(), counts };
        pending = null;
        return counts;
      });
    await pending;
  }

  const counts = cached?.counts ?? null;

  return Response.json(
    { counts: counts ?? emptyCounts() },
    {
      headers: {
        "cache-control": `public, max-age=${
          (counts === null ? FAIL_TTL_MS : OK_TTL_MS) / 1000
        }`,
      },
    },
  );
}
