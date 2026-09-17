import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { HeroLinks } from "@/components/hero-links";
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
 *   히어로(왜 이걸 하나) → 생각들 → 만든 것 → 타일 둘(가져갈 것) → 말 거는 곳
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

        {/*
          "가져가세요"의 초대와 /start 진입점이 여기로 왔다 — 예전엔 아래 보라
          슬랩이 이 말을 했는데, 그 슬랩이 질문들로 바뀌면서 초대는 증거(카드 줄)
          바로 옆으로 붙는다. 버튼이 아니라 밑줄 링크다: 이 섹션의 주인공은
          카드들이고, 이 줄은 카드를 보고 "나도"가 된 사람만 집는 보조 통로라서다.
        */}
        <p className="text-ink-soft mx-auto mt-6 w-full max-w-[1120px] px-6 text-[0.9375rem] text-pretty sm:px-8">
          만든 것마다 소스코드와 프롬프트를 통째로 열어뒀습니다. 가져다 필요한 것으로
          바꾸세요. 터미널을 한 번도 안 열어보셨다면{" "}
          <Link
            href={INTERNAL_LINKS.start}
            className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
          >
            설치부터 따라 하는 안내
          </Link>
          가 따로 있습니다.
        </p>
      </section>

      {/* 종이와 방으로 가는 타일 둘. 2026-09-17 에 히어로 바로 아래에서 여기로
          내렸다 — 이유와 치른 값은 components/hero-links.tsx 에 적어뒀다. */}
      <HeroLinks />

      {/*
        말 거는 곳. 이 채널의 유일한 쌍방향 장치라 /about 배너보다 위에 둔다.

        창구가 둘이다 — 인스타 DM 과 퍼플즈 DM. 여기서는 상대를 불러도 된다:
        실제로 말을 거는 자리라서다. 대신 문턱을 낮추는 쪽으로만 쓴다
        ("한 줄이면 충분해요").

        **받는 것이 '만들고 싶은 것'에서 '일하다 막힌 장면'으로 바뀌었다** (2026-09-16).
        예전엔 "최대한 만들어 보겠습니다"였는데, 규로롱의 일이 만들어 주는 쪽에서
        사람의 일과 성장을 같이 들여다보는 쪽(교육·코칭)으로 옮겨가면서 그 약속이
        어긋났다. 프로그램은 아직 모집하지 않으므로 여기서 팔지 않는다 — 장면을
        받는 창구로만 두고, 모집을 시작하면 그때 이 절을 다시 본다. 받은 장면은
        글감(docs/BRAND.md §8 "익숙한 장면")이기도 해서 "먼저 여쭙겠습니다"를 적어둔다.

        여기에 면을 깔지 않는다. 이 절은 가는 선 하나로 열고 여백으로 buffer 를
        만든다 — 얼굴과 1인칭 문장이 서는 자리라, 상자에 담으면 배너로 읽힌다.

        ⚠️ **2026-09-07 에 바로 위의 보라 슬랩(질문들)을 지웠다.** 그전까지 이
        문단은 "위가 가장 진한 보라라 여기도 면을 깔면 쌍둥이가 된다"가 이유였는데,
        그 근거는 이제 없다. 대신 **반대 문제가 열려 있다**: 대문에 남은 보라가
        히어로 버튼 하나와 푸터 띠뿐이라, 화면이 검정+형광 두 겹으로 기운다
        (DESIGN.md §1 의 1차 실패). 30% 층을 어디서 다시 세울지는 아직 안 정했다 —
        여기에 면을 까는 것도 후보 중 하나다.
      */}
      <section className="mx-auto w-full max-w-[1120px] px-6 pt-20 sm:px-8 sm:pt-24">
        <div className="border-line border-t pt-14 sm:pt-16">
          <div className="max-w-[42rem]">
            {/*
              얼굴이 이 절의 머리에 온다 — **기사의 바이라인 자리**다.

              히어로에 있던 것을 여기로 내렸다. 대문이 먼저 해야 할 말은 "오늘의
              생각이 내일의 창업으로"지 자기소개가 아니라서다. 대신 이 절은 이
              페이지에서 **유일하게 1인칭으로 말을 거는 자리**다("같이
              살펴보겠습니다", "먼저 여쭙겠습니다"). 묻는 사람의
              얼굴이 질문 위에 있어야 그 말이 누구 말인지 분명해지고, 바로 아래
              DM 버튼이 "이 사람에게 보낸다"가 된다.

              ⚠️ 그래도 대문에서 사람을 빼지는 않는다 — 인스타에서 얼굴을 보고
              넘어오는 채널이라, 대문 어디에도 얼굴이 없으면 두 채널이 남처럼 갈린다.

              **이름을 적는다.** 히어로에 있을 때는 뺐었다 — 헤더 워드마크가 바로
              위에 있어서 한 화면에 "규로롱"이 둘이 됐기 때문이다. 여기까지 내려오면
              헤더는 이미 스크롤 밖이고, 바이라인은 이름이 있어야 바이라인이다.

              한 톤으로 둔다. 이름만 밝히면 14px 한 줄에 색이 둘이 되어 부산스럽고,
              서명은 자랑이 아니라 낙관(落款)이다 (DESIGN.md §7).

              **수식어는 직함이 아니라 지나온 길이다** (2026-09-16, 전: `AX하는 창업가`).
              직장인·인사·창업 세 시선(docs/BRAND.md §3)을 직함 셋으로 늘어놓지 않고
              순서로 적었다. `창업가` 만 남기면 회사를 떠난 사람의 채널로 읽혀서 핵심
              독자(직장인)가 자리를 못 찾는다. `인사를 하다` 는 "인사하다"로 먼저 읽혀서
              `인사팀에서` 다. ⚠️ 인스타 이름(`규로롱 | 사람·조직·창업`)과 맞추지 않는다 —
              그 문구는 히어로 눈썹 줄이 이미 받고 있어서, 여기까지 쓰면 한 페이지에 두 번 선다.

              ⚠️ **원본(kyulolong2.png, 778×1202)을 여기에 직접 걸지 말 것.**
              세로 3:4 사진이라 원형으로 자르면 얼굴이 세로의 38% 밖에 안 되고,
              나머지를 랩탑이 채운다. object-position 으로 밀어봐야 위를 살리면
              턱 아래가 비고 아래를 살리면 이마가 날아간다 — 자리가 없는 게 아니라
              **잘라야 할 사진**이다. kyulolong-avatar.jpg 는 그 원본에서 머리
              둘레로 잘라낸 정사각(760²→512²)이라 여기서는 크기만 정하면 된다.
              다시 자를 일이 있으면 원본이 public/ 에 그대로 있다.
            */}
            <div className="mb-7 flex items-center gap-4">
              <Image
                src="/kyulolong-avatar.jpg"
                alt="규로롱"
                width={192}
                height={192}
                sizes="(min-width: 768px) 6rem, 5rem"
                className="bg-surface-2 size-20 shrink-0 rounded-full object-cover md:size-24"
              />
              <p className="text-ink-faint text-sm">인사팀에서 일하다 창업한 규로롱</p>
            </div>

            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
              일하다 막힌 장면이 있으세요?
            </h2>
            <p className="text-ink-soft mt-5 text-lg text-pretty">
              정리된 질문이 아니어도 됩니다. 어떤 일을 하다가 어디서 막혔는지, 한 줄이면 충분해요.
            </p>
            <p className="text-ink-soft mt-4 text-lg text-pretty">
              모두가 성장할 수 있는 방법을 같이 살펴보겠습니다. 사람 탓으로 보이던 일이
              역할이나 구조의 문제일 때가 많습니다. 글로 옮기고 싶은 장면은 먼저 여쭙겠습니다.
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

    </>
  );
}
