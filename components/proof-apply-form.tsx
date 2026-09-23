"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CONCERNS, PROOF_APPLY_LIMITS, TEAM_SIZES, TEAM_TYPES, TIMINGS } from "@/lib/proof-apply";
import { INTERNAL_LINKS, PROOF_INBOX_EMAIL } from "@/lib/site-links";

type FormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Proof 파일럿 참여 신청 폼 — /proof 맨 아래. 받는 건 팀 소개·고민·희망 시기뿐이다 (CLAUDE.md 10번).
 *
 * 보기를 고르는 칸이 넷이라 1분 안에 끝난다. 글로 적는 칸은 이름·이메일과 선택인 팀 이름·메모뿐.
 * 라디오·체크박스는 DESIGN.md §7 — 알약이 아니라 `--r-xs`, 형광도 보라 면도 없이 선택됨 =
 * `--surface-2` 면 + `--ink` 글씨. accent-color 도 `--ink-soft`.
 *
 * 폼 입력에 text-* 클래스를 붙이지 않는다 — 16px 를 상속받아야 iOS 가 포커스에서 확대하지 않는다 (§12).
 * 상태 흐름은 components/guide-download.tsx 와 같다. 실패해도 입력값은 그대로 둔다.
 */
const fieldClass =
  "border-line-strong bg-canvas text-ink placeholder:text-ink-faint w-full rounded-note border px-4 py-3 font-normal outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-iris)]";
const optionClass =
  "border-line has-[:checked]:bg-surface-2 has-[:checked]:border-line-strong hover:border-line-strong flex min-h-11 cursor-pointer items-start gap-3 rounded-badge border px-3.5 py-2.5 text-[0.9375rem] leading-snug transition-colors";
const controlClass = "mt-[3px] size-4 shrink-0 accent-[var(--color-ink-soft)]";

export function ProofApplyForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/proof/apply", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          team: data.get("team"),
          teamType: data.get("teamType"),
          teamSize: data.get("teamSize"),
          concerns: data.getAll("concerns"),
          timing: data.get("timing"),
          note: data.get("note"),
          privacyConsent: data.get("privacyConsent") === "on",
          company: data.get("company"),
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(result.message ?? "잠시 후 다시 시도해 주세요.");

      form.reset();
      setStatus("success");
      setMessage(result.message ?? "접수했습니다.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-surface border-line rounded-card border p-7 sm:p-10" role="status">
        <p className="text-ink-faint font-mono text-xs tracking-[0.08em]">접수 완료</p>
        <p className="mt-3 text-2xl font-bold tracking-[-0.02em]">신청을 접수했습니다.</p>
        <p className="text-ink-soft mt-4 leading-relaxed">{message}</p>
        <p className="text-ink-soft mt-2 leading-relaxed">남겨주신 팀 상황을 읽고 며칠 안에 이메일로 연락드립니다. 신청만으로 참여나 비용이 확정되지는 않습니다.</p>
        <p className="text-ink-soft mt-6 text-sm leading-relaxed">
          그동안 팀에서 먼저 써볼 자료는{" "}
          <Link href={INTERNAL_LINKS.resources} className="text-ink inline-flex min-h-11 items-center underline underline-offset-4">자료실</Link>
          에 있습니다.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="text-ink-soft hover:text-ink mt-4 min-h-11 text-sm underline underline-offset-4">
          다른 팀으로 한 번 더 신청하기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-surface border-line rounded-card border p-7 sm:p-10" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-bold">
          이름
          <input name="name" required maxLength={PROOF_APPLY_LIMITS.name} autoComplete="name" placeholder="홍길동" className={fieldClass} />
        </label>
        <label className="grid gap-2 text-sm font-bold">
          이메일
          <input name="email" type="email" required maxLength={PROOF_APPLY_LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@company.com" className={fieldClass} />
        </label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">
          <span>팀 · 기관 이름 <span className="text-ink-faint font-normal">(선택)</span></span>
          <input name="team" maxLength={PROOF_APPLY_LIMITS.team} autoComplete="organization" placeholder="없으면 비워두세요" className={fieldClass} />
        </label>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label>
          회사
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="mt-8">
        <legend className="text-sm font-bold">어떤 팀인가요</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TEAM_TYPES.map((option, index) => (
            <label key={option.value} className={optionClass}>
              <input type="radio" name="teamType" value={option.value} required={index === 0} className={controlClass} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-bold">인원</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TEAM_SIZES.map((option, index) => (
            <label key={option.value} className={optionClass}>
              <input type="radio" name="teamSize" value={option.value} required={index === 0} className={controlClass} />
              <span className="font-mono text-sm tabular-nums">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-bold">
          지금 막힌 장면 <span className="text-ink-faint font-normal">(하나 이상)</span>
        </legend>
        <div className="mt-3 grid gap-2">
          {CONCERNS.map((option) => (
            <label key={option.value} className={optionClass}>
              <input type="checkbox" name="concerns" value={option.value} className={controlClass} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-bold">참여를 생각하는 시기</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {TIMINGS.map((option, index) => (
            <label key={option.value} className={optionClass}>
              <input type="radio" name="timing" value={option.value} required={index === 0} className={controlClass} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-7 grid gap-2 text-sm font-bold">
        <span>한 줄 메모 <span className="text-ink-faint font-normal">(선택)</span></span>
        <textarea name="note" rows={3} maxLength={PROOF_APPLY_LIMITS.note} placeholder="팀에서 지금 벌어지는 일을 한두 문장으로. 업무 기록이나 개인 평가는 적지 않아도 됩니다." className={`${fieldClass} resize-y`} />
      </label>

      <label className="text-ink-soft mt-7 flex items-start gap-3 text-sm leading-relaxed">
        <input name="privacyConsent" type="checkbox" required className={`${controlClass} mt-1`} />
        <span>
          <strong className="text-ink">[필수]</strong> 파일럿 참여 안내와 연락을 위한 개인정보 수집·이용에 동의합니다.{" "}
          <Link href="/privacy#proof-apply" className="underline underline-offset-4">자세히 보기</Link>
        </span>
      </label>

      {status === "error" ? (
        <p className="text-happy-accident mt-5 text-sm leading-relaxed" role="alert">{message}</p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        /* 이 화면의 주인공 액션. 형광은 이 페이지에 없고 큰 보라는 위의 띠 하나라, 버튼은 iris (DESIGN.md §7). */
        className="bg-iris text-on-iris hover:bg-iris-press mt-8 inline-flex min-h-13 w-full items-center justify-center rounded-full px-6 py-3 font-bold transition-colors disabled:cursor-wait disabled:opacity-60"
        data-umami-event="proof-apply-submit"
      >
        {status === "submitting" ? "접수하는 중…" : "신청 남기기"}
      </button>
      <p className="text-ink-faint mt-4 text-center text-xs leading-relaxed">
        폼이 열리지 않으면 <a href={`mailto:${PROOF_INBOX_EMAIL}`} className="wrap-anywhere underline underline-offset-4">{PROOF_INBOX_EMAIL}</a>으로 보내주세요.
      </p>
    </form>
  );
}
