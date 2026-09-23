import type { Metadata } from "next";
import Link from "next/link";
import { ProofApplyForm } from "@/components/proof-apply-form";
import { ProofHero } from "@/components/proof-hero";
import { pageMetadata } from "@/lib/seo";
import { INTERNAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "Proof · 일한 기록으로 다음 성장을 만드는 팀 코칭",
  description: "인사 담당자가 없는 5~20인 팀을 위한 진단·코칭 과정을 준비합니다. 실제 업무 기록을 바탕으로 피드백하고, 실무 과제를 실행한 뒤 변화를 함께 확인합니다.",
  path: "/proof",
});

/**
 * /proof — 2026-09-23 개정.
 *
 * 왜 다시 짰나: 홈과 같은 컨테이너·눈썹+h1 리듬·보라 슬랩·버튼을 그대로 써서 페이지를 옮긴 감각이
 * 없었고, 절 둘(장면·원칙)이 같은 2단 판형이라 템플릿으로 읽혔다. 문의는 mailto 하나라 명단이 안 남았다.
 *
 * 지금의 리듬: 보라 띠(방을 바꾼다) → 한 칼럼 인용 → 5단계 흐름 표 → 예시 카드 → 원칙 목록 →
 * 진행하는 사람 두 줄 → FAQ → 신청 폼. 큰 보라는 띠 하나, 형광은 0, 2단은 폼 절에서 한 번뿐이다.
 * 절 사이는 홈과 같은 mt-20 sm:mt-24 (DESIGN.md §4).
 *
 * 흐름 다섯은 Proof 도식 초안(2026-09-23)의 번역이다 — 흐름과 원칙만 싣고 모델명·역량 축 수·과업 기준
 * 개수·파일 형식은 싣지 않는다. 초안이라 바뀌는 숫자를 페이지에 박으면 페이지가 거짓말이 된다.
 * 가격·할인·모집 수·협업 후보·매출 목표도 없다 (SITE-DIRECTION "서비스 공개 범위").
 */
const FLOW = [
  {
    title: "실제 업무 기록을 모읍니다",
    body: "퍼플즈 같은 협업 도구에 남은 피드·태스크·회의 요약·결과물·노트를 그대로 씁니다. 기록이 없어도 퍼플즈에 텍스트로 쌓으며 시작할 수 있습니다.",
    who: "참여자",
  },
  {
    title: "기록 하나가 판단의 최소 근거가 됩니다",
    body: "참여자별로 원문 기록을 보관합니다. 같은 결과물을 가리키는 여러 기록은 하나로 묶어 중복해서 세지 않습니다.",
    who: "저장소",
  },
  {
    title: "AI가 초안을 씁니다",
    body: "수행한 과업, 역량 관찰, 다음 실습 과제를 초안으로 냅니다. 항목마다 근거 기록이 붙고, 근거가 없으면 점수 없이 보류합니다.",
    who: "AI · 초안",
  },
  {
    title: "코치가 검토하고 발행합니다",
    body: "근거 기록을 펼쳐 보며 유지·수정·삭제·보류를 정합니다. 수정은 이력으로 남고 AI 원본은 덮어쓰지 않습니다. 발행 전까지 참여자에게는 아무것도 보이지 않습니다.",
    who: "코치",
  },
  {
    title: "성장 리포트를 받습니다",
    body: "참여자용 읽기 전용 리포트입니다. 수행 과업과 근거, 1주차 기준점과 4주차 비교, 다음 실습 과제, 코치 노트, 근거 기록 부록이 담깁니다.",
    who: "참여자 · 리더",
  },
] as const;

const PRINCIPLES = [
  ["AI가 정리하고, 코치가 검토합니다", "AI의 분석을 그대로 평가 결과로 전달하지 않습니다. 직무 기준과 팀의 상황을 함께 살피고, 근거가 부족한 부분은 확인합니다."],
  ["당사자가 설명하고 바로잡을 수 있어야 합니다", "기록에 빠진 기여와 잘못 해석된 맥락을 확인하는 과정을 포함합니다. 발언량이나 결과물 개수만으로 기여를 판단하지 않습니다. 모든 판단은 원문 기록과 연결됩니다."],
  ["리더에게 판단의 근거를 남깁니다", "성장 지원과 역할 조정을 검토할 수 있도록 관찰과 제안을 구분합니다. 인사에 관한 최종 결정은 사람이 내립니다."],
] as const;

const FAQ = [
  ["지금 바로 시작할 수 있나요?", "현재 파일럿 과정을 준비하고 있습니다. 참여를 신청하면 팀의 상황과 준비 일정을 확인해 진행 가능 여부, 범위, 비용을 안내합니다. 신청만으로 참여나 결제가 확정되지 않습니다."],
  ["어떤 팀을 위한 과정인가요?", "인사 담당자가 없는 5~20인 팀을 우선 고려합니다. 기획·마케팅·디자인·개발 업무를 중심으로 준비하고 있으며, 부트캠프나 창업 지원 기관의 프로젝트 팀 운영도 신청할 수 있습니다."],
  ["퍼플즈와는 어떤 관계인가요?", "퍼플즈는 목표와 업무 과정, 회의와 피드백을 기록하는 협업 도구입니다. Proof는 그 기록을 바탕으로 진단과 코칭을 운영하는 서비스입니다. 퍼플즈를 쓰지 않는 팀은 텍스트 기록으로 시작할 수 있고, 사용할 기록과 도구는 시작 전에 함께 확인합니다."],
  ["신청할 때 업무 기록을 보내야 하나요?", "아니요. 신청 폼은 팀 소개와 지금 막힌 장면, 희망 시기만 받습니다. 개인별 업무 기록이나 회의 자료는 보내지 않아도 됩니다. 실제 과정에서 필요한 기록과 공유 범위는 별도로 협의합니다."],
] as const;

export default function ProofPage() {
  return (
    <>
      <ProofHero />

      <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
        {/* 한 칼럼 큰 인용. 아래 원칙 절과 판형이 겹치지 않게 2단을 쓰지 않는다. */}
        <section className="pt-20 sm:pt-24" aria-labelledby="scenes-title">
          <h2 id="scenes-title" className="text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">이런 장면에서 시작합니다</h2>
          <ul className="mt-8 max-w-[46rem] space-y-6 text-xl leading-snug text-pretty sm:text-2xl">
            <li>“팀원에게 피드백을 주고 싶은데, 결과물만으로는 어디서 막혔는지 모르겠어요.”</li>
            <li>“AI로 일은 빨라졌는데, 각자 무엇을 할 수 있게 됐는지 설명하기 어려워요.”</li>
            <li>“한 프로젝트가 끝나도, 다음에 무엇을 맡기고 어떻게 도와야 할지 막막해요.”</li>
          </ul>
        </section>

        {/* 5단계 흐름 표. 번호는 실제 순서라 붙인다 (DESIGN.md §5). */}
        <section id="process" className="mt-20 scroll-mt-24 sm:mt-24" aria-labelledby="process-title">
          <p className="text-ink-faint font-mono text-xs tracking-[0.08em]">준비 중인 4주 과정</p>
          <h2 id="process-title" className="mt-3 text-3xl font-bold tracking-[-0.03em] text-pretty">기록을 읽고, 초안을 검토하고, 변화를 다시 봅니다</h2>
          <ol className="border-line mt-8 border-t">
            {FLOW.map((step, index) => (
              <li key={step.title} className="border-line grid gap-x-8 gap-y-2 border-b py-6 md:grid-cols-[3.5rem_minmax(0,1fr)_9rem] md:py-7">
                <span className="text-ink-faint font-mono text-sm tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-pretty">{step.title}</h3>
                  <p className="text-ink-soft mt-2 max-w-[46rem] leading-relaxed text-pretty">{step.body}</p>
                </div>
                <span className="text-ink-faint font-mono text-xs tracking-[0.04em] md:pt-1.5 md:text-right">{step.who}</span>
              </li>
            ))}
          </ol>
          <p className="text-ink-faint mt-5 max-w-[46rem] text-sm leading-relaxed">실습 과제를 수행하면 새 기록이 쌓이고, 4주차 진단이 1주차 기준점과 겹쳐 비교됩니다. 세부 일정과 기록 범위는 팀 상황을 확인한 뒤 안내합니다.</p>
        </section>

        {/* 예시 카드. iris-wash 를 쓰지 않는다 — 위의 띠와 쌍둥이가 된다 (DESIGN.md §8). */}
        <section className="bg-surface rounded-card mt-20 p-7 sm:mt-24 sm:p-12" aria-labelledby="sample-title">
          <p className="text-ink-faint font-mono text-xs tracking-[0.08em]">SAMPLE · 가상의 예시</p>
          <h2 id="sample-title" className="mt-3 text-2xl font-bold tracking-[-0.02em]">“검토를 더 꼼꼼히”에서 한 걸음 더</h2>
          <p className="text-ink-soft mt-3 text-sm">진행 방식을 설명하기 위해 만든 장면입니다. 실제 팀의 기록이 아닙니다.</p>
          <dl className="mt-8 grid gap-6 md:grid-cols-3">
            <div><dt className="font-bold">기록에서 발견한 장면</dt><dd className="text-ink-soft mt-2 leading-relaxed">화면은 구현했지만 오류가 나는 조건을 점검한 기록이 없습니다.</dd></div>
            <div><dt className="font-bold">다음 업무에서 할 연습</dt><dd className="text-ink-soft mt-2 leading-relaxed">다음 화면의 오류·예외 조건을 먼저 적고, 테스트 결과를 남깁니다.</dd></div>
            <div><dt className="font-bold">다시 확인할 변화</dt><dd className="text-ink-soft mt-2 leading-relaxed">어떤 위험을 스스로 발견했고, 검증하고 수정했는지 같은 기준으로 봅니다.</dd></div>
          </dl>
        </section>

        <section className="mt-20 sm:mt-24" aria-labelledby="principles-title">
          <h2 id="principles-title" className="text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">기록을 다루는 원칙</h2>
          <p className="text-ink-soft mt-3 max-w-[46rem]">직함이나 인상만으로 설명하기 어려운 일을, 실제 과업과 맥락에서 살펴봅니다.</p>
          <ul className="mt-8 max-w-[46rem] space-y-7">
            {PRINCIPLES.map(([title, body]) => (
              <li key={title}>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-ink-soft mt-2 leading-relaxed text-pretty">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 진행하는 사람 — 두 줄. 이력 전체는 소개 페이지가 맡는다. 숫자에는 시점을 같이 적는다. */}
        <section className="border-line mt-20 border-t pt-10 sm:mt-24" aria-labelledby="coach-title">
          <h2 id="coach-title" className="text-2xl font-bold tracking-[-0.02em]">진행하는 사람</h2>
          <ul className="text-ink-soft mt-5 max-w-[46rem] space-y-3 leading-relaxed">
            <li className="tabular-nums">규로롱. 프로젝트 워크스페이스 퍼플즈를 만들고 운영하며, 팀 11곳이 회의 영상 90건과 프로젝트 36건을 남긴 기록 환경을 다룹니다 (2026년 9월 기준).</li>
            <li className="tabular-nums">협업 성향 진단 알고리즘은 특허 출원 상태입니다 (2025년 7월).</li>
          </ul>
          <Link href={INTERNAL_LINKS.about} className="text-ink-soft hover:text-ink mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4">어떤 경험을 해왔는지</Link>
        </section>

        <section className="mt-20 sm:mt-24" aria-labelledby="faq-title">
          <h2 id="faq-title" className="text-2xl font-bold tracking-[-0.02em]">궁금할 수 있는 것들</h2>
          <div className="mt-6">
            {FAQ.map(([question, answer]) => (
              <details key={question} className="border-line border-b py-5">
                <summary className="cursor-pointer py-1 pr-4 font-semibold">{question}</summary>
                <p className="text-ink-soft mt-4 max-w-[46rem] leading-relaxed">{answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 신청. 이 페이지에서 2단은 여기 한 번뿐이다. 보라 슬랩은 위 띠가 가져갔으므로 폼은 조용한 카드다. */}
        <section id="apply" className="border-line mt-20 mb-16 grid scroll-mt-24 gap-8 border-t pt-10 sm:mt-24 sm:mb-20 md:grid-cols-[0.8fr_1.2fr] md:gap-14" aria-labelledby="apply-title">
          <div>
            <p className="text-ink-faint font-mono text-xs tracking-[0.08em]">파일럿 참여 신청</p>
            <h2 id="apply-title" className="mt-3 text-3xl font-bold tracking-[-0.03em] text-pretty">지금 팀에서 막힌 장면부터 남겨주세요</h2>
            <p className="text-ink-soft mt-5 leading-relaxed text-pretty">1분이면 남길 수 있습니다. 팀 소개와 막힌 장면, 희망 시기만 받고, 업무 기록은 받지 않습니다. 상황을 읽고 Proof가 도움이 될 수 있을지부터 이메일로 함께 살펴보겠습니다.</p>
            <p className="text-ink-faint mt-4 text-sm leading-relaxed">신청만으로 참여나 비용이 확정되지 않습니다. 기관 단위의 협업 문의도 같은 폼으로 남길 수 있습니다.</p>
          </div>
          <ProofApplyForm />
        </section>
      </div>
    </>
  );
}
