import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

export function ProofInvitation() {
  return (
    <section className="bg-iris text-on-iris rounded-card px-7 py-10 sm:px-12 sm:py-14" aria-labelledby="proof-invitation-title">
      <div className="grid gap-9 md:grid-cols-[1.3fr_0.7fr] md:gap-12">
        <div>
          <p className="text-sm font-medium">규로롱의 팀 코칭 · Proof</p>
          <h2 id="proof-invitation-title" className="mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-bold tracking-[-0.03em] text-pretty">열심히 일한 다음,<br />무엇을 더 잘하게 됐을까요?</h2>
          <p className="mt-5 max-w-[36rem] leading-relaxed text-pretty">일한 기록에서 잘한 일과 막힌 지점을 찾고, 다음에 연습할 과제를 함께 정합니다. 인사 담당자가 없는 작은 팀을 위한 진단·코칭 과정을 준비하고 있습니다.</p>
          <Link href={INTERNAL_LINKS.proof} className="bg-on-iris text-iris hover:bg-white mt-7 inline-flex min-h-12 items-center rounded-full px-6 py-3 text-sm font-bold transition-colors" data-umami-event="proof-introduction-open">Proof 진행 방식 보기</Link>
        </div>
        <ol className="self-center space-y-5" aria-label="Proof 코칭 흐름">
          {[["01", "기록을 함께 읽습니다", "무엇을 했고, 어디서 막혔는지"], ["02", "다음 과제를 정합니다", "지금 하는 일 안에서 연습할 것"], ["03", "변화를 다시 확인합니다", "같은 기준으로 살펴보는 성장"]].map(([number, title, detail]) => (
            <li key={number} className="flex gap-4 border-t border-white/25 pt-4">
              <span className="pt-0.5 font-mono text-xs">{number}</span>
              <div><p className="font-semibold">{title}</p><p className="mt-1 text-sm">{detail}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
