"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * 브라우저 전용 Supabase 클라이언트 (CLAUDE.md 11번).
 *
 * 서버 컴포넌트에서 부르지 말 것. 세션을 서버에서 확인하는 순간 15개 페이지가
 * 전부 정적 생성에서 빠지고, Supabase 가 흔들리면 대문까지 같이 죽는다.
 * 로그인이 필요한 건 /login 하나이고, 로그인 '상태'는 여기서 읽어서 그린다.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 환경변수가 없으면 null 을 준다.
 *
 * 던지지 않는 이유: 홈페이지는 로그인 없이 완전히 열려야 하고(스펙 3번),
 * 키가 아직 없다고 빌드가 깨지거나 랜딩이 죽으면 그 논지가 무너진다.
 * 부르는 쪽이 null 을 받으면 "아직 준비 중"을 그린다.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (client) return client;

  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      /**
       * kyulolong.com/* 가 전부 같은 오리진이라 localStorage 를 공유한다.
       * 이 키를 모든 서비스가 똑같이 써야 한 번 로그인한 게 전부에 걸린다 —
       * 기본값은 프로젝트마다 다른 키라서, 안 맞추면 같은 오리진인데도
       * 서비스마다 따로 로그인하게 된다. 바꾸지 말 것.
       */
      storageKey: "kyulolong.auth",
    },
  });
  return client;
}

/** 설정이 들어와 있는지. UI 를 감출지 말지 판단할 때 쓴다. */
export const isAuthConfigured = Boolean(url && anon);
