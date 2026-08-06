import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { SiteFooter } from "@/components/site-footer";
import { VideoCard } from "@/components/video-card";
import { filterServices, filterVideos, validateContent } from "@/lib/content";
import { INTERNAL_LINKS } from "@/lib/site-links";

export default function Home() {
  // 빌드 스크립트에서도 돌지만 렌더 경로에서도 한 번 더 막는다.
  // 깨진 참조를 그린 채로 배포되는 일이 없어야 한다.
  validateContent();

  // featured 우선 + 최신순은 filterServices 의 기본 정렬이다.
  const services = filterServices().slice(0, 4);
  const videos = filterVideos({ sort: "recent" }).slice(0, 3);

  return (
    <>
      <main className="flex-1">
        <Hero />

        <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
          <SectionHeading
            title="만든 서비스"
            href={INTERNAL_LINKS.services}
            meta={String(services.length)}
          />
          {services.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <li key={service.slug}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">아직 등록된 서비스가 없습니다.</p>
          )}
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
          <SectionHeading
            title="최근 영상"
            href={INTERNAL_LINKS.videos}
            meta={String(videos.length)}
          />
          {videos.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <li key={video.slug}>
                  <VideoCard video={video} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted text-sm">아직 등록된 영상이 없습니다.</p>
          )}
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
