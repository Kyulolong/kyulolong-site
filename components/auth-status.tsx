"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";

/**
 * 헤더의 로그인 상태 (CLAUDE.md 11번).
 *
 * 세션을 서버에서 확인하지 않고 여기 클라이언트에서 localStorage 로 읽는다.
 * 서버에서 읽으면 헤더가 모든 페이지에 있으므로 사이트 전체가 정적 생성에서
 * 빠지고, Supabase 가 흔들릴 때 대문까지 같이 죽는다.
 *
 * 그래서 첫 페인트에는 아무것도 없다가 세션을 읽은 뒤에 나타난다.
 * 로그인은 문이 아니라 덤이라(스펙 3번) 이 깜빡임이 아무것도 막지 않는다.
 */
type Shown = { label: string; href: string };

export function AuthStatus() {
  /**
   * 라벨과 주소를 한 덩어리로 들고, 세션이 확인된 '뒤에' 한 번만 세운다.
   * effect 안에서 동기로 setState 를 부르면 렌더가 연쇄로 돈다.
   */
  const [shown, setShown] = useState<Shown | null>(null);

  useEffect(() => {
    if (!isAuthConfigured) return;
    const sb = getSupabase();
    if (!sb) return;

    const paint = (u: { is_anonymous?: boolean; user_metadata?: Record<string, unknown> } | null) => {
      // 로그인 후 원래 보던 페이지로 돌려보내기 위해 현재 경로를 달고 간다
      const back = window.location.pathname + window.location.search;
      const href = back && back !== "/login" ? `/login?next=${encodeURIComponent(back)}` : "/login";
      // 익명 세션은 '로그인한 것'으로 치지 않는다 — 아직 계정이 없는 상태다
      const label = !u || u.is_anonymous ? "로그인" : (u.user_metadata?.nickname as string) || "내 계정";
      setShown({ label, href });
    };

    sb.auth.getSession().then(({ data }) => paint(data.session?.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => paint(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!shown) return null;

  return (
    <Link
      href={shown.href}
      className="text-ink-faint hover:text-ink max-w-[9rem] truncate text-sm font-medium transition-colors"
    >
      {shown.label}
    </Link>
  );
}
