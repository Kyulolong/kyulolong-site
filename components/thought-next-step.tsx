import Link from "next/link";
import type { Thought } from "@/lib/content";
import { INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 글 끝 「읽은 다음에」. **목표 태그 글에만** 선다 — 가이드가 그 글의 다음 행동이라서다.
 *
 * 예전엔 나머지 글 전부를 오픈채팅(~2026-11-03)으로, 그 뒤엔 Proof 코칭(~11-06)으로 보냈다.
 * 둘 다 운영을 접으면서 그 글들은 절 없이 본문 → 하트·댓글로 바로 간다. 보낼 데가 없는데
 * 절만 세우면 자료실 링크가 모든 글 끝에 서고, 그건 글을 자료의 광고로 읽히게 한다
 * (CLAUDE.md 6번 — 글 끝의 카드 절 경고와 같은 판단).
 */
export function ThoughtNextStep({ thought }: { thought: Thought }) {
  if (!thought.tags.includes("목표")) return null;

  return (
    <aside aria-label="읽은 다음에" className="border-line bg-iris-wash rounded-card mt-14 border p-6 sm:p-8">
      <p className="text-ink-faint text-xs">읽은 다음에</p>
      <h2 className="mt-3 text-xl leading-snug font-bold text-pretty">우리 팀의 목표에도 적용해보세요</h2>
      <p className="text-ink-soft mt-4 text-[0.9375rem] leading-relaxed">
        목표를 세우는 기준과 운영 체크리스트를 무료 가이드로 정리했습니다. 팀이 무엇을 할지 함께 정하는 데 써보세요.
      </p>
      <Link href={`${INTERNAL_LINKS.resources}#goal-guide`} className="border-line-strong text-ink hover:bg-surface-2 mt-6 inline-flex min-h-12 items-center rounded-full border px-5 py-3 text-sm font-bold transition-colors" data-umami-event="article-guide-open">목표 설계 가이드 보기</Link>
    </aside>
  );
}
