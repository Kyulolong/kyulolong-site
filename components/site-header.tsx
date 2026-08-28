import Link from "next/link";
import { AuthStatus } from "@/components/auth-status";
import { Brand } from "@/components/brand";
import { INTERNAL_LINKS, PRIMARY_NAV } from "@/lib/site-links";

/**
 * 헤더는 주요 목적지 셋에 "소개" 를 더해 넷을 그린다.
 * 하단 바(md 미만)는 셋만 그리고, 소개는 대문 안의 요약 + "더 보기" 가 맡는다.
 */
const NAV = [...PRIMARY_NAV, { label: "소개", href: INTERNAL_LINKS.about }];

/**
 * 얇은 헤더 (DESIGN.md §8).
 *
 * 헤더에 버튼을 넣지 않는다. 히어로의 Primary 버튼이 그 화면의 형광 한 점인데,
 * 헤더에도 CTA 를 두면 첫 화면에 형광이 둘이 되어 예산(§2)이 깨진다.
 *
 * 같은 이유로 링크에 알약 hover 를 씌우지 않는다 (DESIGN.md §6). 알약이 뜨는
 * 순간 네비게이션 링크가 버튼으로 읽히고, "헤더에 버튼을 넣지 않는다"가
 * hover 에서만 깨진다. hover 는 색으로만 알린다.
 *
 * ⚠️ **md 미만에서는 링크를 감춘다.** 375px 의 안쪽 폭은 327px 인데 브랜드(~87px)
 * + 링크 넷 + 로그인한 계정 이름(최대 144px)이면 400px 가까이 필요해서 줄이
 * 접혔다. 이동은 하단 바(components/mobile-nav.tsx)가 맡는다.
 *
 * `hidden md:flex` 는 display:none 이라 접근성 트리에서도 빠진다 — 그래서 하단
 * 바와 같은 aria-label 을 써도 두 랜드마크가 동시에 노출되지 않는다.
 *
 * AuthStatus 는 nav 밖으로 뺐다. 로그인은 '이동'이 아니라 '창구'라 하단 바에
 * 내려보내지 않고 모바일에서도 헤더에 남긴다 — 그러려면 nav 만 감출 수 있어야 한다.
 */
export function SiteHeader() {
  return (
    <header className="border-line/70 bg-canvas/85 sticky top-0 z-50 border-b backdrop-blur-md">
      {/* 모바일에서 56px, md 부터 64px. 하단 바가 56px 를 더 가져가므로
          위아래 크롬이 화면의 5분의 1을 넘지 않게 한 칸 줄인다.
          md:h-16 을 지킬 것 — filter-bar 의 sticky top 이 4rem 에 맞춰져 있다. */}
      <div className="mx-auto flex h-14 w-full max-w-[1120px] items-center justify-between px-6 sm:px-8 md:h-16">
        <Brand />

        <div className="flex items-center gap-5 sm:gap-6">
          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-ink-soft hover:text-ink text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {/* 로그인은 '창구'라 헤더에 상시로 둔다. 형광은 안 쓴다 — 이 화면의
              형광 한 점은 히어로 버튼이고, 헤더는 조용해야 한다 (DESIGN.md §8) */}
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
