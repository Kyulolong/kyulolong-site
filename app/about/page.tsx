import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = {
  title: "소개",
  description: "인사담당자였던 사람이 왜 IT 서비스를 만드는지에 대한 이야기.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <div className="mx-auto max-w-[46rem]">
        <PageHeader
          eyebrow="about"
          title="왜 이걸 만드나"
          description="개발을 안 배운 사람이 매주 서비스를 하나씩 만들면 무슨 일이 생기는지 기록하고 있습니다."
        />

        <div className="text-ink-soft space-y-6 pb-4 text-[1.0625rem]">
          <p>
            사람 뽑는 일을 했습니다. 이력서를 읽고, 면접을 보고, 안 맞는 사람을 걸러내는 일.
            그 일을 하면서 가장 많이 본 문장이 &ldquo;해본 적은 없지만 배우겠습니다&rdquo;였고,
            가장 많이 한 생각은 &lsquo;그래서 뭘 만들어봤는데요&rsquo;였습니다.
          </p>
          <p>
            그러다 제가 그 질문을 받는 쪽이 됐습니다. 개발을 배운 적이 없으니
            보여줄 게 없었고, 보여줄 게 없으니 말이 길어졌습니다.
            말을 줄이는 방법은 하나뿐이더군요. <strong className="text-ink font-bold">그냥 만들어서 보여주는 것.</strong>
          </p>
          <p>
            그래서 매주 한두 개씩 만듭니다. 대단한 걸 만들려는 게 아니라
            제가 쓰다가 불편했던 걸 만듭니다. 촬영할 때 대본이 안 따라와서 프롬프터를 만들었고,
            콘티 쪼개는 게 귀찮아서 콘티 도구를 만들었고, 가는 길에 카페를 못 찾아서 내비를 만들었습니다.
          </p>
        </div>

        <section className="bg-paper-lime mt-14 rounded-[28px] px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">이 사이트의 규칙 세 가지</h2>
          <ol className="mt-8 space-y-7">
            <li>
              <h3 className="font-bold">1. 로그인 없이 전부 열린다</h3>
              <p className="text-ink-soft mt-2">
                가입해야 볼 수 있는 건 하나도 없습니다. 편의가 아니라 이 사이트의 논지입니다.
                직접 써보지 않으면 &lsquo;만들었다&rsquo;는 말은 그냥 말입니다.
              </p>
            </li>
            <li>
              <h3 className="font-bold">2. 소스코드는 열 수 있는 대로 연다</h3>
              <p className="text-ink-soft mt-2">
                가져다 마음껏 쓰셔도 됩니다. 아직 정리가 안 된 것도 있는데,
                그건 안 여는 게 아니라 아직 못 연 겁니다.
              </p>
            </li>
            <li>
              <h3 className="font-bold">3. 막힌 데도 같이 남긴다</h3>
              <p className="text-ink-soft mt-2">
                완성본만 올리면 &lsquo;역시 되는 사람은 되네&rsquo;로 끝납니다.
                어디서 며칠을 날렸는지가 사실 더 쓸모 있는 정보입니다.
              </p>
            </li>
          </ol>
        </section>

        <section className="mt-14 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em]">어디서 볼 수 있나</h2>
          <p className="text-ink-soft mt-3">
            만든 것들은 이 사이트에 모아두고, 만드는 과정은 인스타와 유튜브에 올립니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={INTERNAL_LINKS.services}
              className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
            >
              만든 서비스 보기
              <span aria-hidden="true">→</span>
            </Link>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
