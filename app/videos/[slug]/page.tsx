import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { LikeButton } from "@/components/like-button";
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

/**
 * 퍼플즈 싱크 주소를 임베드 주소로 바꾼다.
 *
 *   https://perplz.com/sync/<id>  →  https://perplz.com/embed/sync/<id>
 *
 * frontmatter 에 임베드 주소를 따로 적게 하지 않는 이유는, 같은 영상의 주소를
 * 두 줄로 들고 있으면 언젠가 한쪽만 고치기 때문이다. 사람이 복사해 오는 건
 * 주소창에 보이는 쪽 하나이면 된다.
 *
 * 규칙에 안 맞는 주소(퍼플즈가 아니거나 형식이 바뀐 것)는 undefined 로 떨어져서
 * 링크만 남는다 — 임베드가 안 되는 게 페이지가 깨질 이유는 아니다.
 */
function perplzEmbedUrl(processUrl?: string): string | undefined {
  const id = processUrl?.match(/^https:\/\/perplz\.com\/sync\/([\w-]+)\/?$/)?.[1];
  return id ? `https://perplz.com/embed/sync/${id}` : undefined;
}

export default async function VideoPage({ params }: PageProps<"/videos/[slug]">) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();

  const relatedServices = getRelatedServices(video);
  const processEmbed = perplzEmbedUrl(video.processUrl);

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

            {/* 임베드가 막히거나 화면이 좁을 때를 위한 탈출구. 형광은 쓰지 않는다.
                작업 원본은 아래에서 통째로 심으므로 여기 링크로 두지 않는다. */}
            {video.externalUrl ? (
              <p className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
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

        {/* 영상을 보고 나서 누르는 자리. 임베드가 있든(릴스 아래) 없든(CTA 아래)
            같은 자리에 오도록 조건 밖에 둔다. */}
        <p className="mt-5 flex justify-center">
          <LikeButton
            kind="video"
            slug={video.slug}
            className="border-line text-ink-faint hover:bg-surface-2 !gap-2 border !px-4 !py-2 !text-[13px]"
          />
        </p>

        {/*
          작업 과정 (퍼플즈 싱크).

          릴스가 1분이라 막힌 데는 거의 다 잘려 나간다. 그걸 보여주는 판이 따로
          있다는 게 이 채널이 다른 계정과 갈리는 지점이라(CLAUDE.md 6번), 작은
          링크 한 줄로 두면 있는 줄도 모르고 지나간다. 제목을 달아 통째로 심는다.

          "자르지 않은" 이라고 쓰지 않는다. 이쪽도 컷 편집을 거친다 —
          지루한 데를 들어내는 건 원본이 아니라는 뜻이 아니지만, 문구가 사실보다
          한 걸음 앞서 나가면 그걸 확인한 사람에게는 그게 더 크게 남는다.

          릴스 아래에 두는 이유: 릴스를 보고 넘어온 사람의 흐름이 먼저다.
          화면녹화라 비율은 늘 16:9 로, frontmatter 의 orientation(릴스 쪽 값)을
          따라가지 않는다.
        */}
        {video.processUrl ? (
          <section className="border-line mt-14 border-t pt-12">
            <h2 className="text-xl font-bold tracking-[-0.02em]">작업 과정</h2>
            <p className="text-ink-soft mt-2 text-[0.9375rem]">
              작업과정을 담았습니다. 이렇게 작업해도 되는구나 용기를 얻어가시면 좋겠습니다 :)
              (부끄러우니깐 2배속을 추천드려요)
            </p>

            {processEmbed ? (
              <div className="bg-surface-2 mt-6 aspect-video w-full overflow-hidden rounded-[24px]">
                <iframe
                  src={processEmbed}
                  title={`${video.title} — 작업 과정`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
            ) : null}

            <p className="mt-4">
              <a
                href={video.processUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
              >
                퍼플즈에서 보기
                <span aria-hidden="true">↗</span>
              </a>
            </p>
          </section>
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
