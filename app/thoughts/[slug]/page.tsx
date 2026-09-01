import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { LikeButton } from "@/components/like-button";
import { Prose } from "@/components/prose";
import { ThoughtComments } from "@/components/thought-comments";
import { formatDate } from "@/components/video-card";
import { getThought, getThoughts, readingMinutes } from "@/lib/content";
import { pageMetadata, shareableImage, summarize, thoughtJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getThoughts().map((thought) => ({ slug: thought.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/thoughts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) return {};

  return pageMetadata({
    title: thought.title,
    // summary 를 먼저 본다 — 손으로 쓴 한 줄이 본문 첫 문단보다 낫다.
    description: thought.summary ?? summarize(thought.body) ?? thought.title,
    path: `/thoughts/${thought.slug}`,
    image: shareableImage(thought.ogImage),
    publishedAt: thought.publishedAt,
  });
}

export default async function ThoughtPage({ params }: PageProps<"/thoughts/[slug]">) {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) notFound();

  return (
    <article className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <JsonLd data={thoughtJsonLd(thought)} />

      <div className="mx-auto max-w-[46rem]">
        {/* 화살표를 쓰는 유일한 예외 (DESIGN.md §6) — 문서 맨 위의 뒤로 가기다 */}
        <div className="pt-10">
          <Link
            href="/thoughts"
            className="text-ink-faint hover:text-ink inline-flex min-h-11 items-center gap-1.5 text-sm transition-colors"
          >
            <span aria-hidden="true">←</span> 생각들
          </Link>
        </div>

        <header className="pt-6">
          <div className="text-ink-faint flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Link
              href={`/thoughts?series=${encodeURIComponent(thought.series)}`}
              className="hover:text-ink transition-colors"
            >
              {thought.series}
            </Link>
            <span aria-hidden="true">·</span>
            <time dateTime={thought.publishedAt} className="font-mono tabular-nums">
              {formatDate(thought.publishedAt)}
            </time>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{readingMinutes(thought.body)}분</span>
          </div>

          <h1 className="mt-4 text-[clamp(1.75rem,4.5vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
            {thought.title}
          </h1>

          {thought.summary ? (
            <p className="text-ink-soft mt-5 text-lg text-pretty">{thought.summary}</p>
          ) : null}
        </header>

        <Prose body={thought.body} className="mt-12" />

        {/* 다 읽고 누르는 자리라 본문 바로 아래다. 서비스 상세의 CTA 옆 하트와
            같은 테두리 버튼 — 형광도 보라 면도 아니다 (DESIGN.md §2). */}
        <div className="mt-12">
          <LikeButton
            kind="thought"
            slug={thought.slug}
            className="border-line text-ink-faint hover:bg-surface-2 !gap-2 border !px-5 !py-3 !text-sm !rounded-full"
          />
        </div>

        {/*
          ⚠️ 여기에 서비스 카드를 다시 세우지 말 것 (2026-09-01 에 "글에서 나온 것"
          절을 지웠다). 글 끝에 자기 서비스 카드가 서는 순간 글이 그 서비스의
          광고로 읽혀서, 글의 진정성이 의심받는다. 인용이 필요하면 본문 문장
          안의 링크로 한다 — 문장에 걸린 링크는 인용이고, 절로 선 카드는 진열이다.
        */}

        {/*
          댓글은 페이지의 맨 끝이다 — 읽기가 끝난 자리. frontmatter 의
          `comments: false` 가 이 줄의 스위치라, 닫힌 글은 영역째로 안 그려진다.
          읽기·쓰기 전부 클라이언트라 이 페이지는 정적 그대로다 (CLAUDE.md 11번).
        */}
        {thought.comments ? <ThoughtComments slug={thought.slug} /> : null}
      </div>
    </article>
  );
}
