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
    <div className="mb-8">
      {/*
        ⚠️ **"전체 보기" 는 설명이 아니라 제목과 짝이다.**

        예전엔 [제목+설명] 덩어리와 링크가 한 flex 의 형제였다. 데스크톱에서는
        설명이 짧아 한 줄에 들어갔지만, 375px 에서는 설명이 두 줄로 늘면서 덩어리가
        폭을 다 먹고 링크가 아래로 떨어졌다 — 목록으로 가는 보조 링크가 갑자기
        제 줄을 갖고 앉아서 섹션이 하나 더 있는 것처럼 보였다.

        지금은 제목 줄 안에서 오른쪽 끝에 붙는다. 설명은 그 아래 전체 폭을 쓴다.
        폭이 좁아져도 링크가 갈 곳이 없으므로 어느 화면에서도 제자리다.
      */}
      <div className="flex items-baseline justify-between gap-x-6">
        <h2 className="flex items-baseline gap-2.5 text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
          {title}
          {meta ? (
            <span className="text-ink-faint font-mono text-sm font-normal tracking-[0.04em] tabular-nums">
              {meta}
            </span>
          ) : null}
        </h2>

        {/* 알약도 화살표도 없다 (DESIGN.md §6). 목록으로 가는 보조 링크라
            버튼처럼 보일 이유가 없고, "전체 보기" 가 이미 목적지를 말한다.
            min-h-11 은 모바일 탭 타깃이라 md 에서 되돌린다 (§12). */}
        {href ? (
          <Link
            href={href}
            className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink inline-flex min-h-11 shrink-0 items-center text-sm font-medium whitespace-nowrap underline underline-offset-[6px] transition-colors md:min-h-0"
          >
            전체 보기
          </Link>
        ) : null}
      </div>

      {description ? (
        <p className="text-ink-soft mt-2 max-w-[52ch] text-[0.9375rem]">{description}</p>
      ) : null}
    </div>
  );
}
