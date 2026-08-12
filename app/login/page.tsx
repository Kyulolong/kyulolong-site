"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { getSupabase, isAuthConfigured } from "@/lib/supabase";

/**
 * 모든 서비스가 공유하는 로그인 창구 (CLAUDE.md 11번).
 *
 * 이 페이지만 Supabase 를 부른다. 나머지 페이지는 MDX 만 읽고 DB 를 모른다 —
 * Supabase 가 죽어도 여기 한 장만 안 되고 사이트는 산다.
 *
 * 세션은 kyulolong.com 전체가 공유하는 localStorage 에 저장되므로,
 * 여기서 로그인하면 /wave-sound·/navigator 가 그대로 알아본다.
 * 서비스끼리 토큰을 넘기는 코드는 필요 없다.
 */

type Mode = "signin" | "signup";

/**
 * 어디서 왔는지. 로그인 끝나면 그리로 돌려보낸다.
 *
 * 상태로 들고 있지 않고 필요한 순간에 읽는다. effect 에서 setState 를 하면
 * 렌더가 한 번 더 돌고, 그 값이 필요한 시점은 '누른 다음'뿐이라 들고 있을 이유가 없다.
 */
function readReturnTo(): string {
  if (typeof window === "undefined") return "/";
  const raw = new URLSearchParams(window.location.search).get("next");
  /**
   * 같은 오리진의 경로만 받는다. "//evil.com" 이나 "https://evil.com" 을
   * 그대로 넣으면 우리 로그인 화면이 남의 사이트로 보내는 발판이 된다.
   */
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
}

export default function LoginPage() {
  const sb = getSupabase();

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState("");

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    if (!email.trim()) return setHint("이메일만 적어주시면 돼요.");
    if (password.length < 6) return setHint("비밀번호는 6자 이상이면 돼요.");

    setBusy(true);
    setHint(mode === "signin" ? "들어가는 중…" : "계정을 만드는 중…");
    try {
      if (mode === "signin") {
        const { error } = await sb.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await sb.auth.getSession();
        if (error) throw error;
        const nick = nickname.trim();
        if (data.session?.user.is_anonymous) {
          /**
           * 서비스에서 익명으로 쓰다가 넘어온 사람이다. updateUser 로 '승격'시킨다.
           * 여기서 signUp 을 부르면 계정이 새로 생겨서, 익명일 때 저장해둔 것이
           * 통째로 고아가 된다.
           */
          const { error: upErr } = await sb.auth.updateUser({
            email: email.trim(),
            password,
            ...(nick ? { data: { nickname: nick } } : {}),
          });
          if (upErr) throw upErr;
        } else {
          const { error: suErr } = await sb.auth.signUp({
            email: email.trim(),
            password,
            options: { data: nick ? { nickname: nick } : {} },
          });
          if (suErr) throw suErr;
        }
      }
      window.location.href = readReturnTo();
    } catch (err) {
      const m = (err instanceof Error ? err.message : "").toLowerCase();
      // 다그치지 않는다 — 무슨 일인지와 어떻게 하면 되는지만 (DESIGN.md §9)
      if (m.includes("already") || m.includes("registered") || m.includes("exists")) {
        setHint("이미 쓰고 계신 이메일이에요. 아래에서 로그인으로 바꿔보세요.");
      } else if (m.includes("invalid") || m.includes("credentials")) {
        setHint("이메일이나 비밀번호가 맞지 않아요. 한 번만 더 확인해 주세요.");
      } else {
        setHint("지금은 연결이 안 되네요. 잠시 뒤 다시 눌러보세요.");
      }
      setBusy(false);
    }
  }

  const shell = "mx-auto w-full max-w-[26rem] px-6 py-20 sm:py-28";

  if (!isAuthConfigured) {
    return (
      <div className={shell}>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">로그인</h1>
        <p className="bg-paper-peach text-ink-soft mt-6 rounded-[16px] px-5 py-4 text-sm">
          계정 기능을 아직 연결하는 중이에요. 로그인 없이도 모든 서비스는 그대로
          쓰실 수 있습니다.
        </p>
        <Link href="/services" className="text-ink mt-6 inline-block text-sm underline underline-offset-4">
          만든 서비스 보러 가기
        </Link>
      </div>
    );
  }

  if (!ready) return <div className={shell} aria-busy="true" />;

  if (user && !user.is_anonymous) {
    return (
      <div className={shell}>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">
          {(user.user_metadata?.nickname as string) || "이미 로그인되어 있어요"}
        </h1>
        <p className="text-ink-soft mt-4 text-sm">{user.email}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              window.location.href = readReturnTo();
            }}
            className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
          >
            돌아가기
          </button>
          <button
            onClick={async () => {
              await sb?.auth.signOut();
              setUser(null);
            }}
            className="border-line-strong text-ink hover:bg-surface-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
          >
            로그아웃
          </button>
        </div>
        <p className="text-ink-faint mt-8 text-xs">
          저장한 것들은 로그아웃해도 남아 있어요. 다시 로그인하면 그대로 따라옵니다.
        </p>
      </div>
    );
  }

  const creating = mode === "signup";

  return (
    <div className={shell}>
      <h1 className="text-3xl font-extrabold tracking-[-0.03em] text-balance">
        {creating ? "규로롱 계정 만들기" : "규로롱 계정으로 로그인"}
      </h1>
      <p className="text-ink-soft mt-4 text-[0.9375rem]">
        한 번 로그인하면 규로롱의 모든 서비스에서 그대로 이어집니다.
        <br />
        <strong className="text-ink font-semibold">로그인은 선택이에요</strong> — 안 해도 전부 쓸 수 있고,
        하면 저장한 것들이 기기를 옮겨도 따라옵니다.
      </p>

      <form onSubmit={submit} className="mt-9 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-ink-faint text-[13px]">이메일</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface-2 border-line-strong focus:border-ink rounded-[14px] border px-4 py-3 outline-none"
            placeholder="you@example.com"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-ink-faint text-[13px]">
            비밀번호 <span className="opacity-70">6자 이상</span>
          </span>
          <input
            type="password"
            autoComplete={creating ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-2 border-line-strong focus:border-ink rounded-[14px] border px-4 py-3 outline-none"
          />
        </label>

        {/* SMTP 를 붙이기 전까지는 재설정 메일을 못 보낸다. 되돌릴 수 없는 건 미리 말한다. */}
        {creating ? (
          <p className="text-ink-soft -mt-1 text-[13px] leading-relaxed">
            지금은 비밀번호를 잊으면 되돌릴 수 없어요. 재설정 메일을 아직 못 보내거든요 —
            어딘가 적어두시면 안심이에요.
          </p>
        ) : null}

        {creating ? (
          <label className="flex flex-col gap-1.5">
            <span className="text-ink-faint text-[13px]">
              닉네임 <span className="opacity-70">선택 · 규로롱에서 이 이름으로 보여드려요</span>
            </span>
            <input
              type="text"
              maxLength={20}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="bg-surface-2 border-line-strong focus:border-ink rounded-[14px] border px-4 py-3 outline-none"
              placeholder="예: 규로롱"
            />
            <span className="text-ink-faint text-[13px]">
              <a
                href="https://perplz.com"
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-4"
              >
                퍼플즈
              </a>
              를 쓰신다면 같은 닉네임으로 넣어주세요. 알아보기 좋아요.
            </span>
          </label>
        ) : null}

        {/* 이 화면의 형광 한 점 */}
        <button
          type="submit"
          disabled={busy}
          className="bg-acid text-on-acid hover:bg-acid-press mt-2 rounded-full px-6 py-3.5 text-[0.9375rem] font-bold transition-colors disabled:opacity-60"
        >
          {creating ? "계정 만들기" : "로그인"}
        </button>

        {hint ? <p className="text-ink-soft text-center text-[13px]">{hint}</p> : null}

        <button
          type="button"
          onClick={() => {
            setMode(creating ? "signin" : "signup");
            setHint("");
          }}
          className="text-ink-soft hover:text-ink mx-auto text-[13px] underline underline-offset-4 transition-colors"
        >
          {creating ? "이미 계정이 있어요 · 로그인" : "처음이신가요 · 계정 만들기"}
        </button>
      </form>
    </div>
  );
}
