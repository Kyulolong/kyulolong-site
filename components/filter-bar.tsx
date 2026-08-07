import Link from "next/link";

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
              ? "bg-ink text-canvas inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium"
              : "bg-surface-2 text-ink-soft hover:bg-line inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
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
