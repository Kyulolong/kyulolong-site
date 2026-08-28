import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { ThoughtRow } from "@/components/thought-row";
import { filterServices, filterThoughts, validateContent } from "@/lib/content";
import { getLikeCounts, orderServicesForHome } from "@/lib/likes";
import { SITE_DESCRIPTION, pageMetadata, siteJsonLd } from "@/lib/seo";
import {
  INSTAGRAM_URL,
  INTERNAL_LINKS,
  PERPLZ_PROFILE_URL,
  SOCIAL_LINKS,
} from "@/lib/site-links";

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
 */
export const revalidate = 86400;
const DAY = 86400;

/**
 * 대문의 순서가 이 사이트의 논지다.
 *
 *   히어로(왜 이걸 하나) → 생각들 → 만든 것 → 가져가세요 → 말 거는 곳 → 소개
 *
 * 글이 서비스보다 **위**에 온다. 이 채널이 쌓아가는 건 글이고, 만든 것은
 * 그 글이 탁상공론이 아니라는 증거로 뒤를 받친다. 반대로 놓으면 진열장이 된다.
 *
 * 영상 그리드는 대문에서 뺐다. 하단 바와 헤더에 상시로 있고, 대문이 목적을
 * 말하는 자리가 된 이상 세 번째 격자는 스크롤만 늘린다. /videos 는 그대로다.
 */
export default async function Home() {
  // 빌드 스크립트에서도 돌지만 렌더 경로에서도 한 번 더 막는다.
  // 깨진 참조를 그린 채로 배포되는 일이 없어야 한다.
  validateContent();

  const allServices = filterServices();
  const allThoughts = filterThoughts();

  // 첫 자리는 최신 것 고정, 나머지는 좋아요순 (lib/likes.ts).
  const likes = await getLikeCounts(DAY);
  const services = orderServicesForHome(allServices, likes.service);
  const thoughts = allThoughts.slice(0, 3);

  return (
    <>
      {/* 검색엔진이 이 사이트와 사람을 하나로 묶어 읽게 한다.
          인스타·깃허브·퍼플즈를 sameAs 로 걸어야 세 채널이 한 사람으로 인식된다. */}
      <JsonLd data={siteJsonLd(SOCIAL_LINKS.map((link) => link.href))} />

      <Hero />

      {/*
        인사이트가 착지하는 자리.

        설명을 붙이지 않는다 — 제목 셋이 스스로 말하는 게 어떤 소개 문장보다
        강하다. "인사이트를 드립니다" 같은 줄을 여기 넣고 싶어지면 그건 제목이
        약하다는 뜻이지 문장이 필요하다는 뜻이 아니다.
      */}
      <section className="mx-auto w-full max-w-[1120px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="max-w-[46rem]">
          <SectionHeading
            title="생각들"
            href={INTERNAL_LINKS.thoughts}
            meta={String(allThoughts.length)}
          />
          {thoughts.length > 0 ? (
            <ul>
              {thoughts.map((thought) => (
                <li key={thought.slug}>
                  <ThoughtRow thought={thought} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-faint text-sm">아직 올린 글이 없습니다.</p>
          )}
        </div>
      </section>

      {/*
        만든 것 — 가로 한 줄.

        격자 네 장에서 한 줄로 바꿨다. 대문의 주인공이 글로 옮겨갔지만 이 줄을
        지우면 안 된다: 이 채널이 다른 "생각 쓰는 사람"들과 갈리는 지점은
        글 옆에 실제로 도는 앱이 있다는 것이고, 그게 없으면 위의 글이 근거를 잃는다.

        자동으로 넘어가지 않는다 — 손으로 미는 스크롤이라 §8 의 "자동 재생
        캐러셀 금지"에 걸리지 않는다.

        ⚠️ 카드에서 buildTime 이 보여야 한다. 카드를 더 줄이고 싶어지면 제일
        먼저 잘리는 게 그 줄인데, "2시간" 이 여덟 장 나란히 서는 것이 이 화면에서
        시작해볼 만하다고 말하는 유일한 장치다.
      */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
          <SectionHeading
            title="만든 것"
            description="쓰다가 불편했던 걸 하나씩 만들었습니다. 전부 로그인 없이 바로 열립니다."
            href={INTERNAL_LINKS.services}
            meta={String(allServices.length)}
          />
        </div>

        {/* md 부터는 격자로 되돌린다 — 포인터로 가로 스크롤을 미는 건 불편하다 */}
        <ul className="hidden gap-5 px-8 md:mx-auto md:grid md:w-full md:max-w-[1120px] md:grid-cols-3">
          {services.slice(0, 3).map((service, i) => (
            <li key={service.slug}>
              <ServiceCard service={service} eager={i < 3} likes={likes.service[service.slug]} />
            </li>
          ))}
        </ul>

        {/* 모바일: 손으로 미는 가로 줄. 좌우 여백은 스페이서가 만든다 —
            컨테이너에 px 를 주면 스크롤 끝에서 카드가 가장자리에 붙는다. */}
        {/* scroll-px-6 이 없으면 스냅된 카드가 화면 왼쪽 끝에 딱 붙는다 —
            위 제목의 왼쪽 끝(24px)과 어긋나서 줄이 하나 더 있는 것처럼 보인다. */}
        <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 pb-2 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <li aria-hidden="true" className="w-2 shrink-0" />
          {services.map((service, i) => (
            <li key={service.slug} className="w-[72vw] max-w-[18rem] shrink-0 snap-start">
              <ServiceCard service={service} eager={i < 2} likes={likes.service[service.slug]} />
            </li>
          ))}
          <li aria-hidden="true" className="w-2 shrink-0" />
        </ul>
      </section>

      {/*
        "용기" 쪽 문. 위의 서비스 줄이 "됐다"를 보여주고 여기가 "가져가라"를 말한다.
        그래서 그 줄 바로 아래 붙는다 — 사이에 다른 섹션이 끼면 증거와 초대가 갈린다.

        예전의 네 문단을 셋으로 줄였다. 잘라낸 것(빈 화면 얘기)은 /about 에 있다.
        ⚠️ **이 블록이 이 페이지에서 보라 30%를 실제로 채우는 자리다** (DESIGN.md §1).
        면이 넓어야 하는 건 취향이 아니라 구조다 — 보라가 뱃지 몇 개로 쪼그라들면
        화면이 검정과 형광 두 겹으로 돌아가고, 그건 §1 이 적어둔 1차 실패다.
        가장 진한 면을 여기 준 이유는 이 블록이 "용기" 쪽 문의 논지 그 자체라서다.
      */}
      <section className="mx-auto w-full max-w-[1120px] px-6 pt-12 sm:px-8 sm:pt-16">
        <div className="bg-iris text-on-iris rounded-card px-8 py-14 sm:px-14 sm:py-20">
          <div className="max-w-[42rem]">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
              0부터 시작하지 마세요
            </h2>
            <p className="text-on-iris/80 mt-5 text-lg text-pretty">
              코드는 이제 AI가 짜줍니다. 그래서 어려운 건 만드는 일이 아니라
              <strong className="text-on-iris font-semibold"> 시작하는 것 그 자체</strong>입니다.
            </p>
            <p className="text-on-iris/80 mt-4 text-lg text-pretty">
              그래서 만든 것마다 소스코드, 프롬프트와{" "}
              <strong className="text-on-iris font-semibold">작업과정을 통째로</strong> 열어뒀습니다.
              빈 화면 앞에서 시작하지 마시고, 해봄직한 것 가져다 필요한 것으로 바꾸세요.
            </p>
            {/* "가져다 쓰세요"만 말하면 뭘 깔아야 하는지 모르는 사람이 여기서 멈춘다.
                그 한 문장을 붙여야 아래 버튼이 갑자기 나오지 않는다. */}
            <p className="text-on-iris/80 mt-4 text-lg text-pretty">
              프롬프트를 어디에 붙여넣어야 할지 모르시겠다면, 뭘 깔고 어떻게 시작하는지
              순서대로 적어뒀습니다. 터미널을 한 번도 안 열어보셨어도 됩니다.
            </p>
            {/* 보라 면 위에서는 밝은 알약이 가장 단단하다. 형광을 쓰지 않는 건
                그대로다 — 이 화면의 형광 한 점은 히어로의 커서다 (§2). */}
            <div className="mt-8">
              <Link
                href={INTERNAL_LINKS.start}
                className="bg-on-iris text-iris inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-90"
              >
                처음이라면: 설치부터 따라 하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*
        말 거는 곳. 이 채널의 유일한 쌍방향 장치라 /about 배너보다 위에 둔다.

        창구가 둘이다 — 인스타 DM 과 퍼플즈 DM. 여기서는 상대를 불러도 된다:
        실제로 말을 거는 자리라서다. 대신 문턱을 낮추는 쪽으로만 쓴다
        ("한 줄이면 됩니다").

        ⚠️ **여기에 면을 깔지 않는다.** 바로 위가 이 페이지에서 가장 진한 보라
        슬랩이라, 여기도 면을 깔면 덩어리 둘이 나란히 서서 쌍둥이로 읽힌다.
        큰 보라는 페이지에 **한 번만** 쳐야 세다. 이 절은 가는 선 하나로 열고
        여백으로 buffer 를 만든다 — 조용한 자리가 있어야 위가 크게 들린다.
      */}
      <section className="mx-auto w-full max-w-[1120px] px-6 pt-20 sm:px-8 sm:pt-24">
        <div className="border-line border-t pt-14 sm:pt-16">
          <div className="max-w-[42rem]">
            {/*
              얼굴이 이 절의 머리에 온다 — **기사의 바이라인 자리**다.

              히어로에 있던 것을 여기로 내렸다. 대문이 먼저 해야 할 말은 "오늘의
              생각이 내일의 창업으로"지 자기소개가 아니라서다. 대신 이 절은 이
              페이지에서 **유일하게 1인칭으로 말을 거는 자리**다("최대한 만들어
              보겠습니다", "저도 혼자 아이디어를 떠올리기 보다"). 묻는 사람의
              얼굴이 질문 위에 있어야 그 말이 누구 말인지 분명해지고, 바로 아래
              DM 버튼이 "이 사람에게 보낸다"가 된다.

              ⚠️ 그래도 대문에서 사람을 빼지는 않는다 — 인스타에서 얼굴을 보고
              넘어오는 채널이라, 대문 어디에도 얼굴이 없으면 두 채널이 남처럼 갈린다.

              이름을 적지 않는다. 남는 한 줄이 **직함**이라 그게 서명이 된다.
              object-[50%_30%] — 얼굴이 세로 30% 지점이라 정가운데로 자르면
              이마가 날아가고 랩탑만 남는다.
            */}
            <div className="mb-7 flex items-center gap-3.5">
              <Image
                src="/kyulolong2.png"
                alt="랩탑 앞에 앉아 있는 규로롱"
                width={112}
                height={112}
                sizes="(min-width: 768px) 4rem, 3.5rem"
                className="bg-surface-2 size-14 shrink-0 rounded-full object-cover object-[50%_30%] md:size-16"
              />
              <p className="text-ink-faint text-sm">AX하는 창업가</p>
            </div>

            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
              만들어보고 싶은 게 있으세요?
            </h2>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              기획서일 필요 없고 한 줄이면 됩니다. 만들고 싶은 이유도 알려주신다면 더 좋겠죠.
              &ldquo;이런 게 있으면 좋겠는데&rdquo; 정도로 충분해요.
            </p>
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              최대한 만들어 보겠습니다. 만드는 과정을 공유합니다. 아이디어 보낸 분은
              거기서부터 작업을 시작하세요. 저도 혼자 아이디어를 떠올리기 보다 요청을 받아
              만드는 것이 결과가 더 좋습니다.
            </p>
            {/* 둘 다 잉크다. 알약 둘이 나란히 서지만 색이 같아서 위계가 아니라
                선택지로 읽힌다 — 실제로 둘은 대등한 창구다. */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="bg-ink text-canvas inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-85"
              >
                인스타 DM
              </a>
              <a
                href={PERPLZ_PROFILE_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                퍼플즈 DM
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 소개 요약. 하단 바에서 소개를 뺐으므로 모바일에서는 히어로의 밑줄
          링크와 여기 둘이 /about 으로 가는 길이다. */}
      <section className="mx-auto w-full max-w-[1120px] px-6 pt-8 sm:px-8 sm:pt-10">
        <div className="border-line flex flex-wrap items-center justify-between gap-6 rounded-card border px-8 py-10 sm:px-12">
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
            className="border-line-strong text-ink hover:bg-surface-2 inline-flex min-h-11 shrink-0 items-center rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            읽어보기
          </Link>
        </div>
      </section>
    </>
  );
}
