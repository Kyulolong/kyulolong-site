import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { pageMetadata } from "@/lib/seo";
import { INSTAGRAM_URL, INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "소개",
  description:
    "인사담당자가 코드 한 줄 못 짜다가 AI한테 시켜서 매주 하나씩 만들기까지. 어떻게 여기까지 왔는지, 얼마가 드는지 적어뒀습니다.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <div className="mx-auto max-w-[46rem]">
        <PageHeader
          eyebrow="about"
          title="이게 되네?"
          description="인문학을 전공했습니다. AI한테 시켜서 매주 서비스 하나씩 만듭니다. 어떻게 여기까지 왔는지, 얼마가 드는지 적어뒀습니다."
        />

        <div className="text-ink-soft space-y-6 pb-4 text-[1.0625rem]">
          {/* 경력은 '일찍, 짧게, 자랑 없이'. 나중에 알려져서 배신감이 되는 것보다
              먼저 말하고 그 대신 못 하는 것도 같이 적는 편이 낫다. */}
          <p>
            규로롱입니다. 삼성SDS에서 5년 동안 글로벌 인사담당자로 근무했습니다. 
            해외 채용과 37개국이 사용하는 인사 시스템을 기획하고 운영했는데, 
            <strong className="text-ink font-bold"> 코드는 한 줄도 못 짰습니다.</strong> 기획서를
            넘기면 개발팀이 만들고, 저는 그게 어떻게 만들어지는지 몰랐습니다.
          </p>
          <p>
            지금은 팀임팩트라는 회사를 창업해 <strong className="text-ink font-bold">퍼플즈</strong>를
            만들고 있습니다. 같이 일할 사람을 찾는 비용을 0에 가깝게 만들어보려는 서비스입니다.
            제가 동료를 찾는 데 3년을 썼거든요. 개발에서 막히는 건 이제 AI가 거의 다 풀어주는데,
            같이 할 사람을 찾는 건 아무도 안 풀어주더군요.
            (퍼플즈는 팀으로 만듭니다. 여기 올린 나머지는 전부 혼자 만든 것들입니다.)
          </p>
          <p>
            퍼플즈를 만들면서 회의가 정말 많았습니다. 회의록 쓰고 할 일 정리하는 데 시간이 다 갔고,
            무엇보다 <strong className="text-ink font-bold">왜 그렇게 결정했는지가 안 남았습니다.</strong>{" "}
            화면이랑 웹캠을 같이 녹화해주는 도구를 찾다가 마땅한 게 없어서 그냥 만들어봤는데,
            사서 쓰려던 것들보다 나았습니다. &ldquo;이게 되네?&rdquo; 그때 처음 이 말이 나왔습니다.
            제일 마지막에 급하게 붙인 그 기능이 지금 퍼플즈의 간판이 됐습니다.
          </p>
          <p>
            그러고 나서 제 채널을 만들기로 했습니다. 그런데 첫 영상을 찍는데 시선 처리가 어려워
            테이크를 15번 갔습니다. 대본을 보면 눈이 자꾸 내려가고, 안 보면 말이 막혔습니다.
            그날 밤에 프롬프터를 만들었습니다. 지금은 앱스토어에 올라가 있고,
            아나운서·쇼호스트 준비하시는 분들 단톡방에서 연습 촬영할 때 잘 쓰고 있다는 얘기를 들었습니다.
            제가 모르는 사람이 제가 만든 걸 쓰고 있다는 게, 아직도 제일 이상하고 좋습니다.
          </p>
          <p>
            코드는 이제 좀 읽습니다. 1년 전까지는 못 읽어서 에러가 뜨면 통째로 복사해
            AI한테 붙여넣었습니다. 그렇게 몇 달 하니까 눈에 익더군요.
            <strong className="text-ink font-bold"> 순서가 반대였습니다.</strong> 배우고 나서 만든 게 아니라,
            만들다 보니 조금씩 읽히기 시작했습니다.
          </p>
          <p className="text-ink-faint text-[0.9375rem]">
            채널 이름은 &lsquo;뾰로롱&rsquo;에서 왔습니다. 될 리 없다고 생각한 게 그냥 되어버릴 때
            나는 소리 같아서요.
          </p>
        </div>

        {/* 이 사이트가 취준생·주니어에게 하고 싶은 말의 본체. 규칙보다 위에 둔다. */}
        <section className="bg-paper-sand mt-14 rounded-[28px] px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">
            이제 어려운 건 만드는 일이 아닙니다
          </h2>
          <div className="text-ink-soft mt-6 space-y-5 text-[1.0625rem]">
            <p>
              코드는 AI가 짜줍니다. 그래서 남는 건{" "}
              <strong className="text-ink font-bold">뭘 만들지 정하는 일</strong>인데, 이건 아직
              아무도 대신 해주지 않습니다. 경력이 몇 년인지도 별로 상관이 없습니다.
              불편한 걸 알아채는 눈은 오래 다닌 사람이 더 밝지도 않더군요.
            </p>
            <p>
              그래서 저는 이렇게 시작합니다.
            </p>
            <ol className="text-ink-soft ml-1 space-y-3">
              <li>
                <strong className="text-ink font-bold">1.</strong> 주변 사람 또는 내가 불편해했던 걸 쭉 적는다.
                (아이랑 다녀온 첫 휴가에서 아내가 &ldquo;휴가 다녀온 것 같지가 않다&rdquo;고 했습니다 →
                바다 소리 앱이 됐습니다)
              </li>
              <li>
                <strong className="text-ink font-bold">2.</strong> 말이 안 되는 엉뚱한 생각도 같이 적는다. 거르지 않는다.
              </li>
              <li>
                <strong className="text-ink font-bold">3.</strong> 그중에 소프트웨어로 풀 만한 게 있는지 본다.
              </li>
              <li>
                <strong className="text-ink font-bold">4.</strong> 무료 AI한테 &ldquo;너라면 이거 어떻게 풀래?&rdquo;라고 물어본다.
              </li>
            </ol>
            <p>
              여기 올린 것들은 소스코드와 만들 때 쓴 프롬프트를 같이 열어뒀습니다.
              <strong className="text-ink font-bold"> 빈 화면 앞에서 시작하지 마세요.</strong> 하나 집어다
              바꾸는 게 처음부터 짜는 것보다 백 배 빠릅니다.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">얼마나 드나</h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="font-bold">한두 시간</dt>
              <dd className="text-ink-soft mt-1">
                하나 만드는 데 걸리는 시간입니다. 제일 오래 걸린 건 코딩이 아니라 환경 세팅이었습니다 —
                깃허브 연결, AI 연결, DB 연결에 하루를 통으로 날렸습니다. 그건 한 번만 하면 됩니다.
              </dd>
            </div>
            <div>
              <dt className="font-bold">Claude Code Pro 하나</dt>
              <dd className="text-ink-soft mt-1">
                저는 쓰다 보니 사용량이 늘어서 Max까지 왔는데, 여기 올린 것들은 전부
                Pro 사용량 안에서 만들어졌습니다. 시작하는 데 Max는 필요 없습니다.
              </dd>
            </div>
            <div>
              <dt className="font-bold">월 2만원</dt>
              <dd className="text-ink-soft mt-1">
                서버비입니다. Contabo를 씁니다. 여기 있는 걸 전부 한 대에 올려두고 쓰는 값입니다.
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-paper-lime mt-14 rounded-[28px] px-8 py-12 sm:px-12">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">이 사이트의 규칙 세 가지</h2>
          <ol className="mt-8 space-y-7">
            <li>
              <h3 className="font-bold">1. 로그인 없이 전부 열린다</h3>
              <p className="text-ink-soft mt-2">
                가입해야 볼 수 있는 건 하나도 없습니다. 편의가 아니라 이 사이트의 논지입니다.
                직접 써보지 않으면 &lsquo;만드는 과정&rsquo;은 아직 끝나지 않았습니다.
              </p>
            </li>
            <li>
              <h3 className="font-bold">2. 소스코드와 프롬프트를 같이 연다</h3>
              <p className="text-ink-soft mt-2">
                결과물만 보여주면 자랑처럼 끝납니다. 어떻게 시켰는지가
                사실 더 쓸모 있는 정보라서 프롬프트를 같이 둡니다. 가져다 마음껏 쓰셔도 됩니다.
              </p>
            </li>
            <li>
              <h3 className="font-bold">3. 요청받아 만든다</h3>
              <p className="text-ink-soft mt-2">
                만들어줬으면 하는 게 있으면 인스타 DM으로 보내주세요. 기획서일 필요 없고
                한 줄이면 됩니다. 만들 만하면 만들고 과정을 그대로 올립니다.
                혼자 짜내는 것보다 이쪽이 훨씬 나은 게 나오더군요.
              </p>
            </li>
          </ol>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="bg-ink text-canvas mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-85"
          >
            아이디어 보내기
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">여기서 안 하는 것</h2>
          <p className="text-ink-soft mt-4 text-[1.0625rem]">
            수익 얘기는 안 합니다. 강의도 안 팝니다. 툴 추천도 안 받습니다.
            만든 것과 만든 방법, 그리고 저의 생각만 올립니다.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">앞으로</h2>
          <p className="text-ink-soft mt-4 text-[1.0625rem]">
            요즘은 다들 경력직만 뽑습니다. 신입이 성장할 자리가 없어졌습니다.
            사람 뽑는 일을 오래 한 사람으로서 이게 제일 마음에 걸립니다.
            언젠가 그 자리를 만드는 걸 만들어보고 싶은데, 아직 뭘 만들어야 할지는 모르겠습니다.
            일단 매주 하나씩 만들면서 찾는 중입니다.
          </p>
        </section>

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
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={INTERNAL_LINKS.services}
              className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
            >
              만든 것 보기
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
