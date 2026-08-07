import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

interface HeroStat {
  label: string;
  value: number;
}

/**
 * 랜딩 히어로 (DESIGN.md §8).
 *
 * 이 화면의 형광 한 점은 "만든 서비스 보기" 버튼 하나다. 그래서
 * 헤더에도, 통계 줄에도, 보조 링크에도 형광이 없다. 눈이 갈 곳을 하나만 남긴다.
 */
export function Hero({ stats }: { stats: HeroStat[] }) {
  return (
    /* 아래 여백은 다음 섹션의 py 가 만든다. 둘 다 넉넉히 주면 히어로와 목록
       사이에 화면 반 개짜리 빈 칸이 생겨서, 넓은 게 아니라 끊긴 것처럼 보인다. */
    <section className="px-6 pt-20 pb-4 sm:px-8 sm:pt-28 sm:pb-6">
      <div className="mx-auto flex w-full max-w-[52rem] flex-col items-center text-center">
        {/* 알약의 파스텔 종이가 이미 브랜드를 말한다. 여기 초록 점을 또 찍으면
            헤더 마크의 새싹과 형광이 두 군데로 흩어진다 (DESIGN.md §2). */}
        <p className="bg-paper-lime text-ink-soft inline-flex items-center rounded-full px-4 py-1.5 text-[13px] font-medium">
          매주 한두 개씩 만들고 있습니다
        </p>

        <h1 className="mt-6 text-[clamp(2.25rem,6vw,4rem)] leading-[1.14] font-extrabold tracking-[-0.035em] text-balance">
          인사담당자였던 사람이
          <br />
          IT 서비스를 만듭니다
        </h1>

        <p className="text-ink-soft mt-6 max-w-[34rem] text-lg text-pretty sm:text-xl">
          만든 건 전부 열어둡니다. 로그인도, 결제도, 체험판도 없습니다.
          만드는 과정은 영상으로 남기고, 소스코드는 가져다 마음껏 쓰셔도 됩니다.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={INTERNAL_LINKS.services}
            className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors duration-200"
          >
            만든 서비스 보기
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={INTERNAL_LINKS.about}
            className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors duration-200"
          >
            왜 이걸 만드나
          </Link>
        </div>

        {stats.length > 0 ? (
          <dl className="text-ink-faint mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-1.5">
                <dt className="order-2">{stat.label}</dt>
                <dd className="text-ink order-1 font-mono text-base font-bold tabular-nums">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
