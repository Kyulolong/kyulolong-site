interface PageHeaderProps {
  /** 위에 붙는 작은 라벨. 대문자 라벨은 자간을 벌린다 (DESIGN.md §5) */
  eyebrow?: string;
  title: string;
  description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="pt-16 pb-10 sm:pt-24 sm:pb-14">
      {eyebrow ? (
        <p className="text-ink-faint mb-4 font-mono text-xs tracking-[0.12em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-[clamp(2rem,5vw,3rem)] leading-[1.15] font-extrabold tracking-[-0.03em] text-balance">
        {title}
      </h1>
      {description ? (
        <p className="text-ink-soft mt-5 max-w-[46ch] text-lg text-pretty">{description}</p>
      ) : null}
    </header>
  );
}
