"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { applyTheme, effectiveTheme, setChoice, subscribe } from "@/lib/theme";

/**
 * 헤더의 테마 토글 (CLAUDE.md 7번, lib/theme.ts).
 *
 * **아이콘은 테마와 무관하게 같은 마크업이다.** 그래서 서버 렌더 그대로 첫 페인트에
 * 나오고(클라이언트에서 늦게 뜨지 않는다), 하이드레이션 뒤에는 aria-label 과
 * title 만 실제 상태로 바뀐다 — 눈에 보이는 변화가 없다. 서버 스냅샷을 null 로
 * 두는 이유가 그것이다: 서버와 첫 클라이언트 렌더가 같아야 하이드레이션이 안 깨진다
 * (components/like-button.tsx 와 같은 방식).
 *
 * 라벨은 상태가 아니라 **행동**이다("밝은 화면으로"). 그래서 aria-pressed 를 안 쓴다.
 *
 * 무형태다 — 알약도 채움도 테두리도 없고 잉크색만 (site-header.tsx "헤더에 버튼을
 * 넣지 않는다"). 형광은 안 쓴다. 이 화면의 형광 한 점은 히어로가 가져갔다.
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
      className="text-ink-faint hover:text-ink hidden min-h-11 min-w-11 items-center justify-center transition-colors supports-[color:light-dark(red,blue)]:inline-flex"
    >
      {/* 반원 대비 아이콘 — 관습이 있어 은유를 새로 만들 필요가 없고, 원 하나라 16px 에서
          뭉개지지 않는다. thought-search.tsx 와 같은 관례(16 viewBox, 1.5 stroke). */}
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
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
