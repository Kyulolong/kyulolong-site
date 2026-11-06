import Link from "next/link";
import { Brand } from "@/components/brand";
import { PRIMARY_NAV } from "@/lib/site-links";

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
          {/* 맨 오른쪽에 있던 오픈채팅 링크는 2026-11-03 에, Proof 코칭 테두리 버튼은 11-06 에 뺐다.
              모바일 전용 소개 글자 링크도 그때 하단 바로 내려갔다 (MOBILE_NAV).
              테마 토글은 그대로 화면 우측 아래다 (components/theme-toggle.tsx). */}
        </div>
      </div>
    </header>
  );
}
