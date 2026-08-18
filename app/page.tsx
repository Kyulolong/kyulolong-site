import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { VideoCard } from "@/components/video-card";
import { filterServices, filterVideos, validateContent } from "@/lib/content";
import { getLikeCounts, orderServicesForHome, orderVideosForHome } from "@/lib/likes";
import { SITE_DESCRIPTION, pageMetadata, siteJsonLd } from "@/lib/seo";
import { INSTAGRAM_URL, INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

/** 제목은 레이아웃의 기본값(SITE_TITLE)을 그대로 쓴다 — 랜딩이 곧 사이트다. */
export const metadata: Metadata = pageMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
});

/**
 * 하루에 한 번만 다시 굽는다.
 *
 * 이 페이지는 사이트에서 유일하게 서버가 Supabase 를 부르는 자리다 —
 * 카드 순서를 좋아요로 정하려면 렌더 시점에 숫자를 알아야 해서다.
 * DB 를 홈페이지의 필수 경로에 넣지 않는다는 규칙(CLAUDE.md 11번)을
 * 아래 셋으로 지킨다.
 *
 *   1. 방문자 요청은 DB 를 건드리지 않는다. 미리 구워둔 HTML 이 그대로 나간다.
 *   2. Supabase 가 죽어 있으면 getLikeCounts 가 빈 값을 주고, 순서는 원래
 *      기본 정렬(추천 우선 + 최신순)로 떨어진다. 대문은 산다.
 *   3. 다시 굽다 실패해도 Next 는 직전에 구운 페이지를 계속 내보낸다.
 *
 * 하루면 충분한 이유: 좋아요는 카드의 숫자로 즉시 보인다(클라이언트가 따로
 * 읽는다). 여기서 정하는 건 '순서' 하나뿐이고, 그게 몇 시간 늦게 반영되는 걸
 * 알아채는 사람은 없다.
 */
export const revalidate = 86400;
const DAY = 86400;

export default async function Home() {
  // 빌드 스크립트에서도 돌지만 렌더 경로에서도 한 번 더 막는다.
  // 깨진 참조를 그린 채로 배포되는 일이 없어야 한다.
  validateContent();

  const allServices = filterServices();
  const allVideos = filterVideos({ sort: "recent" });

  // 서비스도 영상도 첫 자리는 최신 것 고정, 나머지는 좋아요순 (lib/likes.ts).
  const likes = await getLikeCounts(DAY);
  const services = orderServicesForHome(allServices, likes.service).slice(0, 4);
  const videos = orderVideosForHome(allVideos, likes.video).slice(0, 3);

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
                <ServiceCard service={service} eager={i < 2} likes={likes.service[service.slug]} />
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
              <strong className="text-ink font-semibold"> 시작하는 것 그 자체</strong>입니다.
            </p>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              이 홈페이지는 시작이 어려운 분들을 위해 만들었습니다.
            </p>
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              그래서 만든 서비스마다 소스코드, 프롬프트와 <strong className="text-ink font-semibold">작업과정을 통째로</strong> 열어뒀습니다.
              빈 화면 앞에서 시작하지 마시고, 여기서 해봄직한 것 가져다 필요한 것으로 바꾸세요.
            </p>
            {/* "가져다 쓰세요"만 말하면 뭘 깔아야 하는지 모르는 사람이 여기서 멈춘다.
                그 한 문장을 붙여야 아래 버튼이 갑자기 나오지 않는다. */}
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              프롬프트를 어디에 붙여넣어야 할지 모르시겠다면, 뭘 깔고 어떻게 시작하는지
              순서대로 적어뒀습니다. 터미널을 한 번도 안 열어보셨어도 됩니다.
            </p>
            {/* 형광이 아니라 잉크다 — 이 화면의 형광 한 점은 히어로 버튼이다 (DESIGN.md §2).
                소셜 알약(bg-canvas)과 위계가 갈려야 해서 잉크 알약이 위, 알약 셋이 아래다. */}
            <div className="mt-8">
              <Link
                href={INTERNAL_LINKS.start}
                className="bg-ink text-canvas inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-85"
              >
                처음이라면: 설치부터 따라 하기
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="bg-canvas text-ink hover:bg-surface-2 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  {link.label}
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
                <VideoCard video={video} likes={likes.video[video.slug]} />
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
              만들어보고 싶은 게 있으세요?
            </h2>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              인스타 DM으로 보내주세요. 기획서일 필요 없고 한 줄이면 됩니다. 만들고 싶은 이유도 알려주신다면 더 좋겠죠.
              &ldquo;이런 게 있으면 좋겠는데&rdquo; 정도로 충분해요.
            </p>
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              최대한 만들어 보겠습니다. 만드는 과정을 공유합니다. 아이디어 보낸 분은
              거기서부터 작업을 시작하세요. 저도 혼자 아이디어를 떠올리기 보다 요청을 받아 만드는 것이
              결과가 더 좋습니다.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="bg-ink text-canvas mt-8 inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-85"
            >
              인스타 DM으로 보내기
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
              얼마 전까지도 에러가 뜨면 읽지 못하고 통째로 복사해서 AI한테 붙여넣었고요.
            </p>
          </div>
          <Link
            href={INTERNAL_LINKS.about}
            className="border-line-strong text-ink hover:bg-surface-2 inline-flex shrink-0 items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            읽어보기
          </Link>
        </div>
      </section>
    </>
  );
}
