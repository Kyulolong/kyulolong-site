import Link from "next/link";
import { INSTAGRAM_URL, INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 랜딩 히어로 (DESIGN.md §8).
 *
 * 이 화면의 형광 한 점은 "만든 것 + 프롬프트 보기" 버튼 하나다.
 * 그래서 헤더에도 보조 링크에도 형광이 없다. 눈이 갈 곳을 하나만 남긴다.
 *
 * 통계 줄은 두지 않는다. 숫자를 세 개 세워두면 눈이 CTA 아래로 한 번 더
 * 끌려가서, 히어로가 "한 화면 한 액션"(DESIGN.md §1)이 아니게 된다.
 * 걸리는 시간은 서비스 카드마다 buildTime 으로 이미 붙어 있다.
 *
 * ⚠️ 가운데 정렬이 아니다. 아래 목록과 **왼쪽 끝을 맞춘다** — 그래서 바깥
 * 컨테이너가 섹션들과 같은 max-w-[1120px] 다. 가운데로 세우면 히어로만 다른
 * 축에 떠 있게 되고, 알약 라벨·큰 제목·버튼 두 개가 세로로 쌓인 그 형태는
 * 어느 사이트에나 있는 모양이라 이 채널의 얼굴이 되지 못한다.
 */
export function Hero() {
  return (
    /* 아래 여백은 다음 섹션의 py 가 만든다. 둘 다 넉넉히 주면 히어로와 목록
       사이에 화면 반 개짜리 빈 칸이 생겨서, 넓은 게 아니라 끊긴 것처럼 보인다. */
    <section className="mx-auto w-full max-w-[1120px] px-6 pt-20 pb-4 sm:px-8 sm:pt-28 sm:pb-6">
      <div className="max-w-[46rem]">
        {/* 문구는 인스타 썸네일에 이미 박혀 있는 그 줄이다. 릴스를 보고 넘어온
            사람이 같은 얼굴을 만나야 한다. 여기만 다른 말을 쓰면 채널이 둘로 갈린다.

            알약을 씌우지 않는다 (DESIGN.md §6) — 못 누르는 라벨에 상자를 씌우면
            버튼으로 보이고, 이 화면에서 누를 것은 아래 하나여야 한다.

            고정폭도 쓰지 않는다. 고정폭 스택에는 한글이 없어서 이 줄만 시스템
            한글 폰트로 떨어지고, 바로 아래 제목의 Pretendard 와 얼굴이 갈린다.
            고정폭은 숫자에만 쓴다 (CLAUDE.md 7번). */}
        <p className="text-ink-faint text-[13px] font-medium tracking-[0.01em]">
          인사담당자가 · AI한테 시켜서 · 1시간
        </p>

        {/* 브랜드명(규로롱 ← 뾰로롱)과 시리즈명과 방문자가 지었으면 하는 표정이
            전부 이 한 줄이다. 자기소개 대신 이걸 세운다. */}
        <h1 className="mt-5 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.14] font-extrabold tracking-[-0.035em] text-balance">
          이게 되네?
        </h1>

        <p className="text-ink-soft mt-6 max-w-[36rem] text-lg text-pretty sm:text-xl">
          AI한테 시켜서 만듭니다. 하나에 한두 시간,
          앱스토어에 올라간 것도 있습니다. 전부 로그인 없이 열리고,
          만들 때 쓴 프롬프트도 같이 뒀어요.
        </p>

        {/* 버튼은 하나다 (DESIGN.md §8). 목표가 팔로워라 인스타를 같이 걸되
            테두리 버튼으로 세우지 않는다 — 알약 두 개가 나란히 서면 무엇을
            먼저 눌러야 하는지가 사라지고, 그 형태 자체가 기본값처럼 보인다. */}
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href={INTERNAL_LINKS.services}
            className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors duration-200"
          >
            만든 것 + 프롬프트 보기
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink text-[0.9375rem] font-medium underline underline-offset-[6px] transition-colors"
          >
            인스타에서 보기
          </a>
        </div>
      </div>
    </section>
  );
}
