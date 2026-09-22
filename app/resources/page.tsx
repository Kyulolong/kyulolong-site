import type { Metadata } from "next";
import Link from "next/link";
import { GuideDownload } from "@/components/guide-download";
import { PageHeader } from "@/components/page-header";
import { CommunityInvitation } from "@/components/community-invitation";
import { pageMetadata } from "@/lib/seo";
import { FOUNDER_QUESTIONS, INTERNAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({ title: "자료실 · 내 일에 적용하는 질문과 가이드", description: "목표 설계 가이드와 창업 전에 생각할 질문을 무료로 나눕니다. 읽고, 적어보고, 실제 일에 적용해보세요.", path: "/resources" });

export default function ResourcesPage() {
  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
        <PageHeader eyebrow="resources" title="읽은 것을 내 일에 써보세요" description="목표를 정하고, 함께 일할 방식을 생각할 때 꺼내 쓸 질문과 가이드입니다. 모두 무료로 나눕니다." />
      </div>
      <GuideDownload />
      <div className="mx-auto mt-12 w-full max-w-[1120px] px-6 sm:px-8">
        <section className="border-line grid gap-6 border-t pt-10 sm:pt-12 md:grid-cols-[1.2fr_0.8fr] md:gap-14">
          <div>
            <p className="text-ink-faint font-mono text-xs">질문지 · PDF {FOUNDER_QUESTIONS.pages}장</p>
            <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">회사를 만들기 전 생각할 질문 열 개</h2>
            <p className="text-ink-soft mt-4 max-w-[38rem]">어떤 회사를 만들고 싶은지, 누구와 어떻게 일하고 싶은지. 자기 일을 시작하기 전에 생각을 적어볼 수 있는 질문지입니다.</p>
          </div>
          <div className="self-center">
            <a href={FOUNDER_QUESTIONS.href} target="_blank" rel="noreferrer noopener" className="border-line-strong hover:bg-surface-2 inline-flex min-h-12 items-center rounded-full border px-6 py-3 text-sm font-bold transition-colors" data-umami-event="founder-questions-open">질문지 바로 열기</a>
            <p className="text-ink-faint mt-3 text-sm">이메일 입력 없이 PDF가 열립니다.</p>
          </div>
        </section>
        <div className="mt-16 sm:mt-20"><CommunityInvitation /></div>
        <p className="text-ink-soft mt-10 text-sm">우리 팀의 일한 기록을 함께 살펴보고 싶다면 <Link href={INTERNAL_LINKS.proof} className="inline-flex min-h-11 items-center underline underline-offset-4">Proof 코칭 알아보기</Link></p>
      </div>
    </>
  );
}
