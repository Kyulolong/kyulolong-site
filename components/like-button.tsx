"use client";

import { useState, useSyncExternalStore } from "react";
import type { LikeKind } from "@/lib/likes";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";

/**
 * 로그인 없이 누르는 좋아요. 서비스 카드와 영상 카드가 같이 쓴다.
 *
 * 로그인을 붙이지 않는 이유는 이 사이트의 논지 그대로다 — 가입해야 할 수 있는
 * 건 하나도 없다 (CLAUDE.md 3번). 대신 브라우저마다 uuid 를 하나 만들어
 * localStorage 에 두고, 그걸로 같은 사람이 두 번 세지는 것만 막는다.
 * 사람과 이어지는 정보가 아니라서 이름도 이메일도 필요 없다.
 *
 * 쓰기는 Supabase RPC 한 개(toggle_like)로만 나간다. 테이블은 잠겨 있고
 * 그 함수가 유일한 문이다 — 이유는 supabase/likes.sql 에 적어뒀다.
 *
 * Supabase 설정이 없으면 **버튼 자체를 그리지 않는다.** 눌러도 아무 일 없는
 * 버튼이 남아 있는 것보다 없는 게 낫다.
 */

const VISITOR_KEY = "kyulolong.visitor";
const LIKED_KEY = "kyulolong.likes";

/** 저장소가 막혀 있어도(사파리 프라이빗 등) 페이지가 죽지 않게 전부 감싼다 */
function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // 저장 못 하면 이번 세션만 유지된다. 그걸로 충분하다.
  }
}

/**
 * 이 브라우저의 id. kyulolong.com/* 가 같은 오리진이라 서비스들과 함께 쓴다
 * (세션 공유와 같은 원리 — CLAUDE.md 11번).
 */
function visitorId(): string {
  const saved = readStorage(VISITOR_KEY);
  if (saved) return saved;

  const fresh = crypto.randomUUID();
  writeStorage(VISITOR_KEY, fresh);
  return fresh;
}

function readLikedSlugs(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(readStorage(LIKED_KEY) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []);
  } catch {
    return new Set();
  }
}

/**
 * 카드 밖에 사는 작은 스토어.
 *
 * 카드마다 각자 상태를 들면 요청이 카드 수만큼 나가고(목록은 곧 60장이 된다),
 * 같은 서비스가 두 군데 보일 때 숫자가 서로 어긋난다. 그래서 데이터는 여기
 * 한 곳에 두고 컴포넌트는 useSyncExternalStore 로 읽기만 한다.
 *
 * 키는 `service:navigator` 처럼 kind 를 붙인다 — 서비스와 영상의 슬러그가
 * 겹칠 수 있어서 슬러그만으로는 서로의 숫자를 덮어쓴다.
 */
const key = (kind: LikeKind, slug: string) => `${kind}:${slug}`;

const counts = new Map<string, number>();
let liked = new Set<string>();
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

/** 첫 구독이 들어올 때 딱 한 번 받아온다 */
function load(): void {
  loading ??= (async () => {
    liked = readLikedSlugs(); // 저장소에 있는 건 먼저 그린다
    emit();

    type Counts = Partial<Record<LikeKind, Record<string, number>>>;
    const fromServer: Counts = await fetch("/api/likes")
      .then((r) => (r.ok ? r.json() : { counts: {} }))
      .then((d: { counts?: Counts }) => d.counts ?? {})
      .catch(() => ({}));

    for (const [kind, perSlug] of Object.entries(fromServer)) {
      for (const [slug, n] of Object.entries(perSlug ?? {})) {
        counts.set(key(kind as LikeKind, slug), n);
      }
    }

    /**
     * 서버가 아는 "이 브라우저가 누른 것" 으로 하트를 맞춘다.
     * 저장소를 비웠거나 기기를 옮겼을 때 localStorage 만 믿으면 어긋난다.
     */
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.rpc("my_likes", { p_visitor: visitorId() });
        if (!error && Array.isArray(data)) {
          liked = new Set(
            (data as { kind: LikeKind; slug: string }[]).map((row) => key(row.kind, row.slug)),
          );
          writeStorage(LIKED_KEY, JSON.stringify([...liked]));
        }
      } catch {
        // 저장소에서 읽은 값으로 남는다
      }
    }

    emit();
  })();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  load();
  return () => {
    listeners.delete(listener);
  };
}

function setLocalLike(id: string, on: boolean): void {
  const next = new Set(liked);
  if (on) next.add(id);
  else next.delete(id);
  liked = next;
  writeStorage(LIKED_KEY, JSON.stringify([...next]));
}

export function LikeButton({
  kind,
  slug,
  /** 랜딩은 서버에서 이미 숫자를 알고 온다 — 첫 화면에서 하트가 비어 보이지 않게 넘긴다 */
  initialCount,
  className = "",
}: {
  kind: LikeKind;
  slug: string;
  initialCount?: number;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const id = key(kind, slug);

  /**
   * 서버 렌더와 첫 클라이언트 렌더는 initialCount(랜딩) 또는 "모름"으로 맞춘다.
   * 여기서 localStorage 를 읽으면 서버가 그린 것과 달라져 하이드레이션이 깨진다.
   */
  const count = useSyncExternalStore(
    subscribe,
    () => counts.get(id) ?? initialCount ?? null,
    () => initialCount ?? null,
  );
  const isLiked = useSyncExternalStore(
    subscribe,
    () => liked.has(id),
    () => false,
  );

  if (!isAuthConfigured) return null;

  async function toggle() {
    const sb = getSupabase();
    if (!sb || busy) return;

    setBusy(true);

    // 낙관적 갱신 — 누른 사람 화면은 먼저 움직인다
    const before = counts.get(id) ?? initialCount ?? 0;
    counts.set(id, Math.max(0, before + (isLiked ? -1 : 1)));
    setLocalLike(id, !isLiked);
    emit();

    try {
      const { data, error } = await sb.rpc("toggle_like", {
        p_kind: kind,
        p_slug: slug,
        p_visitor: visitorId(),
      });
      if (error) throw error;
      if (typeof data === "number") counts.set(id, data);
    } catch {
      // 되돌린다. 실패를 붉은 글씨로 알리지 않는다 — 응원 버튼 하나다 (DESIGN.md §9)
      counts.set(id, before);
      setLocalLike(id, isLiked);
    } finally {
      emit();
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={isLiked}
      aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      title={isLiked ? "좋아요 취소" : "좋아요"}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-[6px] px-2 py-1 text-[11px] transition-colors ${
        isLiked ? "text-acid-deep" : "text-ink-faint hover:text-ink-soft"
      } ${className}`}
    >
      {/* 형광 대신 acid-deep 을 쓴다. 카드가 60장이 되면 형광 하트가 화면 전체에
          흩어져서, 한 화면에 한 곳이라는 규칙이 목록에서 무너진다 (DESIGN.md §2). */}
      <svg
        viewBox="0 0 20 20"
        width="14"
        height="14"
        aria-hidden="true"
        fill={isLiked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        className="shrink-0"
      >
        <path d="M10 16.5S3.5 12.6 3.5 8.2A3.7 3.7 0 0 1 10 5.9a3.7 3.7 0 0 1 6.5 2.3c0 4.4-6.5 8.3-6.5 8.3Z" />
      </svg>
      {/* 숫자를 모르는 동안(로딩·Supabase 다운)에는 하트만 남는다. 0 이라고 쓰지 않는다 */}
      {count === null ? null : <span className="font-mono tabular-nums">{count}</span>}
    </button>
  );
}
