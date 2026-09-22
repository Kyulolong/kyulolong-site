import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { CommunityInvitation } from "@/components/community-invitation";
import { GuidePaper } from "@/components/guide-paper";
import { ProofInvitation } from "@/components/proof-invitation";
import { JsonLd } from "@/components/json-ld";
import { SectionHeading } from "@/components/section-heading";
import { ThoughtRow } from "@/components/thought-row";
import { filterThoughts, validateContent } from "@/lib/content";
import { SITE_DESCRIPTION, pageMetadata, siteJsonLd } from "@/lib/seo";
import { GOAL_GUIDE, INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({ description: SITE_DESCRIPTION, path: "/" });

/**
 * 대문. 순서가 논지다 (docs/SITE-DIRECTION.md):
 *   히어로(주장 + 하는 일 + 짧은 이력) → 추천 글 셋 → 목표 가이드(종이) → Proof(보라 슬랩)
 *   → 오픈채팅 → 만든 것(실험 기록).
 *
 * 글 → 자료 → Proof 로 이어지는 행동이 이 페이지가 하려는 말이고, 만든 것은 그 뒤에서
 * "직접 만들어보기도 한다"는 근거로 받친다.
 *
 * **DB 를 읽지 않는다.** 서비스 카드(좋아요순)가 대문에서 빠지면서 revalidate 도 같이
 * 빠졌다 — 완전 정적이다 (CLAUDE.md 11번).
 *
 * 절마다 판형을 다르게 둔다: 추천 글은 줄, 가이드는 종이(GuidePaper), Proof 는 보라
 * 슬랩, 오픈채팅은 한 칼럼 글. 09-22 개편 직후엔 "왼쪽 글 + 오른쪽 인용 카드"가 세 절
 * 연달아 서서 페이지가 템플릿으로 읽혔다 (09-23 에 고쳤다).
 *
 * 형광은 히어로 커서 하나. 첫 보라 면은 Proof 슬랩이다 (DESIGN.md §8 — 큰 보라는 한 번).
 * 절 사이는 80px 이상 (§4 — 72px+).
 */
export default function Home() {
  validateContent();
  const thoughts = filterThoughts().filter((thought) => thought.featured).slice(0, 3);

  return (
    <>
      <JsonLd data={siteJsonLd(SOCIAL_LINKS.map((link) => link.href))} />
      <Hero />

      <section id="recommended" className="mx-auto w-full max-w-[1120px] scroll-mt-24 px-6 pt-20 sm:px-8 sm:pt-24">
        <div className="max-w-[46rem]">
          <SectionHeading
            title="처음이라면, 이 세 편부터"
            description="AI와 일하는 하루, 첫 실무 경험, 팀의 목표를 서로 다른 시선으로 살펴봅니다."
            href={INTERNAL_LINKS.thoughts}
          />
          {/* 뱃지를 끈다 — 절 제목이 이미 추천이라고 말한다 (components/thought-row.tsx) */}
          <ul>
            {thoughts.map((thought) => (
              <li key={thought.slug}>
                <ThoughtRow thought={thought} badge={false} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 가이드 절. 왼쪽이 무엇에 쓰는지, 오른쪽이 그 물건(종이). 폼은 자료실에 있고
          여기는 설명과 질문 하나로만 소개한다 (SITE-DIRECTION "시각 원칙"). */}
      <section id="goal-guide" className="mx-auto mt-20 w-full max-w-[1120px] scroll-mt-24 px-6 sm:mt-24 sm:px-8">
        <div className="border-line grid gap-10 border-y py-12 sm:py-14 md:grid-cols-[1fr_0.85fr] md:items-center md:gap-16">
          <div>
            {/* 표지에 박힌 시리즈 이름과 권 번호 그대로 — 진짜 순서라 번호를 붙인다 (DESIGN.md §5) */}
            <p className="text-ink-faint font-mono text-xs tracking-[0.08em]">
              {GOAL_GUIDE.series} · {GOAL_GUIDE.volume}
            </p>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-[-0.03em] sm:text-4xl">
              목표가 실행으로
              <br />
              이어지게 만드는 법
            </h2>
            <p className="text-ink-soft mt-5 max-w-[32rem] text-pretty">
              팀이 무엇을 해야 하는지부터 함께 정리해보세요. 목표 설계의 기준, KPI·OKR·MBO의 차이,
              세운 뒤의 운영 체크리스트를 담았습니다.
            </p>
            {/* 카드가 아니라 인용이다. 가이드가 팀에 먼저 묻는 질문 하나를 본문 흐름 안에 둔다 */}
            <blockquote className="mt-8 max-w-[30rem]">
              <p className="text-lg leading-relaxed font-semibold text-pretty">
                “이번 목표 때문에, 실제로 달라진 결정이 있나요?”
              </p>
              <p className="text-ink-faint mt-2 text-sm leading-relaxed">
                가이드가 팀에 먼저 묻는 질문입니다. 목표 문장을 잘 쓰는 데서 한 걸음 더, 무엇을 하고
                무엇을 하지 않을지 정하는 데 써보세요.
              </p>
            </blockquote>
          </div>
          <GuidePaper />
        </div>
      </section>

      <div className="mx-auto mt-20 w-full max-w-[1120px] px-6 sm:mt-24 sm:px-8">
        <ProofInvitation />
      </div>

      <div className="mx-auto mt-20 w-full max-w-[1120px] px-6 sm:mt-24 sm:px-8">
        <CommunityInvitation />
      </div>

      {/* 실험 기록. 다른 절과 같은 리듬(눈썹 + h2)으로 서되 가장 조용하다 —
          페이지의 마지막 말은 Proof·오픈채팅이고, 이건 그 뒤의 각주다. */}
      <section className="mx-auto mt-20 w-full max-w-[1120px] px-6 sm:mt-24 sm:px-8">
        <div className="border-line max-w-[46rem] border-t pt-10 sm:pt-12">
          <p className="text-ink-faint text-sm">실험 기록</p>
          <h2 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.02em]">
            생각을 직접 만들어보기도 합니다
          </h2>
          <p className="text-ink-soft mt-4 text-pretty">
            쓰다가 불편했던 것을 AI와 함께 도구로 만들었습니다. 만든 것과 소스코드, 프롬프트,
            시행착오도 열어뒀습니다.
          </p>
          <Link
            href={INTERNAL_LINKS.services}
            className="text-ink-soft hover:text-ink mt-4 inline-flex min-h-11 items-center text-sm underline underline-offset-4"
          >
            만든 것 보기
          </Link>
        </div>
      </section>
    </>
  );
}
