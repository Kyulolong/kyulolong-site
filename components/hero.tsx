import type { ReactNode } from "react";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

interface HeroProps {
  /**
   * 나중에 배경 영상을 끼우기 위한 자리.
   * <Hero background={<HeroVideo />} /> 로 넘기면 텍스트 뒤에 깔린다.
   * 지금은 비워둔다 — 첫 화면에 무거운 걸 올리지 않는다.
   */
  background?: ReactNode;
}

export function Hero({ background }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      {background ? (
        <>
          <div className="absolute inset-0 -z-10">{background}</div>
          {/* 배경이 들어와도 본문 대비를 유지하는 오버레이 */}
          <div className="bg-canvas/70 absolute inset-0 -z-10" aria-hidden="true" />
        </>
      ) : null}

      <div className="mx-auto w-full max-w-5xl px-5 pt-20 pb-14 sm:pt-28 sm:pb-20">
        <p className="text-muted flex items-center gap-2 font-mono text-xs tracking-wider uppercase">
          <span className="bg-accent inline-block size-1.5 rounded-full" aria-hidden="true" />
          kyulolong
        </p>

        <h1 className="mt-5 text-3xl leading-[1.25] font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.2]">
          인사담당자였던 사람이
          <br />
          IT 서비스를 만듭니다
        </h1>

        <p className="text-muted mt-5 max-w-xl leading-relaxed text-pretty sm:text-lg">
          매주 한두 개씩 만들고, 만드는 과정을 영상으로 남기고, 소스코드는 전부
          공개합니다. 가져다 마음껏 만드셔도 됩니다.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={INTERNAL_LINKS.services}
            className="bg-accent text-canvas hover:bg-accent/85 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-colors"
          >
            만든 서비스 보기
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={INTERNAL_LINKS.about}
            className="text-muted hover:text-accent border-line hover:border-accent/40 inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm transition-colors"
          >
            왜 이걸 만드나
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
