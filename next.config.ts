import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  // Docker runner 단계에 .next/standalone 만 복사하기 위함 (Coolify 배포)
  output: "standalone",

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
