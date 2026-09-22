import type { Metadata } from "next";
import { BUSINESS_EMAIL } from "@/lib/site-links";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "개인정보 처리 안내",
  description: "규로롱 가이드 신청 과정에서 수집하는 개인정보와 이용 목적 안내입니다.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-[760px] px-6 py-16 sm:px-8 sm:py-24">
      <p className="text-iris-soft text-sm font-bold tracking-[0.08em]">개인정보 처리 안내</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">필요한 정보만 받습니다</h1>
      <p className="text-ink-soft mt-6 text-lg leading-relaxed">
        규로롱은 가이드를 보내고, 동의한 분께 관련 소식을 전하기 위해 성함과 이메일만 수집합니다.
      </p>

      <section id="guide-download" className="mt-14 scroll-mt-24">
        <h2 className="text-2xl font-bold">가이드 신청</h2>
        <dl className="border-line mt-6 grid border-t text-sm leading-relaxed">
          <div className="border-line grid gap-2 border-b py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-bold">수집 항목</dt><dd className="text-ink-soft">성함, 이메일</dd>
          </div>
          <div className="border-line grid gap-2 border-b py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-bold">필수 이용 목적</dt><dd className="text-ink-soft">요청한 가이드 발송과 발송 오류 대응</dd>
          </div>
          <div className="border-line grid gap-2 border-b py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-bold">선택 이용 목적</dt><dd className="text-ink-soft">Proof 코칭 및 새로운 가이드 안내</dd>
          </div>
          <div className="border-line grid gap-2 border-b py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-bold">보유 기간</dt><dd className="text-ink-soft">필수 정보는 발송일로부터 1년, 선택 동의 정보는 동의 철회 또는 마지막 안내 후 2년까지</dd>
          </div>
          <div className="border-line grid gap-2 border-b py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-bold">처리 위탁</dt><dd className="text-ink-soft">데이터 저장은 Supabase, 이메일 발송은 Resend를 이용합니다.</dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">동의 철회와 삭제 요청</h2>
        <p className="text-ink-soft mt-4 leading-relaxed">
          선택 동의 여부와 관계없이 가이드를 받을 수 있습니다. 정보 열람·정정·삭제 또는 수신 동의 철회는 {" "}
          <a className="text-ink underline underline-offset-4" href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>으로 요청해 주세요.
        </p>
      </section>

      <p className="text-ink-faint mt-14 text-sm">시행일 2026년 9월 22일</p>
    </article>
  );
}
