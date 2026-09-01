/**
 * 이 브라우저를 가리키는 임의의 uuid — 좋아요(components/like-button.tsx)와
 * 댓글(components/thought-comments.tsx)이 같은 id 를 쓴다.
 *
 * 사람과 이어지는 정보가 아니다. 이름도 이메일도 없이 "같은 브라우저" 만
 * 표시한다. kyulolong.com/* 가 같은 오리진이라 서비스들과도 공유된다
 * (세션 공유와 같은 원리 — CLAUDE.md 11번).
 *
 * 전부 브라우저 전용이다 (window 를 만진다). 클라이언트 컴포넌트의
 * 이펙트·핸들러 안에서만 부를 것.
 */

const VISITOR_KEY = "kyulolong.visitor";

/** 저장소가 막혀 있어도(사파리 프라이빗 등) 페이지가 죽지 않게 전부 감싼다 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 저장 못 하면 이번 세션만 유지된다. 그걸로 충분하다.
  }
}

export function visitorId(): string {
  const saved = readStorage(VISITOR_KEY);
  if (saved) return saved;

  const fresh = crypto.randomUUID();
  writeStorage(VISITOR_KEY, fresh);
  return fresh;
}
