import type { NextConfig } from "next";
import { SITE_HOST } from "./lib/seo";

/**
 * 서비스 앱을 같은 오리진의 경로로 붙이는 프록시 설정 (스펙 2번).
 *
 * 스펙이 서브도메인 대신 경로를 택한 이유는 통합 로그인이다. 브라우저가 같은
 * 오리진으로 봐야 Supabase 세션이 자동으로 공유된다. 그 "같은 오리진"을 만드는
 * 방법이 두 가지 있는데, 둘 다 지원하려고 환경변수로 켜고 끈다.
 *
 *   A. 엣지에서 (권장) — Coolify/Traefik 이 kyulolong.com/wave-sound 를 해당
 *      컨테이너로 직접 보낸다. 환경변수를 비워두면 이 파일은 아무것도 안 한다.
 *      홈페이지가 죽어도 서비스는 산다.
 *
 *   B. 여기서 — 아래 환경변수를 채우면 홈페이지 Next 서버가 프록시한다.
 *      로컬에서 localhost:3000/wave-sound 를 그대로 열어보고 싶을 때 쓴다.
 *      운영에 쓰면 모든 서비스 트래픽이 홈페이지 컨테이너를 거치므로,
 *      홈페이지가 죽으면 서비스도 같이 죽는다. 알고 쓰는 게 아니면 A 를 쓸 것.
 *
 * ⚠️ rewrites 는 빌드 타임에 한 번 평가되어 라우트 매니페스트에 구워진다.
 *    Coolify 에 넣을 때 "Build Variable" 을 반드시 체크해야 한다 (스펙 9번).
 *
 * 예: SERVICE_WAVE_SOUND_ORIGIN=http://127.0.0.1:8899
 */
const SERVICE_ORIGINS: Record<string, string | undefined> = {
  "wave-sound": process.env.SERVICE_WAVE_SOUND_ORIGIN,
  prompt: process.env.SERVICE_PROMPT_ORIGIN,
  storyboard: process.env.SERVICE_STORYBOARD_ORIGIN,
  navigator: process.env.SERVICE_NAVIGATOR_ORIGIN,
  "kfood-bingo": process.env.SERVICE_KFOOD_BINGO_ORIGIN,
};

/** 끝 슬래시를 떼서 destination 이 `//` 로 겹치지 않게 한다 */
function normalizeOrigin(origin: string): string {
  return origin.replace(/\/+$/, "");
}

function configuredServices(): { slug: string; origin: string }[] {
  return Object.entries(SERVICE_ORIGINS)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([slug, origin]) => ({ slug, origin: normalizeOrigin(origin) }));
}

/**
 * 서비스가 실제로 사는 호스트. 카카오 등 외부 콘솔에도 이 주소만 등록한다.
 *
 * lib/seo.ts 에서 가져오는 이유: 이 호스트는 여기서 www 를 접는 데도 쓰이고
 * 사이트맵·canonical·og:url 을 만드는 데도 쓰인다. 두 군데에 적어두면 도메인을
 * 옮기는 날 한쪽만 고쳐서, 리다이렉트는 새 주소로 가는데 canonical 은 옛 주소를
 * 가리키는 상태가 된다 — 사람 눈에는 멀쩡해 보이고 검색엔진만 아는 종류의 고장이다.
 */

const nextConfig: NextConfig = {
  // Docker runner 단계에 .next/standalone 만 복사하기 위함 (Coolify 배포)
  output: "standalone",

  /**
   * Turbopack 의 lightningcss 가 light-dark() 를 폴리필하지 못하게 한다.
   *
   * Next 기본 타깃(chrome/edge/firefox 111, safari 16.4)은 넷 다 light-dark() 를
   * 몰라서 폴리필(var(--lightningcss-light, …))이 켜진다. app/globals.css 는 라이트
   * 토큰 전부를 `@supports (color: light-dark(…))` 가드 안에 두므로 구형은 가드가
   * 이미 막고, 폴리필은 할 일이 없다. 그런데 폴리필은 가드 **밖**의 light-dark() 만
   * 골라 바꾸고 최상위 `color-scheme: dark` 에 묶어버려서, 누가 가드 밖에 하나 쓰면
   * 늘 다크로 고정되는 조용한 버그가 된다. 그래서 끈다.
   *
   * experimental 키라 이름이 바뀔 수 있다. 검증은 빌드 뒤 `.next/static` 에
   * "lightningcss" 문자열이 없는지 보는 것이다. 플래그가 안 먹어도 light-dark() 가
   * 가드 안에 있는 한 동작은 같다 — 진짜 방어선은 globals.css 의 그 규칙이다.
   */
  experimental: { lightningCssFeatures: { exclude: ["light-dark"] } },

  /**
   * www 로 들어온 요청을 apex 로 넘긴다.
   *
   * 서비스들은 apex 에만 붙어 있다. Traefik 이 `kyulolong.com/navigator` 만
   * navigator 컨테이너로 보내고, `www.kyulolong.com/navigator` 는 라우팅 규칙이
   * 없어서 이 홈페이지로 떨어져 404 가 된다. 카카오 개발자 콘솔에 등록된 도메인도
   * apex 하나뿐이라 www 로 들어온 사람은 지도가 통째로 안 뜬다.
   *
   * 두 호스트를 각각 등록해서 맞춰 나가는 것보다 창구를 하나로 접는 게 맞다.
   * 서비스가 60개가 되면 등록해야 할 짝이 60쌍이 된다.
   *
   * apex 로 넘어간 뒤엔 host 가 안 맞아서 이 규칙이 다시 걸리지 않는다 — 루프 없음.
   * `:path*` 는 0개도 허용이라 `/` 자체도 잡는다.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${SITE_HOST}` }],
        destination: `https://${SITE_HOST}/:path*`,
        permanent: true,
      },
      // 글의 새 제목에 맞춘 주소. 기존 공유 링크도 같은 글로 연결한다.
      {
        source: "/thoughts/ai-does-not-automatically-reduce-work",
        destination: "/thoughts/next-step-after-working-faster",
        permanent: true,
      },
    ];
  },

  /**
   * `/wave-sound` 와 그 아래 전부를 서비스 오리진으로 넘긴다.
   *
   * 규칙은 하나면 된다. `:path*` 는 0개도 허용이라 이 패턴이 `/wave-sound` 자체도
   * 잡는다 (매니페스트 정규식에서 경로 그룹이 통째로 optional 이다).
   *
   * 끝 슬래시를 붙이는 redirect 를 따로 두면 안 된다. Next 는 매칭할 때 끝 슬래시를
   * 무시해서 `/wave-sound` 규칙이 `/wave-sound/` 에도 걸리고, 리다이렉트가 자기
   * 자신을 가리켜 무한 루프가 된다. (한 번 밟았다)
   */
  async rewrites() {
    return configuredServices().map(({ slug, origin }) => ({
      source: `/${slug}/:path*`,
      destination: `${origin}/:path*`,
    }));
  },
};

export default nextConfig;
