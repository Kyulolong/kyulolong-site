"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";
import { readStorage, visitorId, writeStorage } from "@/lib/visitor";

/**
 * 글 상세의 댓글. 좋아요와 같은 태도로 선다 —
 *
 * - **로그인 없이 쓴다** (CLAUDE.md 3번 "로그인은 문이 아니라 덤이다").
 *   닉네임 한 칸과 visitor uuid(좋아요와 같은 것)면 된다. 자기 댓글은 쓴
 *   브라우저에서만 지울 수 있다 — 그 uuid 가 유일한 자물쇠라서다.
 * - **전부 클라이언트다** (CLAUDE.md 11번). 서버 렌더에 안 걸려서 글 페이지는
 *   정적 그대로고, Supabase 가 죽은 날에도 본문은 멀쩡히 나간다 — 댓글 영역만
 *   조용히 비어 있는다.
 * - 쓰기·읽기·지우기는 RPC 세 개로만 나간다. 테이블은 잠겨 있다
 *   (supabase/comments.sql — 왜 그런지도 거기 있다).
 *
 * 댓글창을 닫는 스위치는 여기가 아니라 글 frontmatter 의 `comments: false` 다
 * (닫힌 글은 페이지가 이 컴포넌트를 아예 안 그린다). 댓글 하나를 숨기는 건
 * Studio 에서 hidden 컬럼을 올린다 — 숨긴 댓글은 comments_for 가 안 내보낸다.
 *
 * Supabase 설정이 없으면 **영역 자체를 그리지 않는다.** 써지지 않는 댓글창이
 * 남아 있는 것보다 없는 게 낫다 (like-button 과 같은 판단).
 */

const NICKNAME_KEY = "kyulolong.nickname";

type CommentRow = {
  id: string;
  nickname: string;
  body: string;
  created_at: string;
  mine: boolean;
};

/** 2026-09-01T12:34:56Z → 2026.09.01 (목록·상세의 날짜와 같은 얼굴) */
function formatDay(timestamp: string): string {
  return timestamp.slice(0, 10).replaceAll("-", ".");
}

export function ThoughtComments({ slug }: { slug: string }) {
  /** null = 아직 모름(로딩 중이거나 Supabase 다운). 빈 배열과 구별한다 — 0개라고 단정하지 않는다. */
  const [comments, setComments] = useState<CommentRow[] | null>(null);
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let cancelled = false;

    /**
     * 닉네임은 지난번 쓴 것을 먼저, 없고 로그인돼 있으면 계정 닉네임을 깐다.
     * 세션을 확인한 '뒤에' 한 번만 세운다 — 이펙트 안에서 동기로 setState 를
     * 부르면 렌더가 연쇄로 돌고 (auth-status 와 같은 이유), 서버가 그린 빈 칸과
     * 첫 페인트가 어긋나 하이드레이션이 깨진다.
     */
    const prefill = (accountNickname?: unknown) => {
      if (cancelled) return;
      const picked =
        readStorage(NICKNAME_KEY) ??
        (typeof accountNickname === "string" ? accountNickname : "");
      if (picked) setNickname(picked);
    };
    sb.auth.getSession().then(
      ({ data }) => prefill(data.session?.user?.user_metadata?.nickname),
      () => prefill(),
    );

    // rpc 는 실패를 error 필드로 준다 — reject 로 오는 일은 없어서 then 이면 된다
    sb.rpc("comments_for", { p_kind: "thought", p_slug: slug, p_visitor: visitorId() }).then(
      ({ data, error }) => {
        if (!cancelled && !error && Array.isArray(data)) setComments(data as CommentRow[]);
        // 못 읽으면 목록 없이 폼만 선다. 붉은 글씨로 알리지 않는다 (DESIGN.md §9)
      },
      () => {},
    );

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!isAuthConfigured) return null;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    const nick = nickname.trim();
    const text = body.trim();
    if (!sb || busy || !nick || !text) return;

    setBusy(true);
    setFailed(false);
    try {
      const { data, error } = await sb.rpc("add_comment", {
        p_kind: "thought",
        p_slug: slug,
        p_visitor: visitorId(),
        p_nickname: nick,
        p_body: text,
      });
      if (error) throw error;

      writeStorage(NICKNAME_KEY, nick);
      const row: CommentRow = {
        id: typeof data === "string" ? data : crypto.randomUUID(),
        nickname: nick,
        body: text,
        created_at: new Date().toISOString(),
        mine: true,
      };
      setComments((prev) => [...(prev ?? []), row]);
      setBody("");
    } catch {
      // 쿨다운(20초)·검증 실패·Supabase 다운이 전부 여기로 온다. 한 문장이면 된다.
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    const sb = getSupabase();
    if (!sb || busy) return;
    if (!window.confirm("이 댓글을 지울까요?")) return;

    // 낙관적 갱신 — 지운 사람 화면은 먼저 움직이고, 실패하면 되돌린다
    const before = comments;
    setComments((prev) => (prev ?? []).filter((c) => c.id !== id));
    try {
      const { error } = await sb.rpc("delete_comment", { p_id: id, p_visitor: visitorId() });
      if (error) throw error;
    } catch {
      setComments(before);
    }
  }

  return (
    <section className="mt-16" aria-label="댓글">
      <h2 className="text-xl font-bold tracking-[-0.02em]">
        댓글
        {comments && comments.length > 0 ? (
          <span className="text-ink-faint ml-2.5 align-middle font-mono text-base font-normal tabular-nums">
            {comments.length}
          </span>
        ) : null}
      </h2>

      {comments && comments.length > 0 ? (
        <ul className="mt-4">
          {comments.map((c) => (
            <li key={c.id} className="border-line border-b py-5">
              <div className="flex items-baseline gap-x-3">
                <span className="text-sm font-semibold">{c.nickname}</span>
                <time
                  dateTime={c.created_at}
                  className="text-ink-faint font-mono text-xs tabular-nums"
                >
                  {formatDay(c.created_at)}
                </time>
                {c.mine ? (
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="text-ink-faint hover:text-ink ml-auto text-xs transition-colors"
                  >
                    지우기
                  </button>
                ) : null}
              </div>
              {/* 본문은 텍스트 그대로 그린다 (React 가 이스케이프한다). 줄바꿈만 살린다. */}
              <p className="text-ink-soft mt-2 text-[0.9375rem] whitespace-pre-wrap text-pretty">
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      ) : comments === null ? null : (
        // 아직 모를 때(로딩 중·Supabase 다운)는 조용히 비워둔다 — "0개"라고 단정하지 않는다
        <p className="text-ink-faint mt-4 text-sm">아직 댓글이 없어요. 첫 줄을 남겨주세요.</p>
      )}

      <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={24}
          required
          placeholder="닉네임"
          aria-label="닉네임"
          className="bg-surface-2 border-line-strong focus:border-ink w-full max-w-[14rem] rounded-note border px-4 py-3 text-sm outline-none"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={1000}
          rows={3}
          required
          placeholder="읽고 남은 생각을 남겨주세요"
          aria-label="댓글 내용"
          className="bg-surface-2 border-line-strong focus:border-ink w-full resize-y rounded-note border px-4 py-3 text-sm outline-none"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {/* 형광이 아니라 보라다 — 이 화면이 하려는 말은 본문이지 댓글창이 아니다 (DESIGN.md §7) */}
          <button
            type="submit"
            disabled={busy}
            className="bg-iris text-on-iris hover:bg-iris-press rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors disabled:opacity-60"
          >
            댓글 남기기
          </button>
          <p className="text-ink-faint text-xs">
            {failed
              ? "지금은 등록하지 못했어요. 잠시 뒤에 다시 눌러주세요."
              : "로그인 없이 남길 수 있어요. 쓴 브라우저에서만 지울 수 있습니다."}
          </p>
        </div>
      </form>
    </section>
  );
}
