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
 *
 * ── 「추천」 뱃지 (2026-09-08)
 *
 * ⚠️ **이 뱃지는 장식이 아니라 날짜가 어긋난 이유를 대는 줄이다.**
 * 목록은 날짜 내림차순이라 읽는 사람이 "위가 최신"으로 읽는다. `featured: true`
 * 인 글이 맨 위로 올라오면 그 규칙이 깨지는데 — 지금도 `08.18` 이 `09.04` 위에
 * 선다 — 뱃지가 없으면 **날짜 정렬이 고장 난 것처럼 보인다.** 그래서 핀을
 * 세우면 표시도 같이 서야 하고, 표시를 지우려면 핀부터 빼야 한다.
 *
 * **글자가 「고정」이 아니라 「추천」인 이유.** `/thoughts` 에서 최신순으로
 * 정렬하면 이 글은 첫 자리를 잃는데, 그때 "고정"은 거짓말이 된다. 추천은 글에
 * 붙는 성질이라 어느 정렬에서도 참이다.
 *
 * 모양은 서비스 카드의 「팀」 뱃지와 같은 것을 쓴다 (components/service-card.tsx) —
 * 알약이 아니라 `rounded-badge`, 보라 면 위에 밝은 글자. 상태지 액션이 아니다
 * (DESIGN.md §6). 글 줄에 뱃지가 이것 하나뿐이라 알갱이로 보이지 않는다. 여기에
 * 태그나 시리즈까지 뱃지로 올리기 시작하면 그때는 목록이 뒤덮인다.
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
        {thought.featured ? (
          <span className="bg-iris text-on-iris rounded-badge shrink-0 px-1.5 py-0.5 font-sans text-[11px] font-medium tracking-normal">
            추천
          </span>
        ) : null}
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
