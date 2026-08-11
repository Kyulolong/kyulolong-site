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
 */
export function Hero() {
  return (
    /* 아래 여백은 다음 섹션의 py 가 만든다. 둘 다 넉넉히 주면 히어로와 목록
       사이에 화면 반 개짜리 빈 칸이 생겨서, 넓은 게 아니라 끊긴 것처럼 보인다. */
    <section className="px-6 pt-20 pb-4 sm:px-8 sm:pt-28 sm:pb-6">
      <div className="mx-auto flex w-full max-w-[52rem] flex-col items-center text-center">
        {/* 알약의 파스텔 종이가 이미 브랜드를 말한다. 여기 초록 점을 또 찍으면
            헤더 마크의 새싹과 형광이 두 군데로 흩어진다 (DESIGN.md §2).

            문구는 인스타 썸네일에 이미 박혀 있는 그 줄이다. 릴스를 보고 넘어온
            사람이 같은 얼굴을 만나야 한다. 여기만 다른 말을 쓰면 채널이 둘로 갈린다. */}
        <p className="bg-paper-lime text-ink-soft inline-flex items-center rounded-full px-4 py-1.5 text-[13px] font-medium">
          인사담당자가 · AI한테 시켜서 · 1시간
        </p>

        {/* 브랜드명(규로롱 ← 뾰로롱)과 시리즈명과 방문자가 지었으면 하는 표정이
            전부 이 한 줄이다. 자기소개 대신 이걸 세운다. */}
        <h1 className="mt-6 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.14] font-extrabold tracking-[-0.035em] text-balance">
          이게 되네?
        </h1>

        <p className="text-ink-soft mt-6 max-w-[36rem] text-lg text-pretty sm:text-xl">
          AI한테 시켜서 만듭니다. 하나에 한두 시간,
          앱스토어에 올라간 것도 있습니다. 전부 로그인 없이 열리고,
          만들 때 쓴 프롬프트도 같이 뒀어요. 
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={INTERNAL_LINKS.services}
            className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors duration-200"
          >
            만든 것 + 프롬프트 보기
            <span aria-hidden="true">→</span>
          </Link>
          {/* 목표가 팔로워라 두 번째 자리는 인스타다. /about 은 페이지 맨 아래
              배너가 이미 잡고 있으므로 여기서 한 번 더 쓰지 않는다. */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors duration-200"
          >
            이게 되네? 보러 가기
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
