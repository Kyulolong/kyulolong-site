"use client";

import { useEffect, useState } from "react";

/**
 * 글 상세 하단, 하트 옆의 "조회 N".
 *
 * 좋아요 숫자(like-button.tsx)와 같은 방식이다 — 페이지는 정적으로 나가고
 * 숫자만 클라이언트가 받아온다 (CLAUDE.md 11번).
 *
 * **목록에는 세우지 않는다.** 조회수는 읽기 전에 보이면 제목 대신 그 숫자로
 * 고르게 만드는 종류의 숫자다. `/thoughts` 의 한 줄에서 판단을 돕는 숫자는
 * 읽는 시간 하나뿐이고(thought-row.tsx), 조회수는 다 읽은 뒤에야 뜻이 생긴다.
 *
 * ⚠️ **알약으로 만들지 말 것** (DESIGN.md §6 — 알약은 버튼의 것이다).
 * 옆의 하트는 눌리니까 테두리 알약이고, 이건 안 눌리니까 맨 글자다.
 * 같은 모양으로 맞추면 누를 수 있는 것처럼 보인다.
 */

/**
 * 이 아래로는 안 그린다 (2026-09-19). 푸터의 방문자 수를 뺀 것과 같은 판단이다 —
 * "조회 2" 는 읽는 사람에게 "아무도 안 읽는 글"이라고 말한다. 값이 커야 뜻이 있는
 * 숫자는 뜻이 생길 때부터 보여준다.
 */
const MIN_VIEWS = 30;

/**
 * 조회수를 "100+" 꼴로 묶는다. 계단은 1 · 2 · 3 · 5 × 10ⁿ 이다
 * (30+ · 50+ · 100+ · 200+ · 300+ · 500+ · 1,000+ …).
 *
 * ⚠️ **늘 내림이다. 올림으로 바꾸지 말 것.** "100+" 는 100 을 넘겼을 때만 뜬다 —
 * 97 을 "100+" 로 적는 순간 이 사이트의 다른 숫자들(buildTime · 읽는 시간)까지
 * 의심받는다. 묶는 이유는 부풀리기가 아니라, 137 과 142 의 차이가 읽는 사람에게
 * 아무 뜻이 없어서다.
 */
export function viewsBucket(views: number): string | null {
  if (views < MIN_VIEWS) return null;
  const magnitude = 10 ** Math.floor(Math.log10(views));
  const lead = views / magnitude;
  const step = lead >= 5 ? 5 : lead >= 3 ? 3 : lead >= 2 ? 2 : 1;
  return `${(step * magnitude).toLocaleString("ko-KR")}+`;
}

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
   * 모르는 동안에도, MIN_VIEWS 아래일 때도 아무것도 안 그린다 (하트가 "0" 대신
   * 하트만 남는 것과 같은 판단).
   */
  const bucket = views === null ? null : viewsBucket(views);
  if (!bucket) return null;

  return (
    <p className="text-ink-faint text-sm">
      조회 <span className="font-mono tabular-nums">{bucket}</span>
    </p>
  );
}
