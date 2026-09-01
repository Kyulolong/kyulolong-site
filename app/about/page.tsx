import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { pageMetadata } from "@/lib/seo";
import { INSTAGRAM_URL, INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "소개",
  description:
    "인사담당자가 코드 한 줄 못 짜다가 AI와 함께 매주 하나씩 만들기까지. 어떻게 여기까지 왔는지 적어뒀습니다.",
  path: "/about",
});

/**
 * 2026-09-01 전면 개정 — 본인이 직접 쓴 원고를 그대로 실었다 (담백한 문체).
 * 구조: 인사 → 질문(함께 일하기) → AI 시대의 차별화 → 두 번의 창업 → 기록의 이유
 * → 존재의 가치 → 맺음("빈 화면 앞에서…").
 *
 * ⚠️ 첫 문단이 청중을 호명한다(창업자 · 주니어) — CLAUDE.md 1번 "쓰지 않을 말"과
 * 충돌하지만 본인이 직접 쓴 문장이라 그대로 뒀다. 이 문단을 다시 만지게 되면
 * 그 규칙을 옆에 둘 것.
 *
 * 이전 판의 장면들(아내의 한 문장, "이게 되네?" 탄생 장면, 목요일 밤 10시 ·
 * 월 3만원, 뾰로롱 유래, 라이선스 안내)은 이 개정에서 빠졌다 — 필요해지면
 * git log 에서 복원한다.
 *
 * 사진과 맨 아래 "어디서 볼 수 있나" 섹션(창구 · CTA)은 본문이 아니라 페이지의
 * 가구라 그대로 유지했다.
 */
export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <div className="mx-auto max-w-[46rem]">
        <PageHeader eyebrow="about" title="안녕하세요. 규로롱입니다." />

        {/*
          이 사이트에서 유일한 사진이다. 인스타에서 얼굴을 보고 넘어오는 채널이라
          홈페이지에 얼굴이 없으면 두 채널이 남처럼 갈린다. 캡션은 아래 본문의
          "존재 자체가 가치" 문단과 같은 이야기다 — 사진이 그 문단의 실물이 된다.
        */}
        <figure className="mb-14">
          <div className="bg-surface-2 relative aspect-[3/2] w-full overflow-hidden rounded-card">
            <Image
              src="/kyulolong.jpg"
              alt="광안대교 아래 배 위에서 아기띠로 아기를 안고 바다를 보고 있는 규로롱"
              fill
              sizes="(min-width: 768px) 46rem, 100vw"
              /* 세로 사진을 가로로 자른다. 얼굴(위쪽)과 아기(아래쪽)를 한 화면에
                 담으려면 정가운데가 아니라 조금 위를 중심으로 잡아야 한다. */
              className="object-cover object-[50%_44%]"
              /* 이 페이지의 LCP 다 — 첫 화면에 들어오는 유일한 이미지라 미리 받는다 */
              preload
            />
          </div>
          <figcaption className="text-ink-faint mt-3.5 text-sm">
            둘째와 함께 다녀온 여행에서 한 컷
          </figcaption>
        </figure>

        <div className="text-ink-soft space-y-6 pb-4 text-[1.0625rem]">
          <p>
            이 홈페이지는 창업을 고민하는 분들에게 생각의 확신을, 커리어를 시작하는 주니어 분들에게는
            조금 더 용기를 주기 위해 만들었습니다.
          </p>

          <p>
            저는 10년 가까이 인사와 조직을 경험했습니다. 해외인사팀에서 37개국의
            채용을 운영했고, 글로벌 인사 시스템을 만드는 일에도 참여했습니다.
          </p>

          <p>그 과정에서 하나의 질문이 생겼습니다.</p>

          <p>
            <strong className="text-ink font-bold">
              한국인은 정말 똑똑한데, 왜 함께 일하는 것은 이렇게 어려울까?
            </strong>
          </p>

          <p>
            제가 경험한 한국 조직은 각자의 일을 나누고 빠르게 실행하는 데는
            강했습니다. 하지만 다른 사람의 의견을 듣고, 내 생각을 바꾸고, 서로 다른
            전문성을 연결해 하나의 결과를 만드는 일에는 상대적으로 서툴렀습니다.
          </p>

          <p>저는 이것이 앞으로 더 큰 문제가 될 거라고 생각합니다.</p>

          <p>
            AI가 사람이 할 수 있는 일의 상당 부분을 대신하게 될수록, 개인의 지식과
            기술만으로 차별화하기는 점점 어려워집니다. 결국 중요한 것은{" "}
            <strong className="text-ink font-bold">
              무엇을 알고 있느냐보다, 누구와 무엇을 만들어낼 수 있느냐
            </strong>
            일지 모릅니다.
          </p>

          <p>저 역시 그 답을 찾는 과정에 있습니다.</p>

          <p>
            첫 창업은 혼자 시작했고, 8개월 만에 접었습니다. 혼자라서 빠르기는
            했지만 방향이 틀렸다는 사실을 알아차리기까지 다소 시간이 걸렸습니다.
          </p>

          <p>
            두 번째 창업에서는 동료들과 함께 시작했습니다. 처음에는 전혀 다른
            서비스를 만들었지만, 서로의 의견을 듣고 바꾸는 과정에서 지금의{" "}
            <a
              href="https://perplz.com"
              target="_blank"
              rel="noreferrer noopener"
              className="decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              <strong className="text-ink font-bold">퍼플즈</strong>
            </a>
            가 만들어졌습니다.
          </p>

          <p>
            퍼플즈를 만들면서 저는 AI를 본격적으로 사용하기 시작했습니다. 그러면서 AI가 단순히 반복적인 일을 대신하는 도구가 아니라, 
            사람과 사람을 연결하고, 서로의 생각을 더 빠르게 공유하고, 더 나은 결과를 만들어내는 도구가 될 수 있다는 사실을 깨달았습니다.
          </p>

          <p>
            지식은 점점 복제하기 쉬워지고 있습니다. 그래서 저는 감추기보다
            공유하려고 합니다.
          </p>

          <p>그리고 한 가지를 더 이야기하고 싶습니다.</p>

          <p>
            우리는 너무 오래 자신의 가치를 증명하며 살아왔습니다. 좋은 학교, 좋은
            회사, 높은 연봉과 직함. 저 역시 그것들을 열심히 쌓았습니다.
          </p>

          <p>
            하지만 아이가 태어난 뒤, 존재 자체가 가치가 될 수 있다는 사실을 조금 더
            깊게 이해하게 됐습니다.
          </p>

          <p>
            그래서 이곳에서{" "}
            <strong className="text-ink font-bold">
              일하는 방법뿐 아니라, AI 시대에 어떻게 살아갈 것인지
            </strong>
            도 함께 생각해보려 합니다. 생각하고, 만들고, 기록하겠습니다.
          </p>

          <p>빈 화면 앞에서 시작하는 사람이 조금 더 용기를 낼 수 있도록.</p>
        </div>

        <section className="mt-14 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em]">어디서 볼 수 있나</h2>
          <p className="text-ink-soft mt-3">
            만든 것들과 생각들은 이 사이트에 모아두고, 만드는 과정은 인스타와 깃허브, 퍼플즈에 올립니다.
          </p>
          {/* 버튼 라벨이 그냥 "퍼플즈"라 위 문단의 회사 얘기와 헷갈린다.
              여기서 가리키는 게 내 프로필이라는 걸 한 줄로 못박는다. */}
          <p className="text-ink-faint mt-2 text-[0.9375rem]">
            재밌는 영상은 인스타에, 코드는 깃허브에, 일하는 모습은 퍼플즈 제
            프로필에 그대로 쌓입니다. 어떤 사람인지는 소개 문장보다 그쪽이
            정확합니다.
          </p>
          {/* 이 채널의 유일한 쌍방향 장치라 한 줄로 남긴다. */}
          <p className="text-ink-soft mt-3">
            만들어보고 싶은 게 있으면{" "}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              인스타 DM
            </a>
            으로 한 줄 보내주세요. 즐거운 여정을 함께해요.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={INTERNAL_LINKS.services}
              className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
            >
              만든 것 보기
            </Link>
            {/* 글이 이 채널의 축이라 내부 링크 둘이 나란히 선다. 형광은 화면에
                한 점(위의 만든 것 보기)이므로 이쪽은 테두리 알약이다. */}
            <Link
              href={INTERNAL_LINKS.thoughts}
              className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
            >
              생각들 보기
            </Link>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
