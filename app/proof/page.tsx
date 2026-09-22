import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BUSINESS_EMAIL, INTERNAL_LINKS, PROOF_INQUIRY_HREF } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "Proof · 일한 기록으로 다음 성장을 만드는 팀 코칭",
  description: "인사 담당자가 없는 5~20인 팀을 위한 진단·코칭 과정을 준비합니다. 실제 업무 기록을 바탕으로 피드백하고, 실무 과제를 실행한 뒤 변화를 함께 확인합니다.",
  path: "/proof",
});

const steps = [
  { number: "01", title: "실제로 한 일을 살펴봅니다", body: "팀의 목표와 맡은 역할을 먼저 듣습니다. 업무 기록, 회의, 결과물에서 어떤 판단을 했고 어디서 막혔는지 근거를 찾습니다.", result: "기록에 근거한 개인별 진단" },
  { number: "02", title: "다음에 연습할 일을 정합니다", body: "코치가 분석을 검토하고 각 구성원에게 피드백합니다. 별도의 학습 과제를 쌓기보다, 지금 맡은 업무에서 연습할 과제를 함께 정합니다.", result: "개인별 피드백과 실무 연습 과제" },
  { number: "03", title: "같은 기준으로 다시 봅니다", body: "비슷한 과업을 다시 살펴 무엇이 달라졌는지 확인합니다. 리더에게는 다음에 지원할 성장과 역할 조정을 검토할 근거를 정리합니다.", result: "변화 리포트와 리더 제언서" },
];

export default function ProofPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <header className="pt-14 pb-14 sm:pt-24 sm:pb-20">
        <p className="text-ink-faint text-sm">규로롱의 팀 코칭 · 파일럿 준비 중</p>
        <p className="mt-6 font-mono text-sm tracking-[0.14em]">PROOF</p>
        <h1 className="mt-3 max-w-[48rem] text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.15] font-extrabold tracking-[-0.035em] text-pretty">일한 기록에서,<br />다음 성장의 근거를 찾습니다.</h1>
        <p className="text-ink-soft mt-7 max-w-[40rem] text-lg leading-relaxed">열심히 일하는데 무엇을 더 배워야 할지 모를 때. 피드백을 주고 싶지만 누구에게 무엇을 말해야 할지 막막할 때. 실제로 한 일을 함께 읽고, 다음에 해볼 일을 정합니다.</p>
        <p className="text-ink-soft mt-4 max-w-[40rem]">인사 담당자가 없는 5~20인 팀을 중심으로, AI의 기록 분석과 코치의 검토를 결합한 4주 과정을 준비하고 있습니다.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="#inquiry" className="bg-iris text-on-iris hover:bg-iris-press inline-flex min-h-12 items-center rounded-full px-6 py-3 font-bold transition-colors">참여 문의하기</Link>
          <Link href="#process" className="text-ink-soft hover:text-ink inline-flex min-h-11 items-center underline underline-offset-4">어떻게 진행하나요?</Link>
        </div>
      </header>

      <section className="border-line grid gap-7 border-t pt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <h2 className="text-2xl font-bold tracking-[-0.02em]">이런 장면에서 시작합니다</h2>
        <ul className="text-ink-soft space-y-5 text-lg">
          <li>“팀원에게 피드백을 주고 싶은데, 결과물만으로는 어디서 막혔는지 모르겠어요.”</li>
          <li>“AI로 일은 빨라졌는데, 각자 무엇을 할 수 있게 됐는지 설명하기 어려워요.”</li>
          <li>“한 프로젝트가 끝나도, 다음에 무엇을 맡기고 어떻게 도와야 할지 막막해요.”</li>
        </ul>
      </section>

      <section id="process" className="mt-16 scroll-mt-24 sm:mt-20">
        <p className="text-ink-faint text-sm">준비 중인 4주 과정</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">진단하고, 연습하고, 다시 확인합니다</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="bg-surface rounded-card flex flex-col p-7">
              <p className="text-iris-soft font-mono text-sm">{step.number}</p>
              <h3 className="mt-5 text-xl font-bold text-pretty">{step.title}</h3>
              <p className="text-ink-soft mt-4 text-sm leading-relaxed">{step.body}</p>
              <p className="border-line mt-6 border-t pt-4 text-sm font-medium">{step.result}</p>
            </div>
          ))}
        </div>
        <p className="text-ink-faint mt-5 text-sm">세부 일정과 기록 범위는 팀 상황을 확인한 뒤 안내합니다.</p>
      </section>

      <section className="bg-iris-wash rounded-card mt-16 p-7 sm:mt-20 sm:p-12">
        <p className="text-iris-soft text-sm font-medium">피드백이 다음 행동으로 이어지는 모습</p>
        <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">“검토를 더 꼼꼼히”에서 한 걸음 더</h2>
        <p className="text-ink-faint mt-3 text-sm">진행 방식을 설명하기 위한 가상의 예시입니다.</p>
        <dl className="mt-7 grid gap-6 md:grid-cols-3">
          <div><dt className="font-bold">기록에서 발견한 장면</dt><dd className="text-ink-soft mt-2 leading-relaxed">화면은 구현했지만 오류가 나는 조건을 점검한 기록이 없습니다.</dd></div>
          <div><dt className="font-bold">다음 업무에서 할 연습</dt><dd className="text-ink-soft mt-2 leading-relaxed">다음 화면의 오류·예외 조건을 먼저 적고, 테스트 결과를 남깁니다.</dd></div>
          <div><dt className="font-bold">다시 확인할 변화</dt><dd className="text-ink-soft mt-2 leading-relaxed">어떤 위험을 스스로 발견했고, 검증하고 수정했는지 같은 기준으로 봅니다.</dd></div>
        </dl>
      </section>

      <section className="border-line mt-16 grid gap-8 border-t pt-10 sm:mt-20 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <div><h2 className="text-2xl font-bold tracking-[-0.02em]">기록을 다루는 원칙</h2><p className="text-ink-soft mt-4 text-sm leading-relaxed">직함이나 인상만으로 설명하기 어려운 일을, 실제 과업과 맥락에서 살펴봅니다.</p></div>
        <ul className="space-y-6">
          <li><h3 className="font-bold">AI가 정리하고, 코치가 검토합니다</h3><p className="text-ink-soft mt-2 leading-relaxed">AI의 분석을 그대로 평가 결과로 전달하지 않습니다. 직무 기준과 팀의 상황을 함께 살피고, 근거가 부족한 부분은 확인합니다.</p></li>
          <li><h3 className="font-bold">당사자가 설명하고 바로잡을 수 있어야 합니다</h3><p className="text-ink-soft mt-2 leading-relaxed">기록에 빠진 기여와 잘못 해석된 맥락을 확인하는 과정을 포함합니다. 발언량이나 결과물 개수만으로 기여를 판단하지 않습니다.</p></li>
          <li><h3 className="font-bold">리더에게 판단의 근거를 남깁니다</h3><p className="text-ink-soft mt-2 leading-relaxed">성장 지원과 역할 조정을 검토할 수 있도록 관찰과 제안을 구분합니다. 인사에 관한 최종 결정은 사람이 내립니다.</p></li>
        </ul>
      </section>

      <section className="mt-16 sm:mt-20">
        <h2 className="text-2xl font-bold">궁금할 수 있는 것들</h2>
        <div className="mt-6">
          {[
            ["지금 바로 시작할 수 있나요?", "현재 파일럿 과정을 준비하고 있습니다. 참여 문의를 주시면 팀의 상황과 준비 일정을 확인해 진행 가능 여부, 범위, 비용을 안내합니다. 문의만으로 신청이나 결제가 확정되지 않습니다."],
            ["어떤 팀을 위한 과정인가요?", "인사 담당자가 없는 5~20인 팀을 우선 고려합니다. 기획·마케팅·디자인·개발 업무를 중심으로 준비하고 있으며, 부트캠프나 창업 지원 기관의 프로젝트 팀 운영도 문의할 수 있습니다."],
            ["퍼플즈와는 어떤 관계인가요?", "퍼플즈는 목표와 업무 과정, 회의와 피드백을 기록하는 협업 도구입니다. Proof는 그 기록을 바탕으로 진단과 코칭을 운영하는 서비스입니다. 사용할 기록과 도구는 시작 전에 함께 확인합니다."],
            ["문의할 때 업무 기록을 보내야 하나요?", "처음에는 팀 규모와 고민, 희망 시기만 알려주세요. 개인별 업무 기록이나 회의 자료는 보내지 않아도 됩니다. 실제 과정에서 필요한 기록과 공유 범위는 별도로 협의합니다."],
          ].map(([question, answer]) => (
            <details key={question} className="border-line border-b py-5">
              <summary className="cursor-pointer py-1 pr-4 font-semibold">{question}</summary>
              <p className="text-ink-soft mt-4 max-w-[46rem] leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="inquiry" className="bg-iris text-on-iris rounded-card mt-16 scroll-mt-24 p-7 sm:mt-20 sm:p-12">
        <p className="text-sm">파일럿 참여 · 기관 협업 문의</p>
        <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em]">지금 팀에서 막힌 장면부터 들려주세요</h2>
        <p className="mt-5 max-w-[40rem] leading-relaxed">팀 또는 기관 소개와 인원, 지금 겪는 어려움, 참여를 생각하는 시기를 알려주세요. 상황을 읽고 Proof가 도움이 될 수 있을지부터 함께 살펴보겠습니다.</p>
        <a href={PROOF_INQUIRY_HREF} className="bg-on-iris text-iris hover:bg-white mt-7 inline-flex min-h-12 items-center rounded-full px-6 py-3 font-bold transition-colors" data-umami-event="proof-email-open">이메일로 참여 문의하기</a>
        <p className="mt-5 text-sm leading-relaxed">메일 앱이 열리지 않으면 <a href={`mailto:${BUSINESS_EMAIL}`} className="wrap-anywhere underline underline-offset-4">{BUSINESS_EMAIL}</a>으로 보내주세요.</p>
      </section>
      <p className="text-ink-soft mt-8 text-sm">먼저 직접 점검해보고 싶다면 <Link href={INTERNAL_LINKS.resources} className="inline-flex min-h-11 items-center underline underline-offset-4">무료 자료실</Link>에서 시작할 수 있습니다.</p>
    </div>
  );
}
