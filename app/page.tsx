import Link from "next/link";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { VideoCard } from "@/components/video-card";
import { filterServices, filterVideos, validateContent } from "@/lib/content";
import { INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export default function Home() {
  // 빌드 스크립트에서도 돌지만 렌더 경로에서도 한 번 더 막는다.
  // 깨진 참조를 그린 채로 배포되는 일이 없어야 한다.
  validateContent();

  const allServices = filterServices();
  const allVideos = filterVideos({ sort: "recent" });

  // featured 우선 + 최신순은 filterServices 의 기본 정렬이다.
  const services = allServices.slice(0, 4);
  const videos = allVideos.slice(0, 3);

  // "만든 서비스"로 쓰면 아래 섹션 제목의 개수(준비 중 포함)와 숫자가 어긋나 보인다.
  // 여기 숫자는 '지금 열리는 것'만 센다.
  const stats = [
    { label: "지금 쓸 수 있는 서비스", value: allServices.filter((s) => s.status === "live").length },
    { label: "열어둔 소스", value: allServices.filter((s) => s.github).length },
    { label: "남긴 영상", value: allVideos.length },
  ];

  return (
    <>
      <Hero stats={stats} />

      <section className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          title="만든 서비스"
          description="쓰다가 불편했던 걸 하나씩 만들었습니다. 전부 로그인 없이 바로 열립니다."
          href={INTERNAL_LINKS.services}
          meta={String(allServices.length)}
        />
        {services.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-faint text-sm">아직 등록된 서비스가 없습니다.</p>
        )}
      </section>

      {/* DESIGN.md §8: 파스텔 블록으로 섹션 리듬을 준다. 형광은 히어로에 이미 썼으므로 여기엔 없다. */}
      <section className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
        <div className="bg-paper-sand rounded-[28px] px-8 py-14 sm:px-14 sm:py-20">
          <div className="max-w-[42rem]">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
              가져다 마음껏 만드세요
            </h2>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              소스코드를 여는 건 홍보가 아니라 논지입니다. 개발을 안 배운 사람도
              이만큼은 만들 수 있다는 걸, 말로 하는 것보다 코드를 그냥 보여주는 게 빠릅니다.
              마음에 드는 게 있으면 통째로 복사해 가셔도 됩니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bg-canvas text-ink hover:bg-surface-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          title="만드는 과정"
          description="완성본만 올리면 '역시 되는 사람은 되네'로 끝납니다. 막힌 데도 같이 남깁니다."
          href={INTERNAL_LINKS.videos}
          meta={String(allVideos.length)}
        />
        {videos.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <li key={video.slug}>
                <VideoCard video={video} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-faint text-sm">아직 등록된 영상이 없습니다.</p>
        )}
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
        <div className="border-line flex flex-wrap items-center justify-between gap-6 rounded-[28px] border px-8 py-10 sm:px-12">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">
              인사담당자가 왜 서비스를 만드나
            </h2>
            <p className="text-ink-soft mt-2 max-w-[38rem]">
              열 몇 해 동안 사람 뽑는 일을 했습니다. 그 이야기는 따로 적어뒀습니다.
            </p>
          </div>
          <Link
            href={INTERNAL_LINKS.about}
            className="border-line-strong text-ink hover:bg-surface-2 inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            읽어보기
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
