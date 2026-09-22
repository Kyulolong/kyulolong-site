import Link from "next/link";
import type { Thought } from "@/lib/content";
import { INTERNAL_LINKS, KAKAO_OPENCHAT } from "@/lib/site-links";

export function ThoughtNextStep({ thought }: { thought: Thought }) {
  const isGoal = thought.tags.includes("목표");
  const isGrowth = thought.series === "일과 성장";
  const title = isGoal ? "우리 팀의 목표에도 적용해보세요" : isGrowth ? "지금 하는 일에서, 다음에 배울 것을 찾고 싶다면" : "우리 팀에서도 비슷한 일이 생긴다면";

  return (
    <aside aria-label="읽은 다음에" className="border-line bg-iris-wash rounded-card mt-14 border p-6 sm:p-8">
      <p className="text-ink-faint text-xs">읽은 다음에</p>
      <h2 className="mt-3 text-xl leading-snug font-bold text-pretty">{title}</h2>
      <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
        {isGoal
          ? "목표를 세우는 기준과 운영 체크리스트를 무료 가이드로 정리했습니다. 팀이 무엇을 할지 함께 정하는 데 써보세요."
          : isGrowth
            ? "글에서 떠오른 질문이나 직접 해본 경험을 오픈채팅에서 나눠주세요. 지금 하는 일을 함께 돌아보는 데서 시작할 수 있습니다."
            : "개인의 태도만으로 설명하기 어려운 장면을 실제 업무 기록에서 살펴봅니다. Proof는 피드백과 실무 과제, 변화 확인을 잇는 팀 코칭을 준비하고 있습니다."}
      </p>
      {isGoal ? (
        <Link href={`${INTERNAL_LINKS.resources}#goal-guide`} className="border-line-strong text-ink hover:bg-surface-2 mt-6 inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-sm font-bold transition-colors" data-umami-event="article-guide-open">목표 설계 가이드 보기</Link>
      ) : isGrowth ? (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a href={KAKAO_OPENCHAT.href} target="_blank" rel="noreferrer noopener" className="border-line-strong text-ink hover:bg-surface-2 inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-sm font-bold transition-colors" data-umami-event="article-community-open">오픈채팅에서 이야기 나누기</a>
          <span className="text-ink-faint text-sm">입장코드 {KAKAO_OPENCHAT.code}</span>
        </div>
      ) : (
        <Link href={INTERNAL_LINKS.proof} className="border-line-strong text-ink hover:bg-surface-2 mt-6 inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-sm font-bold transition-colors" data-umami-event="article-proof-open">Proof 코칭 알아보기</Link>
      )}
      {(isGoal || isGrowth) && <p className="text-ink-soft mt-5 text-sm">팀의 기록을 바탕으로 함께 살펴보고 싶다면 <Link href={INTERNAL_LINKS.proof} className="inline-flex min-h-11 items-center underline underline-offset-4">Proof 코칭 알아보기</Link></p>}
    </aside>
  );
}
