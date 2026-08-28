"use client";

import { useEffect, useState } from "react";

/**
 * 푸터의 "오늘 N명".
 *
 * 헤더의 로그인 상태(auth-status.tsx)와 같은 이유로 클라이언트에서 읽는다.
 * 푸터는 모든 페이지에 있으므로 서버에서 읽으면 사이트 전체가 애널리틱스에
 * 묶이고, 정적 페이지에서는 빌드 시점 숫자가 그대로 굳는다.
 *
 * 실패하면 아무것도 안 그린다. 방문자 수는 이 사이트의 논지가 아니라 덤이라,
 * 없다고 푸터가 이상해지면 안 된다.
 */
export function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    // 언마운트 뒤에 setState 가 불리지 않게 잠금 하나만 둔다
    let alive = true;

    fetch("/api/visitors")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { visitors?: unknown } | null) => {
        if (alive && typeof data?.visitors === "number") setVisitors(data.visitors);
      })
      .catch(() => {
        /* 애널리틱스가 죽어도 푸터는 그대로 있어야 한다 */
      });

    return () => {
      alive = false;
    };
  }, []);

  if (visitors === null) return null;

  return (
    <p className="text-ink-soft flex items-center gap-2 text-xs">
      {/*
        형광은 화면에 한 점만(DESIGN.md 3번). 상태 점은 그 규칙의 명시적 예외지만,
        --acid-deep 은 '현재 배경에서 항상 보이는 초록'이라 다크에서는 #8FFF00 이다.
        §2 가 형광 예산에서 빼주는 '작은 상태 점'(~8px) 예외에 해당한다 — 정보를
        전달하고 면적이 없으며, 늘 푸터 같은 자리에 고정이라 흩어지지 않는다.
      */}
      <span className="bg-acid-deep h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
      오늘 <span className="font-mono tabular-nums">{visitors.toLocaleString("ko-KR")}</span>명
    </p>
  );
}
