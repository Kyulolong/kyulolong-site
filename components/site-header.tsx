import Link from "next/link";
import { AuthStatus } from "@/components/auth-status";
import { Brand } from "@/components/brand";
import { PERPLZ_PROFILE_URL, PRIMARY_NAV } from "@/lib/site-links";

/**
 * 헤더의 네 칸 = 네비 셋(PRIMARY_NAV) + 퍼플즈.
 *
 * 네 칸이 상한이다 — 브랜드 + 링크 + 로그인한 계정 이름이 한 줄에 들어와야 한다.
 * 그래서 하나를 넣으려면 하나를 빼야 하고, "영상"이 빠진 자리에 소개가 들어간
 * 경위는 PRIMARY_NAV 쪽에 적어뒀다 (lib/site-links.ts).
 *
 * 퍼플즈는 **내 프로필**이다 (서비스가 아니다 — lib/site-links.ts). 작업 과정이
 * 녹화돼 쌓이는 곳이라, 이 채널이 "만드는 과정을 공유합니다" 라고 말하는 것의
 * 원본이 거기 있다. 푸터의 "퍼플즈" 와 **같은 주소**여야 한다 — 같은 라벨이 두
 * 곳을 가리키면 처음 온 사람은 다른 곳인 줄 안다.
 *
 * 하단 바(md 미만)에는 이 칸이 없다. 세 칸이 상한이고, 밖으로 나가는 링크는
 * 탭 바에 둘 것이 아니다 — 거기 눌린 탭은 '지금 있는 곳'을 뜻한다.
 *
 * 순서: 내부 셋을 붙여 두고 밖으로 나가는 링크를 끝에 둔다. 화살표(↗)는 붙이지
 * 않는다 (DESIGN.md §6) — 헤더가 조용해야 하고, 푸터의 외부 링크도 맨몸이다.
 */
const NAV = PRIMARY_NAV;

/** 밖으로 나가는 칸. 내부 링크와 배열을 나눈 건 렌더가 <a> 와 <Link> 로 갈려서다. */
const EXTERNAL_NAV = [{ label: "퍼플즈", href: PERPLZ_PROFILE_URL }];

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
const NAV_LINK = "text-ink-soft hover:text-ink text-sm font-medium transition-colors";

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
              <Link key={item.href} href={item.href} className={NAV_LINK}>
                {item.label}
              </Link>
            ))}
            {/* 밖으로 나가는 링크는 <a> 다 — next/link 로 감싸면 라우터가 클라이언트
                이동을 시도한다. 새 탭으로 여는 건 여기서 나가는 게 '이동'이 아니라
                '다른 채널을 구경하는 것'이라서다 (푸터의 채널 목록과 같은 규칙). */}
            {EXTERNAL_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer noopener"
                className={NAV_LINK}
              >
                {item.label}
              </a>
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
