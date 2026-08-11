import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

/**
 * page.tsx 가 "use client" 라서 거기서는 metadata 를 내보낼 수 없다.
 * 이 한 장이 그 자리를 대신한다 (렌더는 children 을 그대로 흘려보낸다).
 *
 * noindex 인 이유: 검색에서 이 사이트를 처음 만나는 자리가 로그인 화면이면,
 * "로그인 없이 전부 열린다"(CLAUDE.md 3번)는 이 사이트의 논지가 첫 화면에서
 * 뒤집힌다. app/robots.ts 가 크롤링도 함께 막지만, 다른 데서 링크가 걸려
 * 색인될 수 있으므로 페이지에도 적어둔다.
 */
export const metadata: Metadata = pageMetadata({
  title: "로그인",
  description:
    "규로롱 계정 하나로 모든 서비스가 이어집니다. 로그인은 선택이에요 — 안 해도 전부 쓸 수 있고, 하면 저장한 것들이 따라옵니다.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
