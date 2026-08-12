import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  /** 제목 아래 한 줄. 섹션 하나에 이야기 하나 (DESIGN.md §4) */
  description?: string;
  /** "전체 보기" 가 걸릴 곳. 없으면 링크를 그리지 않는다. */
  href?: string;
  /** 목록 개수 같은 부가 정보 (고정폭으로 그린다) */
  meta?: string;
}

export function SectionHeading({ title, description, href, meta }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h2 className="flex items-baseline gap-2.5 text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
          {title}
          {meta ? (
            <span className="text-ink-faint font-mono text-sm font-normal tabular-nums">
              {meta}
            </span>
          ) : null}
        </h2>
        {description ? (
          <p className="text-ink-soft mt-2 max-w-[52ch] text-[0.9375rem]">{description}</p>
        ) : null}
      </div>

      {/* 알약도 화살표도 없다 (DESIGN.md §6). 목록으로 가는 보조 링크라
          버튼처럼 보일 이유가 없고, "전체 보기" 가 이미 목적지를 말한다. */}
      {href ? (
        <Link
          href={href}
          className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink shrink-0 text-sm font-medium whitespace-nowrap underline underline-offset-[6px] transition-colors"
        >
          전체 보기
        </Link>
      ) : null}
    </div>
  );
}
