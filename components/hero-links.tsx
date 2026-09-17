import Image from "next/image";
import { FOUNDER_QUESTIONS, KAKAO_OPENCHAT } from "@/lib/site-links";

/**
 * [만든 것] 아래, [말 거는 곳] 위에 서는 타일 둘 — 적어 넣을 종이와 같이 적는 방.
 * (파일 이름이 hero-links 인 건 히어로 바로 아래에 서던 시절의 흔적이다.)
 *
 * **사이트 안에서 이 둘로 가는 유일한 입구다** (푸터의 "오픈채팅" 한 줄을 빼면).
 * 처음엔 대문 아래쪽 보라 슬랩의 알약 둘이 같은 곳을 가리켰는데, 2026-09-07 에
 * 그 슬랩을 지우면서 이 타일만 남았다. 그래서 여기가 종이를 설명하는 **유일한**
 * 자리이기도 하다.
 *
 * ── 왜 [만든 것] 아래인가 (2026-09-17 에 히어로 바로 아래에서 내렸다)
 *
 * 흰 종이·노랑으로 바꾸고 나니 첫 화면에서 이 둘이 h1 보다 크게 울렸다 — 캐치프레이즈
 * 대신 "PDF 받기·단톡방"이 먼저 읽혔다. 내리면 대문이 주장 → 생각들 → 만든 것 →
 * 가져갈 것(종이·방) → 말 거는 곳으로 읽힌다: 글과 실물을 본 사람이 집어 가는 자리다.
 *
 * ⚠️ **치른 값이 있다.** 위에 두던 이유는 **유입이 인스타 하나**라서였다 (CLAUDE.md
 * 1번) — 거기서 넘어온 사람 상당수는 [생각들]·[만든 것]을 지나 여기까지 안 내려온다.
 * PDF 받기·방 입장이 줄면 위치부터 볼 것.
 *
 * ── 왜 흰 종이와 카카오 노랑인가 (2026-09-17, 본인 요청)
 *
 * 보라 면 둘이던 시절엔 둘 다 "사이트 안의 카드"로 읽혀서, 누르면 PDF 가 열리고
 * 카톡방에 들어간다는 게 글자를 읽어야만 전해졌다. 이제는 **그 물건의 모양과 색**을
 * 빌린다 — 표지가 보이는 흰 문서, 입장코드 칸이 있는 노란 오픈채팅. 눈이 먼저 알아본다.
 *
 * ⚠️ **첫 화면의 보라 30% 가 여기서 빠졌다.** 보라 면이던 이 타일이 그 층의 마지막
 * 면이었다 (DESIGN.md §1 — 검정 + 형광 두 겹은 1차 실패로 적힌 조합). 자리를 내린
 * 지금 첫 화면에는 보라 면이 없다. 기울어 보이면 30% 를 어디서 세울지부터 정할 것.
 *
 * ⚠️ **빌려온 색은 이 파일 밖으로 가져가지 않는다** (app/globals.css `--color-paper`·
 * `--color-kakao`). 다른 자리에 노랑이 서는 순간 형광 한 점과 소리를 다툰다.
 *
 * ⚠️ **표지 그림은 손으로 만들지 않는다.** `npm run questions` 가 PDF 를 구울 때 같은
 * 판에서 찍는다(public/founder-questions-cover.png). 표지를 고쳤으면 그 명령 하나로 둘 다.
 *
 * ⚠️ **화살표를 붙이지 않는다** (§6). "열어보기"·"입장하기"가 이미 목적지를 말한다.
 *
 * ── 글자의 역할
 *   1. 굵은 줄 — **무엇인지가 아니라 무엇에 쓰는지.** "질문지 PDF"는 이름일 뿐이라
 *      눌러야 할 이유를 못 준다. 대문 h1(캐치프레이즈)을 첫 타일이 바로 받는다.
 *   2. 고정폭 줄 — 사실만. 파일 이름·장 수·입장코드 (DESIGN.md §5 기록 줄). 형용사가
 *      들어가는 순간 광고가 된다. "전자책"이라 부르지 않는 것도 같은 이유다 — 열두
 *      장짜리를 그렇게 부르면 받는 사람이 두께를 재고 실망한다.
 *   읽는 사람을 규정하는 말은 어느 줄에도 넣지 않는다 (CLAUDE.md 1번).
 */

/** 링크 주소에서 그대로 뗀다 — 파일 이름을 두 곳에 적어두면 언젠가 어긋난다 */
const PDF_FILENAME = FOUNDER_QUESTIONS.href.split("/").pop();

/* 카드 hover 는 두 타일이 같다: 2px 뜨기 (§6). 색은 바꾸지 않는다. */
/* 그림자도 두 타일이 같다 — 한쪽에만 있으면 둘이 다른 높이에 떠 보인다.
   라이트에서 종이·노랑을 바탕에서 띄우는 옅은 한 겹이고, 다크에서는 거의 안 보인다. */
const TILE =
  "group rounded-card ease-[var(--ease-calm)] flex h-full p-6 shadow-[0_10px_28px_-18px_rgba(23,21,31,0.35)] transition-transform duration-200 hover:-translate-y-0.5";

/* 버튼처럼 보이는 라벨. 카드 전체가 링크라 실제 버튼은 아니다 — 누를 곳을 눈에
   찍어주는 자리다. 각 타일의 글자색을 면으로 뒤집어 쓴다. */
const ACTION =
  "shrink-0 rounded-full px-4 py-2 text-[13px] leading-none font-bold";

export function HeroLinks() {
  return (
    /* 왼쪽 끝은 위아래 섹션과 같은 1120px 축. 위 [만든 것]의 마지막 줄이 문단이라
       섹션 간격(§4 72px+)을 여기서 연다 — 좁히면 타일이 그 문단의 부록으로 읽힌다. */
    <section className="mx-auto w-full max-w-[1120px] px-6 pt-16 sm:px-8 sm:pt-20">
      <ul className="grid max-w-[46rem] grid-cols-1 gap-3 sm:grid-cols-2">
        <li>
          <a
            href={FOUNDER_QUESTIONS.href}
            target="_blank"
            rel="noreferrer noopener"
            /* 라이트에서는 바탕도 흰색이라 그림자만으로는 종이 가장자리가 흐리다 —
               테두리 한 줄을 더한다. 다크에서는 거의 안 보이고, 안 보여도 된다. */
            className={`${TILE} bg-paper text-on-paper ring-line-strong gap-5 ring-1`}
          >
            {/* 표지 + 뒤에 깔린 두 장. 한 장짜리 그림이 아니라 여러 장짜리 문서로 읽히게
                한다. 종이 모서리라 반경을 주지 않는다 (§6 반경 예산에 칸을 더하지 않는다). */}
            <span
              aria-hidden="true"
              className="relative block w-[72px] shrink-0 self-start"
            >
              <span className="bg-paper absolute inset-0 translate-x-[6px] translate-y-[6px] ring-1 ring-black/10" />
              <span className="bg-paper absolute inset-0 translate-x-[3px] translate-y-[3px] ring-1 ring-black/10" />
              <Image
                src="/founder-questions-cover.png"
                alt=""
                width={240}
                height={339}
                sizes="72px"
                className="ease-[var(--ease-calm)] relative block h-auto w-full ring-1 ring-black/10 transition-transform duration-200 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-rotate-2"
              />
              <span className="bg-pdf absolute bottom-3 -left-2 px-1 py-0.5 text-[9px] leading-none font-bold tracking-[0.04em] text-white">
                PDF
              </span>
            </span>

            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-on-paper-soft truncate font-mono text-[11px]">
                {PDF_FILENAME}
              </span>
              <span className="mt-1.5 text-[0.9375rem] leading-snug font-bold tracking-[-0.01em] text-pretty">
                회사를 만들기 전 생각할 질문 열 개
              </span>
              <span className="mt-auto flex items-center justify-between gap-3 pt-4">
                {/* 장 수는 lib/site-links.ts 에서 오고, npm run questions 가 대조해 세운다 */}
                <span className="text-on-paper-soft font-mono text-[12px] tabular-nums">
                  {FOUNDER_QUESTIONS.pages}장 · 무료
                </span>
                <span className={`${ACTION} bg-on-paper text-paper`}>
                  열어보기
                </span>
              </span>
            </span>
          </a>
        </li>

        <li>
          <a
            href={KAKAO_OPENCHAT.href}
            target="_blank"
            rel="noreferrer noopener"
            className={`${TILE} bg-kakao text-on-kakao flex-col`}
          >
            <span className="flex gap-4">
              {/* 방 사진 자리 — 오픈채팅 목록에서 방이 서는 모양 그대로다. 사진 대신
                  앱 아이콘을 쓴다: 누가 여는 방인지가 이 칸의 일이라서다. */}
              <Image
                src="/icon-192-maskable.png"
                alt=""
                width={48}
                height={48}
                className="rounded-note size-12 shrink-0"
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-on-kakao/70 flex items-center gap-1.5 text-[12px] font-medium">
                  <KakaoBubble />
                  카카오톡 {KAKAO_OPENCHAT.label}
                </span>
                <span className="mt-1.5 text-[0.9375rem] leading-snug font-bold tracking-[-0.01em] text-pretty">
                  그 질문에 답하고 있는 사람들의 커뮤니티
                </span>
              </span>
            </span>

            <span className="mt-auto flex items-center justify-between gap-3 pt-4">
              <span className="flex items-center gap-2">
                <span className="text-on-kakao/70 text-[12px] font-medium">
                  입장코드
                </span>
                {/* 입장코드를 숨기지 않는다 (lib/site-links.ts). 칸으로 나누는 건
                    입장할 때 치는 네 칸 그대로라서다 — 눈으로 옮겨 적는 숫자다. */}
                <span aria-hidden="true" className="flex gap-1">
                  {[...KAKAO_OPENCHAT.code].map((digit, i) => (
                    <span
                      key={i}
                      className="rounded-badge grid h-7 w-6 place-items-center bg-white/60 font-mono text-[14px] tabular-nums"
                    >
                      {digit}
                    </span>
                  ))}
                </span>
                <span className="sr-only">{KAKAO_OPENCHAT.code}</span>
              </span>
              <span className={`${ACTION} bg-on-kakao text-kakao`}>
                입장하기
              </span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}

/** 카카오톡의 말풍선. 플랫폼을 알아보게 하는 표시라 글자색을 따라간다 */
function KakaoBubble() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={14}
      height={14}
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.54 2 10.9c0 2.8 1.86 5.27 4.66 6.67l-.95 3.48c-.08.3.26.55.52.37l4.15-2.75c.53.06 1.07.09 1.62.09 5.52 0 10-3.54 10-7.86S17.52 3 12 3Z"
      />
    </svg>
  );
}
