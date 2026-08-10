import type { Metadata } from "next";
import { Analytics } from "@/components/analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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

export const metadata: Metadata = {
  title: {
    default: "규로롱",
    template: "%s · 규로롱",
  },
  description:
    "인사담당 출신이 IT 서비스를 만듭니다. 만든 서비스와 소스코드, 만드는 과정을 남긴 영상을 모아둡니다.",
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
