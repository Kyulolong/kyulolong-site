import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * https://kyulolong.com/robots.txt
 *
 * robots.txt 는 규격상 **오리진 루트에만** 놓을 수 있다. 이 오리진의 루트를
 * 서빙하는 건 홈페이지 컨테이너 하나뿐이라(CLAUDE.md 2번), 이 파일은 홈페이지가
 * 아니라 kyulolong.com 전체를 대변한다 — /navigator, /prompt 같은 서비스 앱의
 * 크롤링 규칙도 여기서 정해진다. 서비스 레포에서는 손댈 수 없다.
 *
 * 그래서 기본은 전부 허용이다. 막는 건 두 곳뿐:
 *   /login  — 검색 결과에서 만나면 안 되는 페이지다. 로그인은 문이 아니라 덤이라
 *             (CLAUDE.md 11번) 검색에서 이 문 앞으로 떨어지면 사이트가 거짓말을 한다.
 *   /api/   — 방문자 카운터 같은 JSON 엔드포인트. 색인될 내용이 없다.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/login", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
