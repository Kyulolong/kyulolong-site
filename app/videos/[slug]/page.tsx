import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { ServiceCard } from "@/components/service-card";
import { formatDate } from "@/components/video-card";
import { getRelatedServices, getVideo, getVideos } from "@/lib/content";

export function generateStaticParams() {
  return getVideos().map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/videos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return {};
  return { title: video.title, description: `${video.series} · ${formatDate(video.publishedAt)}` };
}

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "인스타그램",
  youtube: "유튜브",
};

export default async function VideoPage({ params }: PageProps<"/videos/[slug]">) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();

  const relatedServices = getRelatedServices(video);

  return (
    <article className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <div className="pt-10">
        <Link
          href="/videos"
          className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <span aria-hidden="true">←</span> 만드는 과정
        </Link>
      </div>

      <header className="mx-auto max-w-[46rem] pt-8">
        <div className="text-ink-faint flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link
            href={`/videos?series=${encodeURIComponent(video.series)}`}
            className="hover:text-ink transition-colors"
          >
            {video.series}
          </Link>
          <span aria-hidden="true">·</span>
          <time dateTime={video.publishedAt} className="font-mono tabular-nums">
            {formatDate(video.publishedAt)}
          </time>
          {video.platform.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{video.platform.map((p) => PLATFORM_LABEL[p] ?? p).join(" / ")}</span>
            </>
          ) : null}
        </div>

        <h1 className="mt-4 text-[clamp(1.75rem,4.5vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
          {video.title}
        </h1>
      </header>

      <div className="mx-auto max-w-[46rem] pt-10">
        {video.embedUrl ? (
          /*
           * 비율은 frontmatter 의 orientation 이 정한다.
           * 릴스·쇼츠는 9:16 (폭은 화면이 좁아도 넘치지 않게 묶는다), 화면녹화는 16:9.
           */
          <>
            <div
              className={`bg-surface-2 mx-auto w-full overflow-hidden rounded-[24px] ${
                video.orientation === "landscape"
                  ? "aspect-video"
                  : "aspect-[9/16] max-w-[22rem]"
              }`}
            >
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="h-full w-full border-0"
              />
            </div>

            {/* 임베드가 막히거나 화면이 좁을 때를 위한 탈출구. 형광은 쓰지 않는다. */}
            {video.externalUrl ? (
              <p className="mt-4 text-center">
                <a
                  href={video.externalUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
                >
                  원본에서 보기
                  <span aria-hidden="true">↗</span>
                </a>
              </p>
            ) : null}
          </>
        ) : video.externalUrl ? (
          /* 임베드가 막힌 곳이라 새 탭으로 보낸다. 이 페이지의 형광 한 점. */
          <a
            href={video.externalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-paper-sky hover:shadow-lift flex flex-col items-center gap-5 rounded-[24px] px-8 py-16 text-center transition-shadow"
          >
            <span className="text-ink-soft text-sm">이 영상은 다른 곳에 올라가 있어요</span>
            <span className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors">
              영상 보러 가기
              <span aria-hidden="true">↗</span>
            </span>
          </a>
        ) : null}

        {video.body ? <Prose body={video.body} className="mt-12" /> : null}
      </div>

      {relatedServices.length > 0 ? (
        <section className="border-line mx-auto mt-16 max-w-[46rem] border-t pt-14">
          <h2 className="mb-8 text-xl font-bold tracking-[-0.02em]">이 영상에서 만든 것</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {relatedServices.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
