import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { VideoCard } from "@/components/video-card";
import { filterServices, filterVideos, validateContent } from "@/lib/content";
import { SITE_DESCRIPTION, pageMetadata, siteJsonLd } from "@/lib/seo";
import { INSTAGRAM_URL, INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

/** 제목은 레이아웃의 기본값(SITE_TITLE)을 그대로 쓴다 — 랜딩이 곧 사이트다. */
export const metadata: Metadata = pageMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  // 빌드 스크립트에서도 돌지만 렌더 경로에서도 한 번 더 막는다.
  // 깨진 참조를 그린 채로 배포되는 일이 없어야 한다.
  validateContent();

  const allServices = filterServices();
  const allVideos = filterVideos({ sort: "recent" });

  // featured 우선 + 최신순은 filterServices 의 기본 정렬이다.
  const services = allServices.slice(0, 4);
  const videos = allVideos.slice(0, 3);

  return (
    <>
      {/* 검색엔진이 이 사이트와 사람을 하나로 묶어 읽게 한다.
          인스타·깃허브·퍼플즈를 sameAs 로 걸어야 세 채널이 한 사람으로 인식된다. */}
      <JsonLd data={siteJsonLd(SOCIAL_LINKS.map((link) => link.href))} />

      <Hero />

      <section className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:px-8 sm:py-20">
        <SectionHeading
          title="만든 서비스"
          description="쓰다가 불편했던 걸 하나씩 만들었습니다. 전부 로그인 없이 바로 열립니다."
          href={INTERNAL_LINKS.services}
          meta={String(allServices.length)}
        />
        {services.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* 히어로 바로 아래 2열 그리드 — 첫 행 두 장이 LCP 후보다 */}
            {services.map((service, i) => (
              <li key={service.slug}>
                <ServiceCard service={service} eager={i < 2} />
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
              0부터 시작하지 마세요
            </h2>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              코드는 이제 AI가 짜줍니다. 그래서 어려운 건 만드는 일이 아니라
              <strong className="text-ink font-semibold"> 뭘 만들지 정하는 일</strong>입니다.
              그건 아직 사람 몫이고, 솔직히 제일 재미있는 부분이기도 합니다.
            </p>
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              그래서 만든 것마다 소스코드와 <strong className="text-ink font-semibold">쓴 프롬프트를 통째로</strong> 열어뒀습니다.
              빈 화면 앞에서 시작하지 마시고, 여기서 하나 집어다 당신 것으로 바꾸세요.
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
          description="저는 가르치는 사람이 아닙니다. 만드는 과정을 공유합니다."
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

      {/* 다음에 뭘 만들지를 방문자에게 넘기는 자리. 팔로우할 이유이자 다시 올
          이유라서 /about 배너보다 위에 둔다. 형광은 히어로가 이미 가져갔으므로
          여기 버튼은 잉크로 세운다 (DESIGN.md §2). */}
      <section className="mx-auto w-full max-w-[1120px] px-6 py-4 sm:px-8">
        <div className="bg-paper-lime rounded-[28px] px-8 py-14 sm:px-14 sm:py-20">
          <div className="max-w-[42rem]">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
              만들어줬으면 하는 거 있으세요?
            </h2>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              인스타 DM으로 보내주세요. 기획서일 필요 없고 한 줄이면 됩니다.
              &ldquo;이런 게 있으면 좋겠는데&rdquo; 정도로 충분해요.
            </p>
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              만들 만하면 만들고, 만드는 과정을 그대로 올립니다. 아이디어 주신 분은
              원하시면 같이 올려드립니다. 혼자 60개를 짜내는 것보다 이쪽이 훨씬 나은 게
              나올 것 같아서요.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-ink text-canvas mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-85"
            >
              인스타 DM으로 보내기
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-6 py-4 sm:px-8">
        <div className="border-line flex flex-wrap items-center justify-between gap-6 rounded-[28px] border px-8 py-10 sm:px-12">
          <div>
            <h2 className="text-xl font-bold tracking-[-0.02em]">
              인사담당자가 어떻게 여기까지 왔나
            </h2>
            {/* 두 문장을 같은 축(못했다)으로 묶는다. 앞뒤 주제가 갈리면
                예고편이 아니라 두 개의 짧은 알림처럼 읽힌다. */}
            <p className="text-ink-soft mt-2 max-w-[38rem]">
              대기업에서 인사 시스템을 기획했지만 코드는 한 줄도 못 짰습니다.
              1년 전까지도 에러가 뜨면 읽지 못하고 통째로 복사해서 AI한테 붙여넣었고요.
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
