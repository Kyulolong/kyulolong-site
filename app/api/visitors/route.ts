import { getTodayVisitors } from "@/lib/analytics";

/**
 * 푸터의 "오늘 N명" 이 읽는 곳.
 *
 * 이 라우트를 따로 두는 이유는 CLAUDE.md 11번과 같다. 푸터는 모든 페이지에 있어서
 * 서버 컴포넌트에서 숫자를 읽으면 사이트 전체가 애널리틱스에 묶인다. 게다가 이
 * 프로젝트는 cacheComponents 를 안 쓰고 대부분의 페이지가 완전 정적이라, 서버에서
 * 읽으면 그 숫자가 **빌드 시점 값으로 굳어서 재배포 전까지 안 바뀐다.**
 *
 * 그래서 헤더의 로그인 상태(components/auth-status.tsx)와 같은 방식을 쓴다:
 * 페이지는 정적으로 나가고, 숫자는 클라이언트가 이 라우트에서 따로 받아온다.
 */

/** 빌드 때 미리 그리려다 Umami 를 두드리는 일이 없도록 못을 박는다 */
export const dynamic = "force-dynamic";

/**
 * 컨테이너가 하나라 메모리 캐시로 충분하다.
 * 실패는 짧게 잡아서, Umami 가 돌아오면 1분 안에 숫자가 다시 살아나게 한다.
 */
const OK_TTL_MS = 5 * 60 * 1000;
const FAIL_TTL_MS = 60 * 1000;

let cached: { at: number; visitors: number | null } | null = null;
/** 캐시가 비었을 때 동시에 들어온 요청이 Umami 를 여러 번 때리지 않도록 묶는다 */
let pending: Promise<number | null> | null = null;

function isFresh(entry: { at: number; visitors: number | null }): boolean {
  const ttl = entry.visitors === null ? FAIL_TTL_MS : OK_TTL_MS;
  return Date.now() - entry.at < ttl;
}

export async function GET() {
  if (!cached || !isFresh(cached)) {
    /*
     * getTodayVisitors 는 스스로 다 잡아서 null 을 주지만 catch 를 한 겹 더 둔다.
     * 만약 여기가 reject 되면 pending 이 영원히 그 실패한 프로미스로 남아서
     * 푸터 장식 하나 때문에 이 라우트가 계속 500 을 뱉게 된다.
     */
    pending ??= getTodayVisitors()
      .catch(() => null)
      .then((visitors) => {
        cached = { at: Date.now(), visitors };
        pending = null;
        return visitors;
      });
    await pending;
  }

  const visitors = cached?.visitors ?? null;

  return Response.json(
    { visitors },
    {
      headers: {
        // 브라우저·프록시도 같은 리듬으로 쉬게 한다
        "cache-control": `public, max-age=${
          (visitors === null ? FAIL_TTL_MS : OK_TTL_MS) / 1000
        }`,
      },
    },
  );
}
