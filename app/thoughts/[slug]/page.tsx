import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { ServiceCard } from "@/components/service-card";
import { formatDate } from "@/components/video-card";
import {
  getRelatedServices,
  getThought,
  getThoughts,
  readingMinutes,
} from "@/lib/content";
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

  const relatedServices = getRelatedServices(thought);

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

        {/*
          글이 인용한 서비스. 단방향이라 서비스 쪽에는 이 글로 오는 링크가 없다
          (lib/content/validate.ts 주석). 글에서 이름만 나온 것을 실물로 받아주는
          자리라, 없으면 줄째로 빠진다.
        */}
        {relatedServices.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-xl font-bold tracking-[-0.02em]">글에서 나온 것</h2>
            <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {relatedServices.map((service) => (
                <li key={service.slug}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
