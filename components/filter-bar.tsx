import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 필터 줄이 놓이는 자리. 헤더 바로 밑에 세워 둔다.
 *
 * 그냥 흘려보내면 스크롤할 때 이 줄이 GNB(sticky, z-50) 의 반투명 띠 아래로
 * 반쯤 잠겨서, 칩이 위아래로 잘린 채 지나간다. 목록이 길어질수록(스펙 5번)
 * 필터는 스크롤 도중에 다시 찾게 되는 것이라, 지나가게 두는 대신 붙여 세운다.
 *
 * top 을 1px 올려 헤더의 아래 선과 이 줄의 위 선을 겹친다 — 안 그러면 붙는
 * 순간 1px 선이 두 줄로 보인다. z-40 은 헤더보다 낮다: 겹치면 헤더가 위다.
 *
 * ⚠️ 모바일에서는 세우지 않는다. 태그가 열 개를 넘으면 칩이 서너 줄까지
 * 감기는데, 그 높이가 화면 위에 상시로 박히면 정작 목록을 볼 자리가 없어진다.
 */
export function FilterRail({ children }: { children: ReactNode }) {
  return (
    <div className="border-line bg-canvas/95 mb-10 border-y py-5 md:sticky md:top-[calc(4rem-1px)] md:z-40 md:backdrop-blur-md">
      {children}
    </div>
  );
}

export interface FilterOption {
  label: string;
  /** 이 옵션이 걸린 주소. 링크라서 뒤로가기·새 탭·공유가 전부 그냥 된다. */
  href: string;
  active: boolean;
  /** 개수 같은 부가 정보 */
  meta?: number;
}

interface FilterBarProps {
  /** 스크린리더에 읽힐 이 줄의 이름 ("태그", "정렬" 등) */
  label: string;
  options: FilterOption[];
}

/**
 * 목록 필터 (스펙 5번 — 6개일 땐 불필요해 보이지만 30개가 되면 필수다).
 *
 * 클라이언트 상태 없이 링크로만 만든다. 필터가 주소에 남으니 공유가 되고,
 * JS 가 안 떠도 동작하고, 이 페이지가 서버 렌더로 남는다.
 *
 * 선택된 칩에 형광을 쓰지 않는다 (DESIGN.md §2). 태그가 열 개인 화면에서
 * 선택 칩을 형광으로 칠하면 형광이 열 개가 될 수 있는 구조가 된다.
 * 선택됨 = ink 배경 + canvas 글씨.
 *
 * 알약이 아니라 각진 칩이다 (DESIGN.md §6). 알약은 버튼의 모양이고, 열 개가
 * 나란히 선 이 줄까지 알약이면 화면에서 "누르는 큰 것"이 무엇인지 흐려진다.
 */
export function FilterBar({ label, options }: FilterBarProps) {
  return (
    <nav aria-label={label} className="flex flex-wrap items-center gap-2">
      {options.map((option) => (
        <Link
          key={option.href}
          href={option.href}
          aria-current={option.active ? "true" : undefined}
          className={
            option.active
              ? "bg-ink text-canvas inline-flex min-h-11 items-center gap-1.5 rounded-badge px-3.5 py-2 text-[13px] font-medium md:min-h-0 md:px-3 md:py-1.5"
              : "bg-surface-2 text-ink-soft hover:bg-line inline-flex min-h-11 items-center gap-1.5 rounded-badge px-3.5 py-2 text-[13px] font-medium transition-colors md:min-h-0 md:px-3 md:py-1.5"
          }
        >
          {option.label}
          {option.meta !== undefined ? (
            <span className="font-mono text-[11px] tabular-nums opacity-60">{option.meta}</span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
