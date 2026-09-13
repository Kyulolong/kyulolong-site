import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo";
import { THEME_BOOT_SCRIPT, THEME_COLOR } from "@/lib/theme";
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

/**
 * ⚠️ `viewportFit: "cover"` 가 이 객체의 존재 이유다.
 *
 * Next 의 기본값은 `width=device-width, initial-scale=1` 뿐이라 viewport-fit 이
 * 안 실린다. 그게 없으면 iOS 에서 `env(safe-area-inset-*)` 가 전부 0 으로 풀려서,
 * 하단 바의 홈 인디케이터 여백도 가로 모드의 노치 여백도 아무 일을 안 한다.
 *
 * maximumScale·userScalable 은 넣지 않는다. 확대를 막는 건 DESIGN.md §10 과
 * WCAG 1.4.4 위반이고, 375px 넘침은 구조로 고쳤으니 손댈 이유가 없다.
 *
 * themeColor 는 페이지를 감싸는 사파리·크롬의 주소창 색이다. 페이지 바탕과 같아야
 * 주소창과 페이지 사이에 없던 경계선이 안 생긴다. 바탕이 테마를 따라 둘이 됐으므로
 * OS 별로 둘을 내보낸다 (lib/theme.ts 의 THEME_COLOR — globals.css 의 --color-canvas
 * 양쪽과 같은 값). 헤더 토글로 OS 와 다른 쪽을 고르면 브라우저는 여전히 OS 쪽 meta 를
 * 보므로, applyTheme() 이 두 meta 의 content 를 실제 테마 색으로 덮는다.
 *
 * manifest.ts 의 theme_color 는 다크 그대로다 — 홈 화면 타일과 스플래시는 토글을
 * 못 따라가고, 다크 타일이 의도된 것이라는 이유가 거기 적혀 있다.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* min-h-dvh: min-h-full 은 html.h-full 을 타고 '큰 뷰포트'에 맞춰져서,
       iOS 에서 주소창이 보이는 동안 실제 보이는 높이보다 커진다.

       suppressHydrationWarning: 아래 인라인 스크립트가 하이드레이션 전에 <html> 에
       data-theme 을 붙이므로, React 가 그 속성 차이를 오류로 보지 않게 한다.
       이 요소 하나에만 걸리고 자식으로 번지지 않는다. data-theme 기본값은 두지
       않는다 — 속성 없음이 "OS 를 따른다"는 뜻이다 (lib/theme.ts). */
    <html lang="ko" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* 테마 부트. HTML 파싱 중 동기로 돌아 **첫 페인트 전에** <html data-theme> 을
            세운다. <head> 에 두는 이유이자 next/script 를 안 쓰는 이유다 —
            beforeInteractive 조차 하이드레이션 전일 뿐 첫 페인트 전은 아니다.
            서버는 테마를 모른 채 속성 없이 내보내므로 정적 생성은 그대로다
            (CLAUDE.md 11번). CSP 가 없어 nonce 는 필요 없다. 이 파일이 app/ 아래라
            @next/next/no-head-element 에 안 걸린다 — components/ 로 빼면 걸린다. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="bg-canvas text-ink flex min-h-dvh flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        {/* 푸터 뒤에 둔다 — 보조 네비라 스크린리더가 마지막에 만나는 게 맞고,
            main·footer 와 나란한 최상위 랜드마크가 된다. /login 에서도 남긴다:
            나갈 길이 없는 화면을 만들지 않는다. */}
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}
