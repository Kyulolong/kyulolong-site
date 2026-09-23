import Link from "next/link";
import { Brand } from "@/components/brand";
import { INTERNAL_LINKS, KAKAO_OPENCHAT, PRIMARY_NAV } from "@/lib/site-links";

export function SiteHeader() {
  return (
    <header className="border-line/70 bg-canvas/85 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between px-6 sm:px-8 md:h-16">
        <Brand />
        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 md:flex">
            {PRIMARY_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink-soft hover:text-ink text-sm font-medium transition-colors">{item.label}</Link>
            ))}
          </nav>
          <Link href={INTERNAL_LINKS.proof} className="border-line-strong text-ink hover:bg-surface-2 hidden min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors md:inline-flex">Proof 코칭</Link>
          <Link href={INTERNAL_LINKS.about} className="text-ink-soft hover:text-ink inline-flex min-h-11 items-center text-sm md:hidden">소개</Link>
          {/* 맨 오른쪽은 오픈채팅 (2026-09-23). 예전엔 테마 토글 자리였는데 토글은 화면 우측 아래로
              내려갔다 (components/theme-toggle.tsx). 모양은 네비 링크와 같다 — 헤더의 알약은 Proof 하나다
              (DESIGN.md §8 의 예외). 밖으로 나가는 링크라 새 탭. */}
          <a href={KAKAO_OPENCHAT.href} target="_blank" rel="noreferrer noopener" className="text-ink-soft hover:text-ink inline-flex min-h-11 items-center text-sm font-medium transition-colors" data-umami-event="header-community-open">{KAKAO_OPENCHAT.label}</a>
        </div>
      </div>
    </header>
  );
}
