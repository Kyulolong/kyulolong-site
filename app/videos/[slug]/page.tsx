import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { ServiceCard } from "@/components/service-card";
import { formatDate } from "@/components/video-card";
import { getRelatedServices, getVideo, getVideos } from "@/lib/content";
import { pageMetadata, shareableImage, summarize, videoJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getVideos().map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/videos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) return {};

  return pageMetadata({
    title: video.title,
    // 본문 첫 문단이 그 편의 요약이다. 없으면 시리즈·날짜로 떨어진다.
    description: summarize(video.body) ?? `${video.series} · ${formatDate(video.publishedAt)}`,
    path: `/videos/${video.slug}`,
    image: shareableImage(video.thumbnail),
    publishedAt: video.publishedAt,
  });
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
      {/* 영상 리치 결과의 조건은 제목·설명·업로드일·썸네일이다. 썸네일을 핫링크하지
          않고 public/videos 에 받아두는 이유가 여기서도 산다 — 인스타 CDN 주소는
          며칠 뒤 만료돼서 구조화 데이터가 조용히 깨진 주소를 가리키게 된다. */}
      <JsonLd data={videoJsonLd(video)} />

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
          {/* 회차는 시리즈 필터 링크 밖에 둔다. 링크가 가리키는 건 시리즈지 회차가 아니다. */}
          {video.episode ? (
            <span className="font-mono tabular-nums">ep{video.episode}</span>
          ) : null}
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
            {video.externalUrl || video.processUrl ? (
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {video.externalUrl ? (
                  <a
                    href={video.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
                  >
                    원본에서 보기
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
                {/* 릴스는 1분짜리 편집본이라 막힌 데가 전부 잘려 있다.
                    안 자른 게 따로 있다는 걸 여기서 한 번 말해준다. */}
                {video.processUrl ? (
                  <a
                    href={video.processUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
                  >
                    자르지 않은 작업 화면
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
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
