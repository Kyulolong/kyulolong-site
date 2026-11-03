import Link from "next/link";
import { Brand } from "@/components/brand";
import { INTERNAL_LINKS, PRIMARY_NAV } from "@/lib/site-links";

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
          {/* 맨 오른쪽에 있던 오픈채팅 링크는 2026-11-03 에 뺐다 — 방을 운영하지 않는다.
              테마 토글은 그대로 화면 우측 아래다 (components/theme-toggle.tsx). */}
        </div>
      </div>
    </header>
  );
}
