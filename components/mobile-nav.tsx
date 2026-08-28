"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV } from "@/lib/site-links";

/**
 * 하단 고정 네비 — 모바일 전용 (md 미만).
 *
 * 왜 있나: 예전엔 헤더의 데스크톱 네비가 375px 에서도 그대로 그려졌다.
 * 로그인한 상태에서는 브랜드 + 링크 셋 + 계정 이름이 327px 칸에 400px 가까이
 * 필요해서 줄이 접혔다. 이제 헤더는 모바일에서 링크를 감추고(hidden md:flex)
 * 이동은 전부 여기가 맡는다. 엄지가 닿는 자리이기도 하다.
 *
 * ⚠️ **형광을 쓰지 않는다** (DESIGN.md §2). 375px 대문에서는 히어로의 형광
 * 버튼과 이 바가 같은 화면에 들어와서, 여기에 형광 점을 하나 찍으면 그 화면의
 * 초록이 둘이 된다. §11 의 "스크린샷 찍고 초록을 센다" 에서 바로 걸린다.
 * "상태 점" 예외에 기대볼 수도 있지만 그 예외는 **고정된 것**을 위한 것이고,
 * 활성 탭은 페이지를 옮길 때마다 세 자리를 돌아다닌다 — §2 가 세는 '흩어짐'이
 * 화면이 아니라 시간에 퍼져 있을 뿐이다.
 *
 * ⚠️ **알약도 채운 상자도 없다** (DESIGN.md §6 — 네비 링크는 모양이 없다).
 * 활성 표시는 세 채널로 나눠 준다: 글자 굵기, 잉크 농도, 그리고 바의 위 선에
 * 얹히는 2px 눈금. 굵기는 흑백에서도 색맹에서도 살아남는 유일한 채널이라
 * §10 의 "색만으로 정보를 전달하지 않는다" 를 이걸로 만족시킨다.
 *
 * ⚠️ **아이콘을 넣지 않는다.** §6 이 버튼 안 화살표를 금지한 논리가 그대로
 * 적용된다 — 라벨이 이미 목적지를 말하면 그림이 더하는 정보는 0이다. 게다가
 * "생각들"·"만든 것" 에는 관습적인 아이콘이 없어서 은유를 새로 만들어야 하고,
 * 그렇게 만든 넉 장은 16px 에서 뭉개진다 (§7 의 캐릭터 마크가 그래서 빠졌다).
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      /* z-40 은 헤더(z-50)보다 낮다 — 겹칠 일은 없지만 위아래가 뒤집히지 않게.
         안전영역 패딩을 안쪽 래퍼가 아니라 바 자신이 갖는다. 그래야 반투명
         배경이 홈 인디케이터 띠까지 내려가서 아래에 흰 줄이 남지 않는다. */
      className="border-line/70 bg-canvas/90 fixed inset-x-0 bottom-0 z-40 border-t pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] backdrop-blur-md md:hidden"
    >
      {/* max-w 는 md 직전(767px)의 태블릿에서 칸 하나가 250px 로 벌어지는 걸 막는다 */}
      <ul className="mx-auto flex h-14 max-w-[30rem] items-stretch">
        {PRIMARY_NAV.map((item) => {
          /* 상세 페이지에서도 그 목록이 켜져 있어야 한다 —
             /thoughts/ax 는 "생각들", /services/navigator 는 "만든 것".
             `/` 와 /start·/login 에서는 아무것도 안 켜진다. 홈은 브랜드 마크가 맡는다. */
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                /* 포커스 링이 바 밖으로 나가면 위아래가 잘린다. 안쪽으로 그린다. */
                className={
                  active
                    ? "text-ink relative flex h-full items-center justify-center text-[0.8125rem] font-semibold focus-visible:outline-offset-[-3px]"
                    : "text-ink-faint active:text-ink-soft relative flex h-full items-center justify-center text-[0.8125rem] font-medium transition-colors focus-visible:outline-offset-[-3px]"
                }
              >
                {active ? (
                  /* 바의 border-t 위에 정확히 얹힌다 — 활성 탭이 위 페이지에
                     붙어 있는 것처럼 읽힌다. 의미는 aria-current 가 이미 전한다. */
                  <span
                    aria-hidden="true"
                    className="bg-ink absolute -top-px left-1/2 h-[2px] w-7 -translate-x-1/2 rounded-full"
                  />
                ) : null}
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
