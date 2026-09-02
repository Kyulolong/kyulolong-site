import { getThoughtViews } from "@/lib/analytics";

/**
 * 글 상세 하단의 "조회 N" 이 읽는 곳.
 *
 * app/api/visitors 와 판박이다 (CLAUDE.md 11번): 글 페이지는 정적으로 나가고
 * 숫자만 여기서 받아간다. 서버 컴포넌트에서 읽으면 그 숫자가 **빌드 시점 값으로
 * 굳어서** 재배포 전까지 안 바뀐다 — 조회수처럼 계속 도는 숫자에서는 그게 가장
 * 나쁜 실패다. 틀린 줄도 모르고 계속 틀려 있다.
 *
 * 슬러그별로 나누지 않고 통째로 준다. 라우트 하나만 캐시하면 어느 글을 열든
 * 같은 응답을 나눠 쓰고, Umami 로 나가는 요청은 5분에 한 번으로 묶인다.
 */

/** 빌드 때 미리 그리려다 Umami 를 두드리는 일이 없도록 못을 박는다 */
export const dynamic = "force-dynamic";

/**
 * 컨테이너가 하나라 메모리 캐시로 충분하다.
 * 5분은 방문자 수와 같은 리듬이다 — 내 조회가 바로 안 보이는 값을 치르는 대신,
 * 글 하나가 인스타에서 터진 날 Umami 를 초당 몇 번씩 두드리지 않는다.
 */
const OK_TTL_MS = 5 * 60 * 1000;
const FAIL_TTL_MS = 60 * 1000;

type Views = Record<string, number>;

let cached: { at: number; views: Views | null } | null = null;
/** 캐시가 비었을 때 몰려든 요청이 Umami 를 여러 번 때리지 않도록 묶는다 */
let pending: Promise<Views | null> | null = null;

function isFresh(entry: { at: number; views: Views | null }): boolean {
  return Date.now() - entry.at < (entry.views === null ? FAIL_TTL_MS : OK_TTL_MS);
}

export async function GET() {
  if (!cached || !isFresh(cached)) {
    /*
     * getThoughtViews 는 스스로 다 잡아서 null 을 주지만 catch 를 한 겹 더 둔다.
     * 여기가 reject 되면 pending 이 영원히 그 실패한 프로미스로 남아서
     * 숫자 하나 때문에 이 라우트가 계속 500 을 뱉게 된다 (visitors 와 같은 함정).
     */
    pending ??= getThoughtViews()
      .catch(() => null)
      .then((views) => {
        cached = { at: Date.now(), views };
        pending = null;
        return views;
      });
    await pending;
  }

  const views = cached?.views ?? null;

  return Response.json(
    // null 은 그대로 내보낸다. 빈 객체로 바꾸면 부르는 쪽에서 "모름"이 "0회"가 된다.
    { views },
    {
      headers: {
        "cache-control": `public, max-age=${
          (views === null ? FAIL_TTL_MS : OK_TTL_MS) / 1000
        }`,
      },
    },
  );
}
