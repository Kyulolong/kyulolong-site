import Link from "next/link";

/**
 * /proof 의 첫 화면 — 가로로 꽉 찬 진한 보라 띠.
 *
 * 홈은 맨 바탕에서 시작하고 Proof 는 보라 방에서 시작한다. 홈·소개의 보라 슬랩(proof-invitation.tsx)이
 * 문이고 이 띠가 그 색의 방이라, 누른 사람이 "옮겨 왔다"를 색으로 먼저 안다 (2026-09-23).
 * 이 띠가 이 페이지의 큰 보라 하나다 (DESIGN.md §8) — 아래 절은 카드·선·표로만 서고 보라 면을 다시 치지 않는다.
 * 형광은 0 이다. 이 화면이 하려는 말은 버튼이 아니라 개요표라, Primary 는 띠 위 반전(on-iris 면)이다.
 *
 * 개요표(대상·기간·방식·산출물)는 컨설팅 제안서의 표지 역할이다. 라벨은 고정폭 — 이 사이트의 기록 줄 (§5).
 * 숫자를 적을 때는 확정된 것만: 5~20인 · 4주. 가격·모집 수·일정은 적지 않는다 (SITE-DIRECTION 공개 범위).
 */
const OVERVIEW = [
  ["대상", "인사 담당자가 없는 5~20인 팀"],
  ["기간", "4주"],
  ["방식", "AI 초안 + 코치 검토"],
  ["산출물", "개인별 진단 · 실무 과제 · 변화 리포트 · 리더 제언서"],
] as const;

export function ProofHero() {
  return (
    <section className="bg-iris text-on-iris" aria-labelledby="proof-title">
      <div className="mx-auto w-full max-w-[1120px] px-6 pt-14 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="font-mono text-[13px] tracking-[0.12em]">PROOF · 규로롱 팀 코칭</p>
          <p className="bg-on-iris/15 rounded-badge px-2 py-0.5 text-xs font-medium">파일럿 준비 중</p>
        </div>
        <h1 id="proof-title" className="mt-6 max-w-[48rem] text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.12] font-extrabold tracking-[-0.035em] text-pretty">
          일한 기록에서,<br />다음 성장의 근거를 찾습니다.
        </h1>
        <p className="mt-7 max-w-[40rem] text-lg leading-relaxed text-pretty sm:text-xl">
          열심히 일하는데 무엇을 더 배워야 할지 모를 때. 피드백을 주고 싶지만 누구에게 무엇을 말해야 할지 막막할 때. 실제로 한 일을 함께 읽고, 다음에 해볼 일을 정합니다.
        </p>

        <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/25 pt-6 md:grid-cols-[auto_auto_auto_1fr] md:gap-x-12">
          {OVERVIEW.map(([label, value]) => (
            <div key={label} className={label === "산출물" ? "col-span-2 md:col-span-1" : ""}>
              <dt className="text-on-iris/85 font-mono text-xs tracking-[0.08em]">{label}</dt>
              <dd className="mt-1.5 font-medium text-pretty">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="#apply" className="bg-on-iris text-iris hover:bg-white inline-flex min-h-12 items-center rounded-full px-6 py-3 font-bold transition-colors" data-umami-event="proof-apply-open">
            파일럿 참여 신청하기
          </Link>
          <Link href="#process" className="text-on-iris/85 hover:text-on-iris inline-flex min-h-11 items-center underline underline-offset-4 transition-colors">
            어떻게 진행하나요?
          </Link>
        </div>
      </div>
    </section>
  );
}
