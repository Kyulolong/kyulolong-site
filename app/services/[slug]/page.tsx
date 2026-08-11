import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PromptBlock } from "@/components/prompt-block";
import { Prose } from "@/components/prose";
import { VideoCard } from "@/components/video-card";
import { getRelatedVideos, getService, getServices } from "@/lib/content";
import { pageMetadata, serviceJsonLd, shareableImage } from "@/lib/seo";

export function generateStaticParams() {
  return getServices().map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  /**
   * 설명은 tagline + 만든 시간이다. 목록에 60개가 쌓이면 검색 결과에서 서로
   * 구분되는 건 이 한 줄뿐이고, "2시간 만에" 는 이 채널에서 제일 눈에 띄는 사실이다.
   */
  const description = service.buildTime
    ? `${service.tagline} · ${service.buildTime} 만에 만들었고 소스코드와 프롬프트를 같이 열어뒀습니다.`
    : service.tagline;

  return pageMetadata({
    title: service.title,
    description,
    path: `/services/${service.slug}`,
    image: shareableImage(service.thumbnail),
    publishedAt: service.publishedAt,
  });
}

/**
 * 라벨 폭을 고정한 2열 그리드로 그린다. flex + wrap 으로 두면 값이 긴 줄만
 * 라벨 아래로 떨어져서, 어떤 줄은 라벨 옆에 어떤 줄은 아래에 붙는다.
 */
function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-line grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-4 border-b py-3.5 last:border-b-0">
      <dt className="text-ink-faint text-sm">{label}</dt>
      <dd className="text-[0.9375rem]">{children}</dd>
    </div>
  );
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const relatedVideos = getRelatedVideos(service);

  return (
    <article className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      {/* 아직 주소가 없는 것(status: soon)은 "쓸 수 있는 소프트웨어"가 아니라서 빼둔다.
          구조화 데이터에는 페이지에 실제로 있는 사실만 적는다 (lib/seo.ts). */}
      {service.status === "live" ? <JsonLd data={serviceJsonLd(service)} /> : null}

      <div className="pt-10">
        <Link
          href="/services"
          className="text-ink-faint hover:text-ink inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <span aria-hidden="true">←</span> 만든 서비스
        </Link>
      </div>

      {/* 제목이 이미지 아래에 있으면 큰 그림 하나를 지나야 여기가 뭔지 알 수 있다.
          이름을 먼저 대고, 그 다음에 그림을 보여준다. */}
      <header className="max-w-[46rem] pt-8">
        {service.seq ? (
          <p className="text-ink-faint font-mono text-sm tabular-nums">
            #{service.seq} · 혼자 만든 것
          </p>
        ) : null}
        <div className="mt-1 flex flex-wrap items-center gap-2.5">
          <h1 className="text-[clamp(2rem,5vw,2.75rem)] leading-[1.15] font-extrabold tracking-[-0.03em]">
            {service.title}
          </h1>
          {service.status === "soon" ? (
            <span className="bg-surface-2 text-ink-faint rounded-full px-2.5 py-1 text-xs font-medium">
              준비 중
            </span>
          ) : null}
          {service.team ? (
            <span className="bg-paper-sky text-ink-soft rounded-full px-2.5 py-1 text-xs font-medium">
              팀으로 만든 것
            </span>
          ) : null}
        </div>
        <p className="text-ink-soft mt-4 max-w-[46ch] text-lg text-pretty">{service.tagline}</p>
      </header>

      <div className="grid grid-cols-1 gap-x-16 gap-y-12 pt-10 pb-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          {service.thumbnail ? (
            <div className="bg-paper-lime relative aspect-[3/2] w-full overflow-hidden rounded-[24px]">
              <Image
                src={service.thumbnail}
                alt=""
                fill
                sizes="(min-width: 1024px) 46rem, 100vw"
                className="object-cover mix-blend-multiply"
                /* 이 페이지에서 LCP 후보가 이것 하나뿐이라 head 에 박아 미리 받는다.
                   목록의 카드들과 다른 처리인 이유는 Thumbnail 의 eager 주석에 있다. */
                preload
              />
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {service.status === "live" && service.url ? (
              /*
               * 이 페이지의 형광 한 점. 소개 페이지가 실제 서비스로 보내는 자리다 (스펙 3번).
               *
               * 여기만 <Link> 가 아니라 <a> 다. 목적지가 같은 오리진이긴 해도 Next 라우트가
               * 아니라 별개 앱이라서:
               *   1. <Link> 는 trailingSlash:false 규칙대로 href 의 끝 슬래시를 떼어낸다.
               *      `/navigator/` 가 `/navigator` 가 되면 그 앱의 상대경로 자산이 깨진다.
               *   2. prefetch 가 RSC 페이로드를 기대하고 남의 앱 HTML 을 받아온다 — 낭비다.
               */
              <a
                href={service.url}
                className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
              >
                지금 써보기
                <span aria-hidden="true">→</span>
              </a>
            ) : null}

            {service.github ? (
              <a
                href={service.github}
                target="_blank"
                rel="noreferrer noopener"
                className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                소스코드 보기
                <span aria-hidden="true">↗</span>
              </a>
            ) : null}
          </div>

          {service.status === "soon" ? (
            <p className="bg-paper-peach text-ink-soft mt-6 max-w-[46ch] rounded-[16px] px-5 py-4 text-sm">
              아직 열어드릴 수 있는 주소가 없어요. 준비되는 대로 여기에 버튼이 생깁니다.
            </p>
          ) : null}

          {service.needsAuth ? (
            <p className="text-ink-faint mt-6 text-sm">
              로그인 없이도 전부 볼 수 있어요. 로그인하면 저장한 것들이 다음에도 남아 있습니다.
            </p>
          ) : null}

          {service.body ? <Prose body={service.body} className="mt-12" /> : null}

          {service.prompt ? (
            <PromptBlock prompt={service.prompt} title={service.title} />
          ) : null}
        </div>

        <aside>
          <h2 className="text-ink-faint mb-1 font-mono text-xs tracking-[0.12em] uppercase">
            info
          </h2>
          <dl>
            <MetaRow label="공개">
              <time dateTime={service.publishedAt} className="font-mono tabular-nums">
                {service.publishedAt.replaceAll("-", ".")}
              </time>
            </MetaRow>
            {service.buildTime ? (
              <MetaRow label="만든 시간">
                <span className="font-mono tabular-nums">{service.buildTime}</span>
                <span className="text-ink-faint"> (첫 버전)</span>
              </MetaRow>
            ) : null}
            {service.team ? (
              <MetaRow label="만든 사람">팀 (혼자 만든 게 아닙니다)</MetaRow>
            ) : null}
            {service.url ? (
              <MetaRow label="주소">
                <span className="font-mono text-sm">{service.url}</span>
              </MetaRow>
            ) : null}
            {service.stack.length > 0 ? (
              <MetaRow label="만든 것">{service.stack.join(", ")}</MetaRow>
            ) : null}
            {service.tags.length > 0 ? (
              <MetaRow label="태그">
                <span className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/services?tag=${encodeURIComponent(tag)}`}
                      className="bg-surface-2 text-ink-soft hover:bg-line rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </span>
              </MetaRow>
            ) : null}
            <MetaRow label="소스">
              {service.github ? (
                <a
                  href={service.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hover:text-ink-soft underline underline-offset-4 transition-colors"
                >
                  공개
                </a>
              ) : (
                <span className="text-ink-faint">아직 정리 중</span>
              )}
            </MetaRow>
          </dl>
        </aside>
      </div>

      {relatedVideos.length > 0 ? (
        <section className="border-line mt-16 border-t pt-14">
          <h2 className="mb-8 text-xl font-bold tracking-[-0.02em]">만드는 과정</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedVideos.map((video) => (
              <li key={video.slug}>
                <VideoCard video={video} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
