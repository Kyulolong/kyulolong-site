import Link from "next/link";
import { Brand } from "@/components/brand";
import { INTERNAL_LINKS } from "@/lib/site-links";

const NAV = [
  { label: "서비스", href: INTERNAL_LINKS.services },
  { label: "영상", href: INTERNAL_LINKS.videos },
  { label: "소개", href: INTERNAL_LINKS.about },
];

/**
 * 얇은 헤더 (DESIGN.md §8).
 *
 * 헤더에 버튼을 넣지 않는다. 히어로의 Primary 버튼이 그 화면의 형광 한 점인데,
 * 헤더에도 CTA 를 두면 첫 화면에 형광이 둘이 되어 예산(§2)이 깨진다.
 */
export function SiteHeader() {
  return (
    <header className="border-line/70 bg-canvas/85 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-6 sm:px-8">
        <Brand />

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink-soft hover:bg-surface-2 hover:text-ink rounded-full px-3.5 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
