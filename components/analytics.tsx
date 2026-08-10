import Script from "next/script";

/**
 * Umami 수집 스크립트 (셀프호스팅).
 *
 * 이 레포가 하는 일은 이 태그 하나가 전부다. 집계·저장·대시보드는 전부 별도
 * 컨테이너에 있고, 여기는 DB 를 모른다 (CLAUDE.md 11번).
 *
 * kyulolong.com/* 가 전부 같은 오리진이라(2번), 서비스 앱들도 **같은 website id 로**
 * 이 태그 하나만 붙이면 `/navigator`, `/wave-sound` 가 한 대시보드에 경로별로 잡힌다.
 * 서비스가 60개가 되어도 계측 코드는 앱마다 한 줄씩이다.
 *
 * ⚠️ NEXT_PUBLIC_ 값은 빌드 타임에 구워진다 — Coolify 에선 "Build Variable" 체크 필수 (9번).
 */

const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
const websiteId = process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID;

/** 서비스가 실제로 사는 호스트. next.config.ts 의 CANONICAL_HOST 와 같은 값이다. */
const CANONICAL_HOST = "kyulolong.com";

export function Analytics() {
  // 설정이 없으면 아무것도 안 붙인다 — 로컬 개발과 첫 배포가 그대로 돌아가야 한다
  if (!src || !websiteId) return null;

  return (
    <Script
      src={src}
      data-website-id={websiteId}
      /*
       * 이 호스트에서 열렸을 때만 집계한다. 로컬(localhost)·미리보기 도메인의
       * 트래픽이 섞이면 "오늘 N명" 이 내가 개발한 횟수를 세게 된다.
       * www 는 next.config.ts 가 apex 로 308 하므로 여기 넣지 않는다.
       */
      data-domains={CANONICAL_HOST}
      /* 분석 스크립트의 표준 자리 — 첫 렌더를 막지 않고 하이드레이션 뒤에 붙는다 */
      strategy="afterInteractive"
    />
  );
}
