/**
 * Umami 셀프호스팅에서 오늘 방문자 수를 읽어온다. **서버 전용**.
 *
 * CLAUDE.md 11번의 규칙("DB 를 홈페이지의 필수 경로에 넣지 말 것")이 여기에도
 * 그대로 걸린다. 애널리틱스는 Supabase 보다도 덜 중요한 부속이므로, 이 파일은
 * 무슨 일이 있어도 던지지 않고 null 을 준다. 부르는 쪽은 null 을 받으면
 * 숫자를 아예 안 그린다 — 푸터에 에러가 뜨느니 아무것도 없는 게 낫다.
 *
 * 여기서 읽는 환경변수에는 NEXT_PUBLIC_ 접두어가 없다. Next 는 그 접두어가 붙은
 * 것만 브라우저 번들에 인라인하므로, 실수로 클라이언트에서 import 해도
 * 비밀번호가 새지 않는다 (값이 통째로 undefined 가 되어 null 을 반환한다).
 */

/** 끝 슬래시를 떼서 `//api/...` 가 되는 걸 막는다 */
const host = process.env.UMAMI_HOST?.replace(/\/+$/, "");
const websiteId = process.env.UMAMI_WEBSITE_ID;
const username = process.env.UMAMI_USERNAME;
const password = process.env.UMAMI_PASSWORD;

export const isAnalyticsReadConfigured = Boolean(
  host && websiteId && username && password,
);

/**
 * Umami 가 안 뜬 날 요청이 매달려 있으면 안 된다.
 * 푸터 숫자 하나 때문에 라우트가 붙잡히느니 빨리 포기하는 게 맞다.
 */
const TIMEOUT_MS = 4000;

/**
 * 로그인 토큰은 메모리에 둔다. 컨테이너가 하나라 이걸로 충분하고,
 * 재시작하면 다시 받으면 된다 — 굳이 디스크에 남길 이유가 없다.
 */
let token: string | null = null;
/** 동시에 여러 요청이 들어와도 로그인은 한 번만 하도록 묶는다 */
let pendingLogin: Promise<string | null> | null = null;

async function login(): Promise<string | null> {
  try {
    const res = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ username, password }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const t = (data as { token?: unknown } | null)?.token;
    return typeof t === "string" ? t : null;
  } catch {
    return null;
  }
}

function getToken(): Promise<string | null> {
  if (token) return Promise.resolve(token);
  pendingLogin ??= login().then((t) => {
    token = t;
    // 실패했으면 다음 호출이 다시 시도할 수 있게 비워둔다
    pendingLogin = null;
    return t;
  });
  return pendingLogin;
}

/**
 * 토큰이 만료되면 401 이 온다. 그때 한 번만 다시 로그인해서 재시도한다.
 * 두 번째도 실패하면 포기 — 무한 재시도로 Umami 를 두드리지 않는다.
 */
async function authedFetch(path: string, retry = true): Promise<unknown | null> {
  const t = await getToken();
  if (!t) return null;

  try {
    const res = await fetch(`${host}${path}`, {
      headers: { authorization: `Bearer ${t}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (res.status === 401 && retry) {
      token = null;
      return authedFetch(path, false);
    }
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Umami 버전에 따라 지표가 숫자로 오기도 하고 `{ value, prev }` 로 오기도 한다.
 * 둘 다 받아준다 — 업그레이드 한 번에 푸터 숫자가 조용히 사라지지 않도록.
 */
function readMetric(raw: unknown): number | null {
  if (typeof raw === "number") return raw;
  const value = (raw as { value?: unknown } | null)?.value;
  return typeof value === "number" ? value : null;
}

/**
 * 한국 시간 기준 오늘 자정(ms).
 *
 * 컨테이너 타임존은 보통 UTC 라 그대로 쓰면 한국 시간 오전 9시에 날짜가 바뀐다.
 * 한국은 1988년 이후 서머타임이 없어서 고정 +9 로 계산해도 어긋나지 않는다.
 */
function startOfTodayKST(now: number): number {
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const DAY = 24 * 60 * 60 * 1000;
  return Math.floor((now + KST_OFFSET) / DAY) * DAY - KST_OFFSET;
}

/** 오늘(KST) 순 방문자 수. 설정이 없거나 Umami 가 안 되면 null. */
export async function getTodayVisitors(): Promise<number | null> {
  if (!isAnalyticsReadConfigured) return null;

  const now = Date.now();
  const startAt = startOfTodayKST(now);
  const data = await authedFetch(
    `/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${now}`,
  );

  return readMetric((data as { visitors?: unknown } | null)?.visitors);
}

/**
 * 사이트가 열린 뒤 전부. Umami 는 startAt/endAt 을 반드시 요구해서 "전체 기간"
 * 이라는 값이 없다. 가장 오래된 글이 2026-07-09 라 그 앞의 넉넉한 자리를 잡는다 —
 * 이 날짜를 뒤로 미루면 미룬 만큼의 조회가 조용히 사라지므로 앞으로만 당긴다.
 */
const SITE_EPOCH = Date.UTC(2026, 5, 1); // 2026-06-01

/**
 * 글별 조회수. **순 방문자가 아니라 페이지뷰다** — 같은 사람이 새로고침하면 또
 * 센다. 좋아요(visitor uuid 로 중복을 막는다)와 세는 단위가 다르다는 뜻이라,
 * 두 숫자를 나란히 놓을 때 큰 쪽이 조회수인 게 정상이다.
 *
 * 조회수 때문에 테이블을 새로 만들지 않는 이유: Umami 가 이미 URL 별로 세고
 * 있다. Supabase 에 카운터를 두면 `visitor_id` 같은 키가 없어서 curl 반복문
 * 하나로 무한히 부풀릴 수 있는데(좋아요는 uuid 를 새로 만들어야 한다), 여기는
 * 막을 방법이 원리상 없다. Umami 도 완벽하진 않지만 최소한 브라우저에서
 * 스크립트가 돌아야 한 줄이 쌓인다.
 *
 * @returns 슬러그별 조회수. 설정이 없거나 Umami 가 안 되면 null (0 이 아니다 —
 *   부르는 쪽이 "0회"와 "모름"을 구분해야 한다).
 */
export async function getThoughtViews(): Promise<Record<string, number> | null> {
  if (!isAnalyticsReadConfigured) return null;

  const data = await authedFetch(
    `/api/websites/${websiteId}/metrics` +
      `?startAt=${SITE_EPOCH}&endAt=${Date.now()}&type=url&limit=500`,
  );
  if (!Array.isArray(data)) return null;

  const views: Record<string, number> = {};
  for (const row of data) {
    const { x, y } = (row ?? {}) as { x?: unknown; y?: unknown };
    if (typeof x !== "string" || typeof y !== "number") continue;

    /*
     * `/thoughts/foo?ref=insta` 나 `/thoughts/foo/` 가 각각 다른 줄로 올 수 있다.
     * 쿼리와 끝 슬래시를 떼서 같은 글로 합친다 — 인스타에서 오는 링크에 파라미터가
     * 붙는 날이 있고, 안 합치면 그날치 조회가 통째로 빠진다.
     */
    const path = x.split(/[?#]/, 1)[0].replace(/\/+$/, "");
    const slug = path.startsWith("/thoughts/") ? path.slice("/thoughts/".length) : null;
    // 목록(/thoughts)과 더 깊은 경로는 세지 않는다
    if (!slug || slug.includes("/")) continue;

    views[slug] = (views[slug] ?? 0) + y;
  }

  return views;
}
