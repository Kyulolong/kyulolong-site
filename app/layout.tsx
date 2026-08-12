import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

/**
 * 폰트는 next/font 를 쓰지 않는다.
 *
 * Pretendard 다이나믹 서브셋은 unicode-range 로 92조각씩 쪼개져 있어서
 * 브라우저가 페이지에 실제로 쓰인 글자가 든 조각만 받는다. next/font 는
 * unicode-range 를 다루지 못하므로 @font-face 를 직접 쓴다.
 * 조각 파일은 public/fonts/ 에 두고 같은 오리진에서 서빙한다 — LTE 에서는
 * CDN 을 한 곳 더 거치는 왕복이 파일 전송보다 오래 걸린다.
 *
 * 정의는 app/pretendard.css (scripts/sync-fonts.mjs 가 생성) 에 있고
 * globals.css 가 import 한다.
 */

/**
 * 사이트 공통 메타데이터.
 *
 * metadataBase 가 없으면 Next 는 og:image 를 절대 주소로 만들지 못하고
 * (카톡·슬랙은 상대경로 이미지를 못 받는다) canonical 도 경로로만 나간다.
 *
 * canonical 과 og:url 은 **여기 두지 않는다.** 자식이 alternates 를 정의하지
 * 않으면 부모 것을 그대로 물려받으므로, 루트에 "/" 를 박으면 15개 페이지가
 * 전부 랜딩을 canonical 로 가리키게 된다. 페이지별로 pageMetadata() 가 채운다.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  // 페이지가 openGraph 를 정의하지 않았을 때의 최소한. 실제로는 각 페이지가 채운다.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ko_KR",
    title: { absolute: SITE_TITLE },
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: { absolute: SITE_TITLE },
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  /**
   * 검색엔진 소유 확인. `other` 로 넣는 이유는 Next 가 이름을 아는 것이
   * google·yahoo·yandex·me 넷뿐이라 네이버는 직접 적어야 하기 때문이다.
   *
   * 루트에 두면 모든 페이지의 <head> 에 실린다. 네이버·구글 다 루트 하나만
   * 읽지만, 확인용 태그를 특정 페이지에만 두면 그 페이지가 지워질 때
   * 소유 확인이 조용히 풀린다. 12번의 robots·sitemap 과 같은 이유로 여기 둔다.
   */
  verification: {
    other: {
      "naver-site-verification":
        "2ea81debcd5bc6b8389fd68b612c1e009959092f",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="bg-canvas text-ink flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
