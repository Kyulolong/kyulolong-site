import { KAKAO_OPENCHAT } from "@/lib/site-links";

/**
 * 오픈채팅 초대. 홈(app/page.tsx)과 자료실(app/resources/page.tsx)이 같이 쓴다.
 *
 * **한 칼럼 글이다.** 09-22 개편 직후엔 오른쪽에 "처음에는 이 한 문장부터" 카드가
 * 섰는데, 바로 위 가이드 절의 인용 카드와 같은 판형이라 둘이 쌍둥이로 읽혔다
 * (09-23). 첫 문장 예시는 버튼 아래 한 줄로 내려왔다 — 방에 들어가서 칠 말이라
 * 카드가 아니라 문장이어야 손이 그대로 옮긴다.
 *
 * 버튼은 Secondary(테두리 알약, DESIGN.md §7)다. 이 절이 페이지의 주인공이 아니라서
 * 채운 면을 갖지 않는다. 노랑(카카오)도 쓰지 않는다 — 옛 타일이 빌리던 색인데 형광
 * 한 점과 소리를 다툰다 (app/globals.css 의 빌려온 색 주석).
 *
 * 입장코드를 숨기지 않는다 (lib/site-links.ts). 고정폭으로 적는다 — 눈으로 옮겨
 * 적는 숫자다.
 */
export function CommunityInvitation() {
  return (
    <section
      id="community"
      className="border-line scroll-mt-24 border-t pt-10 sm:pt-12"
      aria-labelledby="community-title"
    >
      <div className="max-w-[46rem]">
        <p className="text-ink-faint text-sm">읽은 다음의 대화 · 카카오 오픈채팅</p>
        <h2
          id="community-title"
          className="mt-3 text-2xl leading-tight font-bold tracking-[-0.02em] sm:text-3xl"
        >
          내 일에 적용하다 막혔다면
        </h2>
        <p className="text-ink-soft mt-4 max-w-[36rem] text-pretty">
          글에서 떠오른 질문, 가이드를 써보며 막힌 부분, 일하며 배운 것을 나누는 방입니다. 창업을
          준비하지 않아도, 정리된 질문이 없어도 괜찮습니다.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href={KAKAO_OPENCHAT.href}
            target="_blank"
            rel="noreferrer noopener"
            className="border-line-strong text-ink hover:bg-surface-2 inline-flex min-h-12 items-center rounded-full border px-6 py-3 text-sm font-bold transition-colors"
            data-umami-event="community-open"
          >
            오픈채팅 참여하기
          </a>
          <p className="text-ink-faint text-sm">
            입장코드 <span className="text-ink ml-1 font-mono tabular-nums">{KAKAO_OPENCHAT.code}</span>
          </p>
        </div>
        <p className="text-ink-soft mt-7 text-[0.9375rem] leading-relaxed">
          처음엔 이 한 줄이면 됩니다.
          <br />
          <span className="text-ink font-medium">
            “요즘 저는 <span className="font-mono">___</span>을 하고 있고,{" "}
            <span className="font-mono">___</span>에서 막혀 있어요.”
          </span>
          <br />
          회사나 동료의 이름은 적지 않아도 됩니다.
        </p>
      </div>
    </section>
  );
}
