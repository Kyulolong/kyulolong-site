/**
 * 랜딩 히어로 — 캐치프레이즈 + 태그라인 + 무엇을 하는지 한 문단.
 *
 * **버튼이 없다** (DESIGN.md §7). 이 화면의 형광 한 점은 제목 뒤의 커서다. 2026-09-22 개편
 * 때 보라 "추천 글부터 읽기" 버튼이 잠깐 섰는데 바로 아래 절로 400px 스크롤만 하는
 * 버튼이라 09-23 에 다시 뺐다 — 누를 이유가 없는 버튼은 화면이 템플릿으로 읽히게 한다.
 *
 * 둘째 문단이 이 채널이 하는 일(글·자료)과 따라가는 질문을 한 호흡에 말한다. 그 질문은
 * 규로롱의 그랜드 퀘스트(docs/GRAND-QUEST.md §1)이고, 사이트에서 퀘스트가 보이는 유일한
 * 자리다. 2026-11-06 전에는 이 자리에 Proof 코칭 한 문장이 있었다 — 내려놓으면서 뺐다.
 *
 * 아래 섰던 짧은 이력 줄(아바타 + "인사팀에서 일하다 창업한 규로롱" + 경력 + 소개 링크)도
 * 같은 날 뺐다. 이력은 /about 이 말한다.
 */
export function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-6 pt-14 sm:px-8 sm:pt-24">
      <p className="text-ink-faint font-mono text-[13px] tracking-[0.04em]">사람 · 조직 · 창업</p>
      <h1 className="mt-4 text-[clamp(2rem,6.4vw,4.5rem)] leading-[1.14] font-extrabold tracking-[-0.035em]">
        회사는<br />‘사람’과 ‘일하는{"\u00A0"}방식’으로<br />만들어집니다
        <span aria-hidden="true" className="bg-acid ml-[0.12em] inline-block h-[0.74em] w-[0.16em] translate-y-[0.04em] align-baseline motion-safe:animate-[caret-blink_1.6s_steps(1,end)_infinite]" />
      </h1>
      <div className="mt-7 max-w-[40rem] text-lg sm:text-xl">
        <p className="text-ink-soft">사람과 AI, 일하는 방식을 탐구합니다.</p>
        <p className="text-ink-soft mt-3 text-pretty">
          일하며 겪는 문제를 글로 풀고, 팀에서 바로 써볼 자료를 나눕니다. 회사 속에서 사람은
          무엇을 배우며 다음 일을 만드는지, 그 질문을 따라갑니다.
        </p>
      </div>
    </section>
  );
}
