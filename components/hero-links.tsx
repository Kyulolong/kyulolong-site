import { FOUNDER_QUESTIONS, KAKAO_OPENCHAT } from "@/lib/site-links";

/**
 * 히어로 바로 아래에 서는 보라 타일 둘 — 적어 넣을 종이와 같이 적는 방.
 *
 * **사이트 안에서 이 둘로 가는 유일한 입구다** (푸터의 "오픈채팅" 한 줄을 빼면).
 * 처음엔 대문 아래쪽 보라 슬랩의 알약 둘이 같은 곳을 가리켰는데, 2026-09-07 에
 * 그 슬랩을 지우면서 이 타일만 남았다. 그래서 여기가 종이를 설명하는 **유일한**
 * 자리이기도 하다 — 두 줄 말고는 아무 설명이 없다는 뜻이라, 그 두 줄이 일을 다 해야 한다.
 *
 * 위에 두는 이유는 **유입이 인스타 하나**라서다 (CLAUDE.md 1번). 거기서 넘어온
 * 사람 상당수는 [생각들]·[만든 것]을 지나 아래까지 내려가지 않는다.
 *
 * ── 왜 보라 면인가 (2026-09-07 에 `--surface` 에서 바꿨다)
 *
 * **슬랩이 없어지면서 대문의 30% 층이 통째로 비었다.** 남은 보라가 히어로 버튼
 * 하나와 푸터 띠뿐이라 화면이 검정 + 형광 두 겹으로 기울었는데, 그건 DESIGN.md §1
 * 이 "두 번 뒤집은 이력"에서 1차 실패로 적어둔 조합이다. 이 타일 둘이 그 층을
 * 넘겨받는다 — 히어로 바로 아래에 넓은 보라 띠가 서므로, 첫 화면에서 세 겹이 다시 선다.
 *
 * 카드에 보라를 칠하는 건 §2 가 허용하는 용법이다("카드 트레이·메인 프레임·뱃지·
 * 섹션 블록의 배경"). 위의 보라 알약과 부딪히지 않는 이유는 **모양이 다르기
 * 때문**이다 — 알약은 버튼의 것이고(§6) 이건 면이라, 눈이 "무엇을 누르지"로
 * 헷갈리지 않는다. 층도 두 겹을 안 넘는다: 바탕 위에 보라 하나, 그 안에 상자 없음.
 *
 * ⚠️ **형광은 한 점도 두지 않는다.** 이 화면의 형광은 히어로 제목의 커서다 (§2).
 * ⚠️ **화살표를 붙이지 않는다** (§6). 라벨이 이미 목적지를 말한다.
 * ⚠️ **보라 위 글자는 밝게** (`--on-iris`). 아랫줄은 `/85` 인데 그 아래로 내리면
 *    4.5:1 이 깨진다 — `/80` 은 4.39:1 로 이미 기준 미달이다. 계산해보고 내릴 것.
 *
 * ── 두 줄의 역할
 *   1. 굵은 줄 — **무엇인지가 아니라 무엇에 쓰는지.** "질문지 PDF"는 이름일 뿐이라
 *      눌러야 할 이유를 못 준다. 대문 h1(캐치프레이즈)이 "회사는 사람과 일하는
 *      방식으로 만들어집니다"라고 말했으니, 첫 타일이 그 문장을 바로 받는다.
 *   2. 고정폭 줄 — 사실만. 종류·값·숫자다 (DESIGN.md §5 기록 줄). 형용사가 들어가는
 *      순간 광고가 된다.
 */

interface Tile {
  href: string;
  /** 무엇에 쓰는지. 읽는 사람을 규정하는 말은 넣지 않는다 (CLAUDE.md 1번) */
  headline: string;
  /** 고정폭으로 앉는 한 줄. 사실만 */
  meta: string;
}

const TILES: readonly [Tile, Tile] = [
  {
    href: FOUNDER_QUESTIONS.href,
    headline: "회사를 만들기 전 생각할 질문 열 개",
    /* "전자책"이라 부르지 않는다. 열두 장짜리를 그렇게 부르면 받는 사람이
       두께를 재고 실망하고, 그 실망이 이 타일이 쌓으려는 신뢰를 그대로 깎는다.
       장 수는 lib/site-links.ts 에서 오고, npm run questions 가 대조해 세운다. */
    meta: `무료 PDF · ${FOUNDER_QUESTIONS.pages}장`,
  },
  {
    href: KAKAO_OPENCHAT.href,
    headline: "그 질문에 답하고 있는 사람들의 커뮤니티",
    /* 입장코드를 숨기지 않는다 (lib/site-links.ts) */
    meta: `카카오톡 ${KAKAO_OPENCHAT.label} · 입장코드 ${KAKAO_OPENCHAT.code}`,
  },
];

export function HeroLinks() {
  return (
    /* 히어로·[생각들]과 왼쪽 끝을 맞춘다. 두 섹션이 다 max-w-[46rem] 안쪽이라
       여기만 넓으면 타일이 다른 축에 떠 있게 된다 (hero.tsx 의 같은 규칙). */
    <section className="mx-auto w-full max-w-[1120px] px-6 pt-9 sm:px-8 sm:pt-11">
      <ul className="grid max-w-[46rem] grid-cols-1 gap-3 sm:grid-cols-2">
        {TILES.map((tile) => (
          <li key={tile.href}>
            <a
              href={tile.href}
              target="_blank"
              rel="noreferrer noopener"
              /* hover 는 보라 한 단계(`--iris-press`) + 2px 뜨기 (§6).
                 다크에서 그림자는 거의 안 읽히므로 층은 면으로 만든다. */
              className="bg-iris hover:bg-iris-press rounded-card ease-[var(--ease-calm)] block h-full px-6 py-5 transition-[transform,background-color] duration-200 hover:-translate-y-0.5"
            >
              <p className="text-on-iris text-[0.9375rem] leading-snug font-bold tracking-[-0.01em] text-pretty">
                {tile.headline}
              </p>
              <p className="text-on-iris/85 mt-2 font-mono text-[12px] tabular-nums">
                {tile.meta}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
