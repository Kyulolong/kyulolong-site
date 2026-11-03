import Link from "next/link";
import type { Thought } from "@/lib/content";
import { INTERNAL_LINKS } from "@/lib/site-links";

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
            ? "일한 기록에서 잘한 일과 막힌 지점을 찾으면 다음에 연습할 것이 보입니다. Proof는 그 과정을 함께하는 팀 코칭을 준비하고 있습니다."
            : "개인의 태도만으로 설명하기 어려운 장면을 실제 업무 기록에서 살펴봅니다. Proof는 피드백과 실무 과제, 변화 확인을 잇는 팀 코칭을 준비하고 있습니다."}
      </p>
      {isGoal ? (
        <Link href={`${INTERNAL_LINKS.resources}#goal-guide`} className="border-line-strong text-ink hover:bg-surface-2 mt-6 inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-sm font-bold transition-colors" data-umami-event="article-guide-open">목표 설계 가이드 보기</Link>
      ) : (
        // 일과 성장 글도 Proof 로 간다. 예전엔 오픈채팅이었는데 2026-11-03 에 방 운영을 접었다.
        <Link href={INTERNAL_LINKS.proof} className="border-line-strong text-ink hover:bg-surface-2 mt-6 inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-sm font-bold transition-colors" data-umami-event="article-proof-open">Proof 코칭 알아보기</Link>
      )}
      {isGoal && <p className="text-ink-soft mt-5 text-sm">팀의 기록을 바탕으로 함께 살펴보고 싶다면 <Link href={INTERNAL_LINKS.proof} className="inline-flex min-h-11 items-center underline underline-offset-4">Proof 코칭 알아보기</Link></p>}
    </aside>
  );
}
