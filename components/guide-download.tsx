"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { GuideCover } from "@/components/guide-paper";
import { GOAL_GUIDE, INTERNAL_LINKS, KAKAO_OPENCHAT } from "@/lib/site-links";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function GuideDownload() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/guides/goal-design", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          privacyConsent: data.get("privacyConsent") === "on",
          marketingConsent: data.get("marketingConsent") === "on",
          company: data.get("company"),
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) throw new Error(result.message ?? "잠시 후 다시 시도해 주세요.");

      form.reset();
      setStatus("success");
      setMessage(result.message ?? "입력한 이메일로 가이드를 보냈습니다.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <section id="goal-guide" className="mx-auto w-full max-w-[1120px] scroll-mt-24 px-6 py-8 sm:px-8 sm:py-12">
      <div className="bg-iris-wash border-line rounded-card grid overflow-hidden border lg:grid-cols-[1.1fr_0.9fr]">
        <div className="px-7 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* 표지에 박힌 시리즈 이름과 권 번호 — 홈의 가이드 절과 같은 줄 */}
          <p className="text-ink-faint font-mono text-xs tracking-[0.08em]">{GOAL_GUIDE.series} · {GOAL_GUIDE.volume}</p>
          <h2 className="mt-4 max-w-[11em] text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] font-extrabold tracking-[-0.04em]">
            목표가 실행으로 이어지게 만드는 법
          </h2>
          <p className="text-ink-soft mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty">
            좋은 목표의 조건부터 KPI·OKR·MBO의 차이, 세운 뒤의 운영까지 정리했습니다.
            팀의 목표를 세우거나 다시 점검할 때 꺼내 쓰세요.
          </p>
          {/* 홈의 종이(components/guide-paper.tsx)와 같은 표지 — 같은 물건임을 잇는다.
              차례는 상자도 체크 표시도 없이 줄로만. 장 수는 기록 줄이 말한다 (DESIGN.md §5). */}
          <div className="mt-8 flex items-start gap-6">
            <GuideCover width={104} />
            <div className="min-w-0">
              <p className="text-ink-faint font-mono text-xs tabular-nums">PDF · {GOAL_GUIDE.pages}장</p>
              <ul className="text-ink-soft mt-3 space-y-1.5 text-sm leading-relaxed">
                <li>목표 설계의 기준과 점검 질문</li>
                <li>KPI·OKR·MBO 의 차이와 예시</li>
                <li>세운 뒤의 운영 원칙</li>
                <li>바로 쓰는 체크리스트</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-line bg-canvas border-t px-7 py-10 sm:px-10 sm:py-14 lg:border-t-0 lg:border-l lg:px-12 lg:py-16">
          <p className="text-xl font-bold">이메일로 받아보기</p>
          <p className="text-ink-faint mt-2 text-sm">이름과 이메일만 남기면 바로 보내드립니다.</p>

          {status === "success" ? (
            <div className="border-line bg-surface-2 mt-8 rounded-2xl border p-6" role="status">
              <p className="font-bold">발송을 마쳤습니다.</p>
              <p className="text-ink-soft mt-2 text-sm leading-relaxed">{message}</p>
              <p className="text-ink-soft mt-5 text-sm leading-relaxed">읽다가 생긴 질문은 오픈채팅에서 나눠주세요. 입장코드는 {KAKAO_OPENCHAT.code}입니다.</p>
              <a href={KAKAO_OPENCHAT.href} target="_blank" rel="noreferrer noopener" className="text-ink mt-2 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4" data-umami-event="guide-community-open">가이드에 관해 이야기 나누기</a>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="text-ink-soft hover:text-ink mt-5 min-h-11 text-sm underline underline-offset-4"
              >
                다른 이메일로 받기
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8">
              <div className="grid gap-5">
                <label className="grid gap-2 text-sm font-bold">
                  이름
                  <input
                    name="name"
                    required
                    minLength={1}
                    maxLength={40}
                    autoComplete="name"
                    placeholder="홍길동"
                    className="border-line-strong bg-canvas text-ink placeholder:text-ink-faint min-h-13 rounded-xl border px-4 py-3 text-base font-normal outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-iris)]"
                  />
                </label>
                <label className="grid gap-2 text-sm font-bold">
                  이메일
                  <input
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    inputMode="email"
                    placeholder="name@company.com"
                    className="border-line-strong bg-canvas text-ink placeholder:text-ink-faint min-h-13 rounded-xl border px-4 py-3 text-base font-normal outline-none transition-shadow focus:ring-2 focus:ring-[var(--color-iris)]"
                  />
                </label>
              </div>

              <div className="sr-only" aria-hidden="true">
                <label>
                  회사
                  <input name="company" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="text-ink-soft mt-6 grid gap-4 text-sm leading-relaxed">
                <label className="flex items-start gap-3">
                  <input name="privacyConsent" type="checkbox" required className="mt-1 size-4 shrink-0 accent-[var(--color-iris)]" />
                  <span>
                    <strong className="text-ink">[필수]</strong> 가이드 발송을 위한 개인정보
                    수집·이용에 동의합니다. {" "}
                    <Link href="/privacy#guide-download" className="underline underline-offset-4">
                      자세히 보기
                    </Link>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input name="marketingConsent" type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--color-iris)]" />
                  <span>
                    <strong className="text-ink">[선택]</strong> Proof 코칭과 다음 가이드 소식을
                    이메일로 받겠습니다.
                  </span>
                </label>
              </div>

              {status === "error" ? (
                <p className="text-happy-accident mt-5 text-sm" role="alert">{message}</p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                /* 이 화면의 주인공 액션이라 Primary(iris)다 (DESIGN.md §7). 형광은 이
                   화면에 없어서 iris 가 그 자리다. */
                className="bg-iris text-on-iris hover:bg-iris-press mt-7 inline-flex min-h-13 w-full items-center justify-center rounded-full px-6 py-3 font-bold transition-colors disabled:cursor-wait disabled:opacity-60"
              >
                {status === "submitting" ? "보내는 중…" : "이메일로 받기"}
              </button>
              <p className="text-ink-faint mt-3 text-center text-xs">광고성 안내는 선택 동의한 경우에만 보냅니다.</p>
              <p className="text-ink-faint mt-4 text-center text-xs leading-relaxed">Proof는 일한 기록을 함께 살펴보는 팀 코칭입니다. <Link href={INTERNAL_LINKS.proof} className="inline-flex min-h-11 items-center underline underline-offset-4">진행 방식 알아보기</Link></p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
