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
 * 2026-08-31 에 전면 개정. 이 페이지의 목표는 정보 전달이 아니라 **자극**이다 —
 * 다 읽은 사람의 다음 생각이 "이 사람이 만든다는 퍼플즈는 뭐지?"가 되면 성공.
 *
 * 그래서 이력서 순서가 아니라 **실패 → 문장 하나 → 피벗 → 장면** 순서로 간다.
 * 성공담 사이에 실패(SAYS)가 박혀 있어야 나머지가 전부 진짜로 읽히고,
 * "만나보고 싶다"는 잘난 사람이 아니라 **걸었던 게 있는 사람**에게 생긴다.
 *
 * 사실관계는 2026-08-31 본인 인터뷰 답변 기준이다 —
 *   해외인사팀 → 1인창업 8개월 실패 → 플랫폼 스타트업 팀장 → 아내의 한 문장
 *   → 팀인팩트 창업 → 맞나만나 → 퍼플즈 피벗.
 * 동료 호칭(린님)도 본인이 정한 표기다. 회사명·연봉 같은 구체 숫자 일부는
 * 본인이 직접 덜어냈다 — 다시 넣지 말 것.
 *
 * 호명 금지(CLAUDE.md 1번)는 그대로다. "당신도 할 수 있습니다"는 한 줄도 없다 —
 * 8개월, 목요일 밤 10시, 월 3만원 같은 숫자가 그 일을 대신한다.
 */
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

          {/* 좌표. 경력은 짧게, 자랑 없이 — 못 했던 것(코드)을 같이 적는다. */}
          <p>
            첫 직무는 인사였습니다. 해외인사팀에서 5년, 천 명 단위의 채용과 37개국이
            사용하는 GHR 시스템 개발에 참여했지만{" "}
            <strong className="text-ink font-bold">코드는 한 줄도 못 짰습니다.</strong>{" "}
            기획서를 넘기면 개발팀이 만들었고, 저는 그게 어떻게 만들어지는지
            몰랐습니다.
          </p>

          {/* 실패를 성공담보다 먼저, 그리고 길게 쓴다. 이 문단이 있어야 아래의
              "이게 되네?"가 자랑이 아니라 회복으로 읽힌다. 교훈(동료 한 명)은
              퍼플즈 피벗 문단에서 다시 돌아온다 — 이 페이지의 복선이다. */}
          <p>
            회사를 나와서 처음 한 창업은 혼자였습니다. 중소기업 제품의 사용·수리
            설명을 모아주는 플랫폼을 8개월 만들다가 외주비만 쓰고
            접었습니다. 아이템이 매력적이지 않다는 걸 인정하기까지 8개월이 걸린
            셈입니다.{" "}
            <strong className="text-ink font-bold">
              동료가 한 명만 있었어도 피벗할 용기가 났을 텐데
            </strong>
            , 그 한 명이 없었습니다. 혼자 하면 빠를지는 몰라도 오래 가기 어렵고,
            임팩트도 작았습니다.
          </p>

          {/* 걸었던 것을 숫자로. "그만두고 싶어서"가 아니라 "머무를 이유가
              충분한데도"라야 아내의 문장이 무게를 갖는다. */}
          <p>
            다시 플랫폼 스타트업에 합류해 팀장 직급을 달았습니다. 머무를 이유는 충분했습니다. 
            첫 아이가 태어나고 아내가 말했습니다.{" "}
            <strong className="text-ink font-bold">
              &ldquo;나중에 후회하지 말고, 30대가 다 가기 전에 하고 싶은 것 시작해라.&rdquo;
            </strong>{" "}
            제 두 번째 창업은 그 한 문장 덕분에 시작됐습니다.
          </p>

          {/* 피벗 이야기. 동료들의 반대를 숨기지 않는다 — "듣고 바꿨다"가
              이 사람을 만나보고 싶게 만드는 대목이라서다. 문제의 순서(취업 →
              연애·결혼 → 집)는 본인의 지도라 그대로 싣는다. */}
          <p>
            팀인팩트를 만들고 처음 내놓은 건 연애 평판조회 앱
            &lsquo;맞나만나&rsquo;였습니다. 배우자 한 사람이 인생을 얼마나 바꾸는지
            막 겪은 참이었으니까요. 그런데 동료들이 솔직하게 말해줬습니다 — 자기들도
            결혼 생각이 없어서 안 쓸 것 같다고. 결혼정보회사와 미팅을 잡아둔 채로 그
            말을 들었고, 문제의 순서가 보였습니다. 일이 풀려야 연애와 결혼이
            풀리겠구나. 그래서 같이 일할 사람을 찾는 비용을 0에
            가깝게 만드는{" "}
            <a
              href="https://perplz.com"
              target="_blank"
              rel="noreferrer noopener"
              className="decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              <strong className="text-ink font-bold">퍼플즈</strong>
            </a>
            로 피벗했습니다.{" "}
            <strong className="text-ink font-bold">
              첫 창업에서 없어서 무너졌던 그 &lsquo;동료&rsquo;가 이번에는 있었기
              때문에 가능한 피벗이었습니다.
            </strong>{" "}
            맞나만나는 퍼플즈가 단단해지면 다시 꺼낼 생각입니다.
          </p>

          {/* 이 채널이 태어난 장면. 시각·자리·사람까지 적는 이유는 이 문단이
              이 페이지의 클라이맥스라서다 — 장면이 구체적이어야 "이게 되네?"가
              구호가 아니라 실제로 나온 말로 읽힌다. 회의 링크는 자랑이 아니라
              실물이라 문단 끝에 둔다 (punchline 앞에 끼우면 그 말이 죽는다). */}
          <p>
            퍼플즈를 만들다가 필요한 게 생겼습니다. 비개발자를 위한 깃허브 —
            개발자는 커밋으로 일한 기록이 전부 남는데, 다른 직무의 일은 회의가 끝나면
            증발합니다. 현실 세계에서 그 기록은 녹화와 녹음이었습니다. 어느 날
            퇴근을 앞둔 오후 5시쯤, 상상하던 최종 형태를 클로드 코드에 그대로
            말해봤습니다. 회의만 하면 알아서 정리되고, 하기로 한 일은
            태스크로 남는 것. 그게 그대로 나왔습니다. 옆자리 동료 린님과{" "}
            <strong className="text-ink font-bold">&ldquo;이게 되네?&rdquo;</strong>를
            주고받은 그 저녁이 이 채널의 시작입니다. 그 기능은 Sync라는 이름으로
            지금 퍼플즈의 간판이 됐고,{" "}
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

          {/* 리듬. "매주"를 요일과 시각으로 바꾸면 계획이 아니라 습관으로 읽힌다.
              프롬프터 이야기는 "만든 게 남에게 닿았다"의 실물이라 여기 붙는다. */}
          <p>
            그 뒤로 매주 만듭니다. 보통 목요일 밤 10시에 시작해서 MVP(초기
            버전)까지 한두 시간, AI 구독과 서버비로 월 3만원이 듭니다. SNS 첫
            영상은 시선 처리가 안 돼 같은 말을 열 번 반복했는데, 그날 밤
            프롬프터를 만들었습니다. 
          </p>

          {/* 왜 다 공개하나 — 인사 10년의 결론으로 답한다. 이 문단이 이 페이지의
              "주장" 자리다. 겁주는 쪽(대체된다)이 아니라 버리는 쪽(자존심)으로
              말한다 — 다그치지 않는다는 규칙은 주장 문단에도 그대로 적용된다. */}
          <p>
            소스코드와 프롬프트를 전부 공개하는 이유는 인사 일을 10년 하며 내린
            결론 때문입니다.{" "}
            <strong className="text-ink font-bold">
              AI 시대에 가장 먼저 버릴 것은 자존심입니다.
            </strong>{" "}
            쌓아온 지식과 노하우는 이제 누구든 복제할 수 있어서 값어치가 0을 향해
            갑니다. 남는 건 이 사람과 같이 일하고 싶은가 — 그것만이 다음 커리어로
            이어집니다. 메타, 구글, 애플의 엔지니어들까지 개인 브랜딩에 나선 이유가 이것이라고
            생각합니다. 그래서 지식을 감추는 대신 생각하는 과정을 통째로 남깁니다.{" "}
            <strong className="text-ink font-bold">빈 화면 앞에서 시작하지 마세요.</strong>{" "}
            하나 집어다 필요한 것으로 바꾸는 게 훨씬 빠릅니다.
          </p>

          {/* 강의 요청은 모순이 아니라 증거다 — 안 파는데 찾아온다는 것이
              위 주장(기록이 다음 커리어를 연다)의 실물이라 주장 바로 뒤에 둔다.
              라이선스 이름을 여기 적지 않는 이유: 조건이 바뀌면 두 곳을 고쳐야
              한다. 이름이 사는 곳은 각 레포의 LICENSE 파일 하나다. */}
          <p>
            기록을 남겼더니 연락이 옵니다. 대학에서 AX 강의 요청이 왔습니다.
            그래도 강의를 전문으로 하지 않습니다. 직접 만들고, 생각과정을 공유합니다.
            소스코드는 상업적·개인적 이용 모두 자유롭습니다. 전문은 각 레포의
            LICENSE 파일에 있고, 안에 포함된 외부 오픈소스는 각자의 라이선스를
            따릅니다.
          </p>

          <p className="text-ink-faint text-[0.9375rem]">
            채널 이름은 &lsquo;뾰로롱&rsquo;에서 왔습니다. 될 리 없다고 생각한 게
            되어버릴 때 나는 소리 같아서요.
          </p>
        </div>

        <section className="mt-14 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em]">어디서 볼 수 있나</h2>
          <p className="text-ink-soft mt-3">
            만든 것들과 생각들은 이 사이트에 모아두고, 만드는 과정은 인스타와 깃허브, 퍼플즈에 올립니다.
          </p>
          {/* 버튼 라벨이 그냥 "퍼플즈"라 위 문단의 회사 얘기와 헷갈린다.
              여기서 가리키는 게 내 프로필이라는 걸 한 줄로 못박는다 — 그리고
              이 페이지의 목표(퍼플즈가 궁금해진 사람)가 내리는 곳도 여기다. */}
          <p className="text-ink-faint mt-2 text-[0.9375rem]">
            재밌는 영상은 인스타에, 코드는 깃허브에, 일하는 모습은 퍼플즈 제
            프로필에 그대로 쌓입니다. 어떤 사람인지는 소개 문장보다 그쪽이
            정확합니다.
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
