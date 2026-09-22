import Link from "next/link";
import { formatDate } from "@/components/video-card";
import { readingMinutes, rowSummary, splitMatches, type Thought } from "@/lib/content";

/**
 * 검색어가 걸린 자리를 칠한다 (`/thoughts?q=…` 에서만).
 *
 * **형광이 아니라 옅은 보라 면이다.** 결과가 열 줄이면 칠도 열 곳 넘게 서는데,
 * 그걸 형광으로 하면 §2 가 세는 '흩어짐' 그 자체가 된다. 보라 면은 형광 예산에
 * 안 들어가고(DESIGN.md §2 "보라 면은 예산에 안 들어간다"), 글자는 원래 색을
 * 그대로 물려받아 대비가 안 깨진다 — 보라 25% 위 ink-soft 가 6.54:1, 제목 ink 가
 * 13.37:1 이다 (재어본 값. 25% 를 올리면 ink-soft 쪽부터 다시 잴 것).
 *
 * 반경도 여백도 주지 않는다. 낱말에 조사가 붙어 있어서(`평가`+`를`) 좌우 여백을
 * 주면 한 어절 한가운데가 벌어진다.
 */
function Marked({ text, terms }: { text: string; terms?: string[] }) {
  if (!terms?.length) return text;
  return splitMatches(text, terms).map((part, i) =>
    part.hit ? (
      <mark key={i} className="bg-iris/25 text-inherit">
        {part.text}
      </mark>
    ) : (
      part.text
    ),
  );
}

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
 *
 * ── 홈에서는 뱃지를 감춘다 (`badge={false}`, 2026-09-23)
 *
 * 홈의 세 줄은 전부 `featured` 라 뱃지가 셋 다 붙는데, 그 절의 제목("처음이라면,
 * 이 세 편부터")이 이미 같은 말을 한다. 남는 건 보라 알갱이 셋뿐이고, 그건 DESIGN.md
 * §7 이 뱃지에 경고한 "격자 전체에 보라가 흩뿌려진다"다. `/thoughts` 에서는 그대로
 * 선다 — 거기서는 위의 "날짜가 어긋난 이유를 대는 줄" 역할이 살아 있다.
 *
 * ── 검색 결과일 때 (`terms` · `excerpt`)
 *
 * 둘 다 `/thoughts?q=…` 만 넘긴다. 대문은 안 넘기므로 그대로다.
 * `excerpt` 는 본문에서만 걸린 글의 "그 말이 나온 문장"이고, 요약 자리를 대신
 * 차지한다 (lib/content/search.ts 의 ThoughtHit).
 */
export function ThoughtRow({
  thought,
  terms,
  excerpt,
  badge = true,
}: {
  thought: Thought;
  terms?: string[];
  excerpt?: string;
  /** 「추천」 뱃지. 홈처럼 절 제목이 이미 추천이라고 말하는 자리에서만 끈다 */
  badge?: boolean;
}) {
  const summary = excerpt ?? rowSummary(thought);

  return (
    <Link
      href={`/thoughts/${thought.slug}`}
      className="border-line hover:border-line-strong group block border-b py-6 transition-colors sm:py-7"
    >
      {/* 메타가 제목 위에 온다. 훑는 사람이 시리즈로 먼저 걸러 읽기 때문에,
          제목 아래로 내리면 그 판단이 한 박자 늦는다. */}
      <p className="text-ink-faint flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs tracking-[0.04em] tabular-nums">
        {badge && thought.featured ? (
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
        <Marked text={thought.title} terms={terms} />
      </h3>

      {summary ? (
        <p className="text-ink-soft mt-2 max-w-[58ch] text-[0.9375rem] text-pretty">
          <Marked text={summary} terms={terms} />
        </p>
      ) : null}
    </Link>
  );
}
