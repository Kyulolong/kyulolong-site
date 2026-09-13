import { readStorage, writeStorage } from "@/lib/visitor";

/**
 * 테마 — 다크가 기본, 라이트는 OS 설정 + 헤더 토글 (CLAUDE.md 7번, DESIGN.md §3).
 *
 * 상태는 셋이다. 저장값 없음 = OS 를 따른다(<html> 에 속성 없음) / "light" / "dark".
 * 실제 색은 app/globals.css 의 light-dark() 토큰이 color-scheme 을 보고 고르므로,
 * 여기서 하는 일은 <html data-theme> 하나를 세우고 지우는 것뿐이다.
 *
 * 토글은 지금 보이는 테마의 반대를 **명시로 저장**한다. 명시값은 OS 가 바뀌어도
 * 그대로다 — 고른 대로 보이는 게 가장 예측 가능하다. "OS 로 되돌리기"는 UI 로
 * 만들지 않는다(헤더에 한 칸만 쓴다). 키를 지우면 OS 를 따르는 상태로 돌아간다.
 *
 * ⚠️ 이 모듈은 app/layout.tsx(서버)가 상수 때문에 import 한다. 모듈 스코프에서
 * window 를 만지지 말 것 — SSR 이 죽는다. "use client" 도 붙이지 않는다(붙이면
 * 상수 export 가 클라이언트 참조로 바뀐다). 브라우저를 만지는 함수는 전부
 * 클라이언트 컴포넌트의 이펙트·핸들러·스토어 구독 안에서만 불린다.
 *
 * 키는 kyulolong.visitor·kyulolong.likes 와 같은 이름 공간이다. kyulolong.com/* 가
 * 같은 오리진이라 서비스 앱이 이 키를 읽으면 사이트 전체가 한 테마가 된다 —
 * Supabase storageKey 와 같은 원리다 (CLAUDE.md 11번, docs/SERVICE-CHECKLIST.md).
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "kyulolong.theme";

/**
 * 주소창 색 (app/layout.tsx 의 viewport.themeColor).
 * 값은 globals.css 의 --color-canvas 양쪽과 같아야 한다 — 다르면 주소창과
 * 페이지 사이에 없던 경계선이 생긴다.
 */
export const THEME_COLOR: Record<Theme, string> = { light: "#ffffff", dark: "#121019" };

/**
 * <head> 인라인 스크립트. HTML 파싱 중에 동기로 돌아 **첫 페인트 전에** data-theme 을
 * 세운다. useEffect 로 하면 서버가 그린 다크가 먼저 칠해진 뒤 뒤집혀서 깜빡이고,
 * 클라이언트 컴포넌트에서 바로 읽으면 하이드레이션이 깨진다.
 * 키 문자열을 여기서 조립하는 이유는 키가 한 곳에만 있게 하려는 것이다.
 */
export const THEME_BOOT_SCRIPT =
  `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});` +
  `if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}})()`;

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

/** 저장된 선택. 없으면 null — OS 를 따르는 상태다 */
export function readChoice(): Theme | null {
  const saved = readStorage(THEME_KEY);
  return isTheme(saved) ? saved : null;
}

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

/** 지금 화면에 보이는 테마. 문자열이라 useSyncExternalStore 스냅샷으로 안정적이다 */
export function effectiveTheme(): Theme {
  return readChoice() ?? systemTheme();
}

/**
 * <html data-theme> 과 주소창 색을 저장값에 맞춘다.
 *
 * theme-color meta 는 layout 이 OS 별로 둘을 내보낸다. 명시 선택일 땐 브라우저가
 * OS 쪽 것을 고르므로 둘 다 실제 테마 색으로 덮는다 — 선택이 없을 땐 둘 다 OS 색이
 * 되니 그것도 맞다. React 는 prop 이 안 바뀐 속성을 다시 쓰지 않으므로 소프트
 * 내비게이션에서 되돌아가지 않는다.
 */
export function applyTheme(): void {
  const choice = readChoice();
  const root = document.documentElement;
  if (choice) root.dataset.theme = choice;
  else delete root.dataset.theme;

  const color = THEME_COLOR[choice ?? systemTheme()];
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = color;
  });
}

const listeners = new Set<() => void>();
let wired = false;

function emit(): void {
  for (const listener of listeners) listener();
}

export function setChoice(next: Theme): void {
  writeStorage(THEME_KEY, next);
  applyTheme();
  emit();
}

/**
 * 첫 구독에서 한 번만 OS 변경과 다른 탭의 변경(storage 이벤트)을 건다 —
 * components/like-button.tsx 의 load() 가 첫 구독에서 한 번만 도는 것과 같은 모양.
 * 다른 탭(또는 같은 오리진의 서비스 앱)에서 바꾸면 이 탭도 따라온다.
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (!wired) {
    wired = true;
    const sync = () => {
      applyTheme();
      emit();
    };
    window.matchMedia(DARK_QUERY).addEventListener("change", sync);
    window.addEventListener("storage", (e) => {
      // key === null 은 localStorage.clear() 다
      if (e.key === THEME_KEY || e.key === null) sync();
    });
  }
  return () => {
    listeners.delete(listener);
  };
}
