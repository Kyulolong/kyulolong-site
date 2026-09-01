import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 랜딩의 보라 슬랩 — 회사를 시작하기 전에 스스로 답해둘 질문 열 개.
 * (세는 단위는 접힘 줄, 곧 갈래다 — 갈래마다 물음 둘이 들어 있지만
 * 화면에 열 줄이 서므로 카피도 "열 개"로 센다.)
 *
 * 예전 이 자리는 "0부터 시작하지 마세요"(설치 안내로 보내는 초대)였다.
 * 2026-08-31 에 창업 질문 은행으로 바꿨다 — 이 채널이 쌓아가는 축이 글이고
 * 그 글이 답해가는 질문들이 여기라서, 슬랩의 CTA 도 /start 가 아니라
 * /thoughts 로 간다. /start 진입점은 "만든 것" 섹션 아래로 옮겼다 (app/page.tsx).
 *
 * 지키는 것 셋:
 *
 *   1. **정체성 호명 금지는 그대로다** (CLAUDE.md 1번). 질문은 전부 "우리"가
 *      주어다 — 읽는 사람을 어떤 부류로 규정하는 문장이 하나도 없어야 이 절이
 *      광고가 아니라 질문으로 읽힌다. 고칠 때 "쓰지 않을 말" 목록을 옆에 둘 것.
 *      (5번 질문의 원문 "동기부여하는"을 "움직이는"으로 바꾼 것도 그 목록 때문이다.)
 *   2. **질문은 평서형(-인가), 그 외는 존댓말.** 질문들은 저자가 하는 말이
 *      아니라 읽는 사람이 자신에게 하는 말이라 인용문의 얼굴을 한다. 예시와
 *      앞뒤 문단은 저자의 목소리라 사이트의 존댓말로 돌아온다.
 *   3. **클라이언트 JS 없음.** 접기는 네이티브 details/summary 다
 *      (components/prompt-block.tsx 와 같은 패턴). 슬랩 안에 상자를 또 앉히지
 *      않고(DESIGN.md §2 — 층은 두 겹까지) 가는 선으로만 줄을 가른다.
 *
 * 번호(01–10)를 붙인 이유: 장식이 아니라 **경로**다. 회사의 바깥(존재 이유)에서
 * 시작해 안(조직·보상)을 지나 창업자 자신(한계선)에서 끝나는 순서라, 번호가
 * "어디까지 답했나"를 세게 해준다. DESIGN.md §5 의 기록 줄과 같은 자격이다.
 */

interface QuestionItem {
  /** 질문의 이름표 — 뼈대의 소제목 (존재 이유 · 성공의 정의 …) */
  label: string;
  /** 질문 본문. 평서형 의문(-인가)으로 통일한다 */
  q: string;
  /** 구체적인 예시 하나. 숫자·장면이 들어간 문장이어야 한다 — 일반론이면 지운다 */
  ex: string;
}

interface QuestionGroup {
  title: string;
  items: readonly [QuestionItem, QuestionItem];
}

const GROUPS: readonly QuestionGroup[] = [
  {
    title: "존재 이유와 지향점",
    items: [
      {
        label: "존재 이유",
        q: "매출이나 규모 확장 말고, 이 회사가 세상에 존재해야 하는 진짜 이유는 무엇인가?",
        ex: "“우리가 내일 문을 닫으면 누가, 왜 아쉬워하는가”에 고객의 이름으로 답할 수 있으면 이유가 있는 것입니다.",
      },
      {
        label: "성공의 정의",
        q: "우리가 그리는 성공은 대규모 IPO·M&A인가, 작지만 단단한 강소기업인가, 문제 하나를 완벽히 푸는 것인가?",
        ex: "연 매출 30억의 흑자 회사가 됐다고 해봅니다. 축배인가, 정체인가 — 공동창업자와 답이 다르면 회사는 언젠가 그 자리에서 갈립니다.",
      },
    ],
  },
  {
    title: "고객과 문제 정의",
    items: [
      {
        label: "진짜 문제",
        q: "우리가 풀려는 문제는 고객이 기꺼이 지갑을 여는 진통제인가, 있으면 좋은 비타민인가?",
        ex: "고객이 이미 엑셀·단톡방·외주로 어설프게라도 풀고 있으면 진통제 쪽입니다. 아무 대안도 안 쓰고 있다면, 사실 안 아픈 것일 수 있습니다.",
      },
      {
        label: "타깃 고객",
        q: "가장 먼저 우리 제품에 열광해 줄 100명은 구체적으로 누구인가?",
        ex: "“2030 직장인”은 답이 못 됩니다. “팀원 30명을 처음 맡은 시리즈 A의 첫 인사담당자”처럼, 찾아갈 수 있는 이름이어야 합니다.",
      },
    ],
  },
  {
    title: "비즈니스 모델과 생존",
    items: [
      {
        label: "생존 전략",
        q: "제품이 시장의 선택을 받는 순간까지, 자금은 어떻게 확보하고 버틸 것인가?",
        ex: "월 고정비 500만 원에 통장 6,000만 원이면 런웨이는 12개월입니다. 그 안에 무엇이 검증돼 있어야 하는지를 거꾸로 세어봅니다.",
      },
      {
        label: "수익 구조",
        q: "사용자를 모으는 것 너머, 실제로 돈이 들어오는 논리와 계획이 있는가?",
        ex: "“일단 모으고 수익화는 나중에”는 계획이 아닙니다. 첫 결제가 언제, 누구에게서, 왜 일어나는지 한 문장으로 적어봅니다.",
      },
    ],
  },
  {
    title: "경쟁 우위와 방어막",
    items: [
      {
        label: "대체재",
        q: "고객이 지금 당장 이 문제를 해결하려고 임시방편으로 쓰는 대안은 무엇인가?",
        ex: "경쟁자는 옆 스타트업이 아니라 엑셀, 단톡방, 그리고 “그냥 참기”인 경우가 대부분입니다. 이겨야 할 상대는 그쪽입니다.",
      },
      {
        label: "우리의 무기",
        q: "자본 많은 대기업이나 발 빠른 경쟁자가 그대로 카피했을 때, 우리를 지켜줄 해자는 무엇인가?",
        ex: "“먼저 시작했다”는 해자가 아닙니다. 쓸수록 쌓이는 것 — 데이터, 갈아타는 비용, 커뮤니티 — 중 하나는 있어야 합니다.",
      },
    ],
  },
  {
    title: "인재상과 신뢰의 수준",
    items: [
      {
        label: "탁월함의 기준",
        q: "함께 일하고 싶은 동료의 최우선 조건은 뛰어난 직무 스킬인가, 문제 정의와 회고 능력인가?",
        ex: "손은 빠른데 회고가 없는 사람과, 손은 느린데 왜 틀렸는지 적어두는 사람. 다섯 명뿐인 팀이라면 누구를 뽑을 것인가로 바꿔 물으면 답이 나옵니다.",
      },
      {
        label: "신뢰의 기본값",
        q: "구성원을 스스로 움직이는 존재로 믿고 맡길 것인가, 통제와 관리가 필요한 존재로 볼 것인가?",
        ex: "출퇴근 기록, 지출 승인, 주간보고 — 처음 만드는 제도 셋을 보면, 이 질문에는 이미 답해버린 뒤입니다.",
      },
    ],
  },
  {
    title: "조직문화와 일하는 방식",
    items: [
      {
        label: "실패를 다루는 방식",
        q: "가설이 틀렸을 때 누군가에게 책임을 묻는가, 투명하게 공유하고 배움의 자산으로 기록하는가?",
        ex: "실패한 실험의 회고가 전사에 공개되는 회사와 조용히 묻히는 회사 — 같은 실수를 두 번 하는 쪽은 늘 후자입니다.",
      },
      {
        label: "소통의 투명성",
        q: "재무 상태, 런웨이, 인사 이슈 같은 민감한 정보는 어디까지, 누구에게 공유되어야 하는가?",
        ex: "런웨이가 6개월 남았다는 사실을 전원이 아는 회사와 대표만 아는 회사는, 위기 앞에서 완전히 다르게 움직입니다.",
      },
    ],
  },
  {
    title: "의사결정과 권한 위임",
    items: [
      {
        label: "충돌 해결 원칙",
        q: "동등한 위치에서 의견이 팽팽히 맞설 때, 최종 결정의 기준은 리더의 직관인가, 데이터인가, 구성원 합의인가?",
        ex: "기준을 미리 정해두지 않아도 기준은 생깁니다 — 목소리가 큰 사람입니다.",
      },
      {
        label: "위임의 범위",
        q: "예산, 채용, 제품 방향의 자율권을 어디까지 주고, 책임은 어디까지 지게 할 것인가?",
        ex: "100만 원 지출에 대표 승인이 필요한 회사인가, 담당자가 쓰고 나중에 공유하는 회사인가. 숫자 하나가 문화를 말해줍니다.",
      },
    ],
  },
  {
    title: "성과 정의와 보상 철학",
    items: [
      {
        label: "기여의 측정",
        q: "기여를 눈에 보이는 단기 결과물로만 잴 것인가, 팀에 만든 시너지와 과정까지 볼 것인가?",
        ex: "동료들의 질문을 받아주느라 자기 결과물이 적은 사람이 평가에서 몇 점을 받는지 — 그 답이 곧 우리 회사의 기준입니다.",
      },
      {
        label: "파이 나누기",
        q: "보상을 정하는 가장 큰 기준은 초기 합류의 리스크인가, 개인의 역량인가, 실제로 만든 성과인가?",
        ex: "첫 달에 합류한 평범한 사람과 3년 차에 온 뛰어난 사람의 지분 차이를, 두 사람 앞에서 설명할 수 있어야 합니다.",
      },
    ],
  },
  {
    title: "회사와 개인의 관계",
    items: [
      {
        label: "성장의 연동",
        q: "회사의 성장은 구성원 개인의 커리어, 그리고 삶의 성장과 어떻게 이어지는가?",
        ex: "“이 회사에서 2년 일하면 이력서에 어떤 줄이 생기는가”에 답할 수 있어야 합니다.",
      },
      {
        label: "헌신과 균형",
        q: "초기 특유의 압도적 몰입을 요구할 것인가, 지속 가능한 일과 삶의 균형을 전제로 설계할 것인가?",
        ex: "어느 쪽이어도 됩니다. 최악은 하나 — 채용할 때는 균형을 말하고 입사한 뒤에 몰입을 요구하는 것입니다.",
      },
    ],
  },
  {
    title: "창업자의 멘탈리티와 데드라인",
    items: [
      {
        label: "갈등 해결",
        q: "공동창업자 사이에 최악의 위기가 왔을 때, 갈등은 어떻게 풀고 지분은 어떻게 정리할 것인가?",
        ex: "베스팅(예: 4년에 1년 클리프)은 사이가 좋을 때 계약서로 만들어두는 것입니다. 나빠진 뒤에는 이미 늦었습니다.",
      },
      {
        label: "나의 한계선",
        q: "성과가 나지 않는다면 어디까지 빚지고, 언제까지 버티다, 어떻게 접을 것인가?",
        ex: "“통장에 얼마, 몇 년 몇 월까지”처럼 숫자로 적힌 한계선이 있어야 합니다. 없으면 접을 때를 반드시 놓칩니다.",
      },
    ],
  },
] as const;

export function FounderQuestions() {
  return (
    <div className="bg-iris text-on-iris rounded-card px-8 py-14 sm:px-14 sm:py-20">
      <div className="max-w-[42rem]">
        <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance">
          사업계획서부터 쓰지 마세요
        </h2>
        <p className="text-on-iris/80 mt-5 text-lg text-pretty">
          코드를 짜는 것 부터 지식노동까지 이제 AI가 더 잘하게 될겁니다. 서비스는 일주일이면 나옵니다. 그래서 창업에서
          어려운 건 만드는 일이 아니라{" "}
          <strong className="text-on-iris font-semibold">어떤 회사를 만들 것인지 답하는 일</strong>
          입니다.
        </p>
        <p className="text-on-iris/80 mt-4 text-lg text-pretty">
          창업하기 전 스스로 답을 찾아볼 질문 열 개를 적어보았습니다. 정답이 있는
          질문은 하나도 없습니다. 답이 매번 달라질 수도 있습니다. 다만 답을 적어두면, 다음 선택은 조금 더 선명해질 겁니다.
        </p>

        {/* 슬랩 안에 상자를 또 앉히지 않는다 (DESIGN.md §2 — 층은 두 겹까지).
            가는 선으로만 열 줄을 가르고, 접기는 네이티브 details 다. */}
        <ol className="border-on-iris/20 mt-10 border-t">
          {GROUPS.map((group, i) => (
            <li key={group.title} className="border-on-iris/20 border-b">
              <details className="group">
                <summary className="flex min-h-11 cursor-pointer list-none items-baseline gap-4 py-4 [&::-webkit-details-marker]:hidden">
                  <span className="text-on-iris/60 w-6 shrink-0 font-mono text-sm tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 text-[1.0625rem] font-bold tracking-[-0.01em]">
                    {group.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="text-on-iris/60 inline-block transition-transform group-open:rotate-90"
                  >
                    ▸
                  </span>
                </summary>
                <div className="space-y-6 pb-7 sm:pl-10">
                  {group.items.map((item) => (
                    <div key={item.label}>
                      <p className="text-pretty">
                        <strong className="font-semibold">{item.label} —</strong>{" "}
                        <span className="text-on-iris/90">{item.q}</span>
                      </p>
                      {/* 예시는 저자의 목소리다. 들여쓴 선 하나로 질문과 갈라
                          "예:" 같은 접두 없이도 층이 읽히게 한다. */}
                      <p className="border-on-iris/30 text-on-iris/80 mt-2.5 border-l-2 pl-4 text-[0.9375rem] text-pretty">
                        {item.ex}
                      </p>
                    </div>
                  ))}
                </div>
              </details>
            </li>
          ))}
        </ol>

        <p className="text-on-iris/80 mt-8 text-lg text-pretty">
          저도 이 질문들에 하나씩 답을 적어가는 중입니다. 정답이어서가 아니라,
          적어둔 답이 있어야 틀렸다는 걸 알게 되기 때문입니다.
        </p>
        {/* 보라 면 위에서는 밝은 알약이 가장 단단하다. 형광을 쓰지 않는 건
            그대로다 — 이 화면의 형광 한 점은 히어로의 커서다 (DESIGN.md §2). */}
        <div className="mt-7">
          <Link
            href={INTERNAL_LINKS.thoughts}
            className="bg-on-iris text-iris inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-90"
          >
            적어가는 답 읽어보기
          </Link>
        </div>
      </div>
    </div>
  );
}
