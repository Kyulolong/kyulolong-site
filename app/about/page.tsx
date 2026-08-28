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

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <div className="mx-auto max-w-[46rem]">
        <PageHeader
          eyebrow="about"
          title="이게 되네?"
          description="코드 한 줄 못 짰습니다. 지금은 매주 새로운 서비스를 만듭니다."
        />

        {/*
          이 사이트에서 유일한 사진이다.

          여기 실린 그림은 전부 만들어낸 것(서비스 일러스트)이거나 화면 캡처라,
          "사람이 있다"를 말하는 자리가 한 곳도 없었다. 인스타에서 얼굴을 보고
          넘어오는 채널인데 홈페이지에는 얼굴이 없으면 두 채널이 남처럼 갈린다.

          캡션이 사진을 아래 본문·서비스 목록과 묶는다. 풍경 사진 한 장은
          장식이지만, "이 한마디가 저 앱이 됐다"가 붙는 순간 증거가 된다.
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
            아이와 다녀온 첫 휴가에서 아내가 &ldquo;조용히 바다소리를 듣고 싶어요&rdquo;라고
            했고, 그 말이{" "}
            <Link
              href="/services/wave-sound"
              className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              쉼, 바다
            </Link>
            가 됐습니다.
          </figcaption>
        </figure>

        <div className="text-ink-soft space-y-6 pb-4 text-[1.0625rem]">
          {/* 문을 여는 숫자. "나도 답이 없다"가 이 페이지의 톤이라 통계 → 내 위치 →
              모르겠다 순으로 연다. 출처 링크는 지우지 않는다 — references 를 원문
              그대로 적는 것과 같은 이유다. (원문은 Z세대 전망치: "18 jobs across
              six different careers", Google Career Dreamer 발표문) */}
          <p>
            <a
              href="https://blog.google/company-news/outreach-and-initiatives/grow-with-google/a-new-experiment-to-help-people-explore-more-career-possibilities/"
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              평생 6번의 커리어, 18개의 직업
            </a>
            . 지금 세대가 겪게 될 숫자입니다. 저는 일곱 개쯤 지났습니다.{" "}
            <strong className="text-ink font-bold">
              남은 열한 개가 무엇일지, 저도 모릅니다.
            </strong>
          </p>
          {/* 경력은 짧게, 자랑 없이 — 못 했던 것(코드)을 같이 적는다. */}
          <p>
            사람 냄새나는 서비스를, 10년 경력 인사담당자의 시선으로 만듭니다.
            해외인사팀에서 5년, 천 명 단위의 채용과 37개국이 사용하는 GHR 시스템
            개발에 참여했지만 <strong className="text-ink font-bold">코드는 한 줄도 못 짰습니다.</strong>{" "}
            기획서를 넘기면 개발팀이 만들었고, 저는 그게 어떻게 만들어지는지 몰랐습니다.
            그 뒤로 플랫폼 기획, 영업, 개발, 창업까지 — 여러 우물을 판 것 같았지만 돌아서니 공통점이 있었습니다.
            바로 사람입니다. 사람을 이해하고, 사람에게 도움되는 일을 하고 싶었습니다.
          </p>
          <p>
            지금은{" "}
            <a
              href="https://perplz.com"
              target="_blank"
              rel="noreferrer noopener"
              className="decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              <strong className="text-ink font-bold">퍼플즈</strong>
            </a>
            를 만들고 있습니다. 같이 일할 사람을 찾는 비용을 0에 가깝게 만들어보려는 서비스입니다.
            제가 동료를 찾는 데 3년을 썼거든요. 개발에서 막히는 건 이제 AI가 거의 다 풀어주는데,
            같이 할 사람을 찾는 건 아무도 안 풀어주더군요.
          </p>
          {/* 링크는 자랑이 아니라 실물 — 잘된 회의 대신 그냥 회의 하나를 건다.
              punchline("이게 되네?") 앞에 끼우면 그 말이 죽으므로 문단 맨 끝에 둔다. */}
          <p>
            퍼플즈를 만드는 회의에서 왜 그렇게 결정했는지가 안 남길래 녹화 도구를
            만들었습니다. 시중 서비스보다 나았습니다. &ldquo;이게 되네?&rdquo; 그 말이
            처음 나온 날입니다. 제일 마지막에 만든 그 기능이 지금 퍼플즈의 간판이
            됐고,{" "}
            <a
              href="https://perplz.com/s/EmYLdzGU"
              target="_blank"
              rel="noreferrer noopener"
              className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              그걸로 남긴 회의
            </a>
            는 링크에서 볼 수 있습니다.
          </p>
          <p>
            그 감탄의 경험을 공유하고 싶어 SNS를 시작했습니다. 첫 영상은 시선 처리가 안 돼
            같은 말을 10번 반복했고, 그날 밤 프롬프터를 만들었습니다. 지금은 앱스토어에 있고,
            아나운서 준비하시는 분들이 연습 촬영에 쓰고 있습니다.{" "}
            <strong className="text-ink font-bold">
              다양한 사람들이 제가 만든 걸 쓰고 있다는 게 제일 설레고 좋습니다.
            </strong>
          </p>
          <p>
            MVP(초기 버전) 만드는 데 한두 시간, AI 구독과 서버비는 월 3만원 들었습니다. 소스코드와
            프롬프트는 전부 공유합니다.{" "}
            <strong className="text-ink font-bold">빈 화면 앞에서 시작하지 마세요.</strong>{" "}
            하나 집어다 필요에 따라 바꾸는 게 훨씬 빠릅니다. 직접 만든 게 눈앞에서 동작할
            때의 즐거움을 느껴보시면 좋겠습니다.
          </p>
          {/* "강의도 안 팝니다"에 이유를 붙인다 — 강의는 이미 쏟아지니 나는 물건을
              만들어 쓴다. 선언이 아니라 결론으로 읽히게.

              마지막 줄은 갈 곳을 같이 적는다. 코드를 가져다 쓸 사람은 이 페이지가
              아니라 깃허브에 바로 떨어지므로, 여기서 "자유롭게 쓰세요"라고만 하면
              정작 코드가 있는 자리에는 아무 말도 없는 셈이 된다. 그래서 레포마다
              LICENSE(MIT) 를 두고 이 문장은 그리로 넘긴다. 라이선스 이름을 여기
              적지 않는 것은 조건이 바뀌면 두 곳을 고쳐야 하기 때문이다 — 이름이
              사는 곳은 LICENSE 파일 하나다. */}
          <p>
            수익 얘기는 안 합니다. 강의도 안 팝니다. 직접 만들고 그 과정을
            공유합니다. 소스코드는 상업적·개인적 이용 모두 자유롭습니다. 전문은
            각 레포의 LICENSE 파일에 있고, 안에 포함된 외부 오픈소스는 각자의
            라이선스를 따릅니다.
          </p>
          <p className="text-ink-faint text-[0.9375rem]">
            채널 이름은 &lsquo;뾰로롱&rsquo;에서 왔습니다. 될 리 없다고 생각한 게
            되어버릴 때 나는 소리 같아서요.
          </p>
        </div>

        <section className="mt-14 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em]">어디서 볼 수 있나</h2>
          <p className="text-ink-soft mt-3">
            만든 것들은 이 사이트에 모아두고, 만드는 과정은 인스타와 깃허브, 퍼플즈에 올립니다.
          </p>
          {/* 버튼 라벨이 그냥 "퍼플즈"라 서비스 소개(/services/perplz)와 헷갈린다.
              여기서 가리키는 게 내 프로필이라는 걸 한 줄로 못박는다. */}
          <p className="text-ink-faint mt-2 text-[0.9375rem]">
            재밌는 영상은 인스타에, 코드는 깃허브에, 작업 과정은
            퍼플즈 제 프로필에 그대로 쌓입니다.
          </p>
          {/* 규칙 박스가 빠지면서 "요청받아 만든다"의 창구도 같이 사라졌다.
              이 채널의 유일한 쌍방향 장치라 한 줄로 남긴다. */}
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
            으로 한 줄 보내주세요. 과정과 함께 찾아갈게요.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={INTERNAL_LINKS.services}
              className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
            >
              만든 것 보기
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
