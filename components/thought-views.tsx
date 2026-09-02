"use client";

import { useEffect, useState } from "react";

/**
 * 글 상세 하단, 하트 옆의 "조회 N".
 *
 * 푸터의 방문자 수(visitor-count.tsx)와 같은 방식이다 — 페이지는 정적으로
 * 나가고 숫자만 클라이언트가 받아온다 (CLAUDE.md 11번).
 *
 * **목록에는 세우지 않는다.** 조회수는 읽기 전에 보이면 제목 대신 그 숫자로
 * 고르게 만드는 종류의 숫자다. `/thoughts` 의 한 줄에서 판단을 돕는 숫자는
 * 읽는 시간 하나뿐이고(thought-row.tsx), 조회수는 다 읽은 뒤에야 뜻이 생긴다.
 *
 * ⚠️ **알약으로 만들지 말 것** (DESIGN.md §6 — 알약은 버튼의 것이다).
 * 옆의 하트는 눌리니까 테두리 알약이고, 이건 안 눌리니까 맨 글자다.
 * 같은 모양으로 맞추면 누를 수 있는 것처럼 보인다.
 */
export function ThoughtViews({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // 언마운트 뒤에 setState 가 불리지 않게 잠금 하나만 둔다
    let alive = true;

    fetch("/api/views")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { views?: Record<string, unknown> | null } | null) => {
        const n = data?.views?.[slug];
        if (alive && typeof n === "number") setViews(n);
      })
      .catch(() => {
        /* 애널리틱스가 죽어도 글은 그대로 있어야 한다 */
      });

    return () => {
      alive = false;
    };
  }, [slug]);

  /*
   * 모르는 동안에도, 0 일 때도 아무것도 안 그린다.
   *
   * 0 을 그리지 않는 이유가 따로 있다: 지금 이 사람이 읽고 있는데 "조회 0" 이
   * 뜨면 숫자가 고장 난 것처럼 보인다. 라우트가 5분 캐시라 갓 올린 글은 실제로
   * 잠깐 그 상태가 된다 (하트가 "0" 대신 하트만 남는 것과 같은 판단).
   */
  if (views === null || views < 1) return null;

  return (
    <p className="text-ink-faint text-sm">
      조회 <span className="font-mono tabular-nums">{views.toLocaleString("ko-KR")}</span>
    </p>
  );
}
