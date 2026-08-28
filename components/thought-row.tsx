import Link from "next/link";
import { formatDate } from "@/components/video-card";
import { readingMinutes, type Thought } from "@/lib/content";
import { summarize } from "@/lib/seo";

/**
 * 글 목록의 한 줄. 대문과 `/thoughts` 가 같이 쓴다.
 *
 * **카드가 아니라 줄이다.** 서비스·영상은 그림이 본체라 카드가 맞지만, 글은
 * 제목이 본체다. 카드로 그리면 썸네일 자리가 생기고, 그 자리를 채우려면 매주
 * 이미지를 만들어야 한다 — 그 부담이 곧 안 쓰게 되는 이유가 된다 (스펙 5번).
 *
 * 상자도 알약도 없다 (DESIGN.md §6). 구분은 아래 선 하나뿐이고, 눌리는 건
 * 제목이 아니라 줄 전체다 — 모바일에서 손가락이 어디를 짚어도 열려야 한다.
 */
export function ThoughtRow({ thought }: { thought: Thought }) {
  const summary = thought.summary ?? summarize(thought.body, 110);

  return (
    <Link
      href={`/thoughts/${thought.slug}`}
      className="border-line hover:border-line-strong group block border-b py-6 transition-colors sm:py-7"
    >
      {/* 메타가 제목 위에 온다. 훑는 사람이 시리즈로 먼저 걸러 읽기 때문에,
          제목 아래로 내리면 그 판단이 한 박자 늦는다. */}
      <p className="text-ink-faint flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs tracking-[0.04em] tabular-nums">
        <span className="text-ink-soft font-sans font-semibold tracking-normal">
          {thought.series}
        </span>
        <span aria-hidden="true" className="opacity-40">
          ·
        </span>
        <time dateTime={thought.publishedAt}>{formatDate(thought.publishedAt)}</time>
        <span aria-hidden="true" className="opacity-40">
          ·
        </span>
        {/* 읽기 전에 "지금 읽을까"를 정하게 해주는 유일한 숫자다 */}
        <span>{readingMinutes(thought.body)}분</span>
      </p>

      <h3 className="group-hover:text-ink-soft mt-2 text-[clamp(1.25rem,4vw,1.5rem)] leading-[1.35] font-bold tracking-[-0.02em] text-pretty transition-colors">
        {thought.title}
      </h3>

      {summary ? (
        <p className="text-ink-soft mt-2 max-w-[58ch] text-[0.9375rem] text-pretty">{summary}</p>
      ) : null}
    </Link>
  );
}
