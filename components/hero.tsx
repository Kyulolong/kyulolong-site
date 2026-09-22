import Image from "next/image";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 랜딩 히어로 — 캐치프레이즈 + 태그라인 + 무엇을 하는지 한 문단 + 짧은 이력.
 *
 * **버튼이 없다** (DESIGN.md §7). 이 화면의 형광 한 점은 제목 뒤의 커서이고, 첫 보라
 * 면은 아래 Proof 슬랩(components/proof-invitation.tsx)이 가져간다. 2026-09-22 개편
 * 때 보라 "추천 글부터 읽기" 버튼이 잠깐 섰는데 바로 아래 절로 400px 스크롤만 하는
 * 버튼이라 09-23 에 다시 뺐다 — 누를 이유가 없는 버튼은 화면이 템플릿으로 읽히게 한다.
 * Proof 로 가는 길은 헤더 버튼·모바일 하단 바·슬랩 셋으로 충분하다.
 *
 * 둘째 문단이 이 채널이 하는 일 셋(글·자료·Proof)을 한 호흡에 말한다. Proof 는
 * 이름으로 한 번만 부른다 — 이름 없이 "함께 살펴봅니다"로 두면 그게 코칭인지
 * 글인지 읽는 사람이 모른다.
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
          일하며 겪는 문제를 글로 풀고, 팀에서 바로 써볼 자료를 나눕니다. 팀에 적용하다
          막힐 때는 일한 기록을 같이 읽는 팀 코칭, Proof 를 준비하고 있습니다.
        </p>
      </div>
      <div className="border-line mt-12 flex max-w-[46rem] items-center gap-4 border-t pt-6 sm:mt-14">
        <Image src="/kyulolong-avatar.jpg" alt="규로롱" width={64} height={64} className="size-14 shrink-0 rounded-full object-cover sm:size-16" />
        <div>
          <p className="text-sm font-bold">인사팀에서 일하다 창업한 규로롱</p>
          <p className="text-ink-faint mt-1 text-xs leading-relaxed sm:text-sm">대기업 해외인사 5년 · 스타트업 운영총괄 2년 · 스타트업 대표 3년차</p>
          <Link href={INTERNAL_LINKS.about} className="text-ink-soft hover:text-ink inline-flex min-h-11 items-center text-sm underline underline-offset-4">어떤 경험을 해왔는지</Link>
        </div>
      </div>
    </section>
  );
}
