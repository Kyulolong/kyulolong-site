"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { applyTheme, effectiveTheme, setChoice, subscribe } from "@/lib/theme";

/**
 * 테마 토글 (CLAUDE.md 7번, lib/theme.ts).
 *
 * **아이콘은 테마와 무관하게 같은 마크업이다.** 그래서 서버 렌더 그대로 첫 페인트에
 * 나오고(클라이언트에서 늦게 뜨지 않는다), 하이드레이션 뒤에는 aria-label 과
 * title 만 실제 상태로 바뀐다 — 눈에 보이는 변화가 없다. 서버 스냅샷을 null 로
 * 두는 이유가 그것이다: 서버와 첫 클라이언트 렌더가 같아야 하이드레이션이 안 깨진다
 * (components/like-button.tsx 와 같은 방식).
 *
 * 라벨은 상태가 아니라 **행동**이다("밝은 화면으로"). 그래서 aria-pressed 를 안 쓴다.
 *
 * **자리는 화면 우측 아래, 작게** (2026-09-23 — 헤더 맨 오른쪽 자리는 오픈채팅이 가져갔다).
 * app/layout.tsx 가 body 끝에 세운다. `--surface` 면 + `--line` 테두리의 작은 원이라 형광도 보라도
 * 아니다. 모바일에서는 하단 바 위에 앉도록 bottom 을 `--nav-space`(바 높이 + 안전영역)만큼 띄운다 —
 * md 이상에서는 그 변수가 0 이라 저절로 모서리로 내려온다. z-40 은 하단 바와 같은 층이고
 * 헤더(z-50)보다 낮다.
 *
 * `hidden supports-[…]:inline-flex` — light-dark() 를 모르는 브라우저(iOS 17.4 이하)는
 * globals.css 의 라이트 블록을 통째로 무시해 늘 다크라, 토글이 아무 일도 못 한다.
 * 그런 데서는 아예 안 그린다.
 */
const LABEL = { light: "어두운 화면으로", dark: "밝은 화면으로" } as const;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, effectiveTheme, () => null);

  /**
   * dev Strict Mode 는 리마운트 때 <html> 을 JSX 속성만 남기고 리셋해서 인라인
   * 스크립트가 세운 data-theme 이 지워진다. 페인트 전에 다시 붙인다.
   * 프로덕션에서는 이미 같은 값이라 아무 일도 안 한다.
   */
  useLayoutEffect(() => {
    applyTheme();
  }, []);

  const label = theme ? LABEL[theme] : "화면 밝기 바꾸기";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setChoice(effectiveTheme() === "dark" ? "light" : "dark")}
      className="bg-surface border-line text-ink-faint hover:text-ink hover:border-line-strong fixed right-4 bottom-[calc(var(--nav-space)+1rem)] z-40 hidden size-11 items-center justify-center rounded-full border shadow-sm transition-colors supports-[color:light-dark(red,blue)]:inline-flex md:right-5 md:bottom-5 md:size-9"
    >
      {/* 반원 대비 아이콘 — 관습이 있어 은유를 새로 만들 필요가 없고, 원 하나라 16px 에서
          뭉개지지 않는다. thought-search.tsx 와 같은 관례(16 viewBox, 1.5 stroke). */}
      <svg
        viewBox="0 0 16 16"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="6.25" />
        <path d="M8 1.75v12.5A6.25 6.25 0 0 0 8 1.75Z" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
