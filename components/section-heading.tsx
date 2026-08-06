import Link from "next/link";

interface SectionHeadingProps {
  title: string;
  /** "전체 보기 →" 가 걸릴 곳 */
  href: string;
  /** 목록 개수 같은 부가 정보 (고정폭으로 그린다) */
  meta?: string;
}

export function SectionHeading({ title, href, meta }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-4">
      <h2 className="flex items-baseline gap-2.5 text-lg font-bold sm:text-xl">
        {title}
        {meta ? <span className="text-muted font-mono text-xs">{meta}</span> : null}
      </h2>
      <Link
        href={href}
        className="text-muted hover:text-accent shrink-0 text-sm whitespace-nowrap transition-colors"
      >
        전체 보기 <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
