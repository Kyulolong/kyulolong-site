import Image from "next/image";
import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 랜딩 히어로 (DESIGN.md §8).
 *
 * 이 화면의 형광 한 점은 "생각들 읽기" 버튼 하나다. 그래서 헤더에도, 하단
 * 네비에도, 보조 링크에도 형광이 없다. 눈이 갈 곳을 하나만 남긴다.
 *
 * ⚠️ **여기서 누구를 위한 사이트인지 말하지 않는다.**
 * 대문은 문을 두 개 열어둘 뿐이다 — 글(왜 이렇게 되는가)과 만든 것(어떻게
 * 시작하는가). 읽는 사람이 스스로 자기 문을 고른다. "예비 창업자를 위한",
 * "취준생이라면" 같은 호명은 나머지 절반을 내쫓고, 남은 절반에게도 광고로
 * 읽힌다. 이건 취향이 아니라 §9(절대 다그치지 않는다)의 연장이다.
 *
 * 통계 줄은 두지 않는다. 숫자를 세 개 세워두면 눈이 CTA 아래로 한 번 더
 * 끌려가서 "한 화면 한 액션"(§1)이 아니게 되고, 무엇보다 실적 자랑으로 읽혀서
 * 아래 세 문장이 하려는 일과 정반대가 된다.
 *
 * ⚠️ 가운데 정렬이 아니다. 아래 목록과 **왼쪽 끝을 맞춘다** — 그래서 바깥
 * 컨테이너가 섹션들과 같은 max-w-[1120px] 다. 가운데로 세우면 히어로만 다른
 * 축에 떠 있게 되고, 알약 라벨·큰 제목·버튼 두 개가 세로로 쌓인 그 형태는
 * 어느 사이트에나 있는 모양이라 이 채널의 얼굴이 되지 못한다.
 */
export function Hero() {
  return (
    /* 아래 여백은 다음 섹션의 py 가 만든다. 둘 다 넉넉히 주면 히어로와 목록
       사이에 화면 반 개짜리 빈 칸이 생겨서, 넓은 게 아니라 끊긴 것처럼 보인다. */
    <section className="mx-auto w-full max-w-[1120px] px-6 pt-14 pb-4 sm:px-8 sm:pt-24 sm:pb-6">
      <div className="max-w-[46rem]">
        {/* 세 키워드가 처음 닿는 자리. 인스타 썸네일·소개글에 박혀 있는 말들이라
            릴스를 보고 넘어온 사람이 같은 얼굴을 만난다.

            ⚠️ scripts/make-og.tsx 에 같은 문구가 박혀 있다. 여기를 고치면
            거기도 고치고 `npm run og` 를 다시 돌릴 것.

            알약을 씌우지 않는다 (§6) — 못 누르는 라벨에 상자를 씌우면 버튼으로
            보이고, 이 화면에서 누를 것은 아래 하나여야 한다.

            **이 줄이 사이트 등뼈(기록 줄)의 첫 등장이다.** 아래 목록의 작업
            번호·걸린 시간·날짜가 전부 같은 얼굴로 나와서, 페이지가 진열장이
            아니라 누가 세면서 쌓아온 기록으로 읽힌다. 예전엔 고정폭을 못 썼는데
            (스택에 한글이 없어서 이 줄만 시스템 폰트로 떨어졌다) 이제 --font-mono
            안에 Pretendard 가 있어서 한글도 본문과 같은 얼굴로 앉는다. */}
        <p className="text-ink-faint font-mono text-[13px] tracking-[0.04em]">
          AX · 창업 · 조직과 사람
        </p>

        {/*
          이 한 줄이 대문의 논지다.

          `오늘 → 내일`(시간)과 `생각 → 창업`(변환)이 한 줄에서 교차한다. 이 사이트의
          구조가 그대로 문장이 된 것이다 — 대문에서 글이 서비스보다 위에 오는 이유가
          "쌓이는 건 생각이고 만든 것은 그 증거"라서인데(app/page.tsx), 이 줄이 그
          순서를 먼저 말한다. 그래서 아래 첫 섹션이 "생각들"인 게 자연스럽게 읽힌다.

          ⚠️ **주어가 '생각'이지 '나'가 아니다.** "제가 창업합니다"로 고쳐 쓰고 싶어지면
          그 순간 이 줄이 자기소개가 되고, 읽는 사람이 자기 자리를 못 찾는다.

          예전엔 여기가 `이게 되네?` 였다. 그건 **만드는 사람의 감탄사**지 창업가의
          문장이 아니라서, 채널이 "AX하는 창업가" 로 옮겨가면서 자리가 안 맞게 됐다.
          버린 게 아니라 제자리로 내려놨다 — 시리즈명으로 그대로 있고, 영상 여섯 편이
          여전히 그 이름으로 묶여 있다.
        */}
        <h1 className="mt-4 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.14] font-extrabold tracking-[-0.035em] text-balance">
          오늘의 생각이 내일의 창업으로
          {/*
            **이 화면의 형광 한 점이다 (§2). 그리고 이 페이지에서 움직이는 유일한 것.**

            형광이 액션(아래 버튼)이 아니라 말에 붙었다. 어두운 바탕에서 형광
            버튼은 14.79:1 이라 너무 크게 울려서 제목을 눌러버리는데, 이 화면이
            하려는 말은 버튼이 아니라 이 다섯 글자다. 그래서 형광을 제목에 주고
            버튼은 보라로 내렸다 (DESIGN.md §7).

            물음표 뒤에서 다음 줄을 기다리는 커서다 — 방금 타이핑됐고, 아직
            안 끝났다는 표시. 브랜드 팔레트가 형광에 배정한 세 용도 중 하나가
            그대로 '커서'다.

            steps(1) 이라 페이드가 아니라 딱 켜지고 딱 꺼진다. 페이드로 만들면
            번져서 글로우처럼 보이고, 그건 §2 가 금지한 것이다.

            motion-safe: 를 쓰는 이유는 전역 reduced-motion 규칙이 duration 만
            0.01ms 로 줄이기 때문이다 — 그러면 멈추는 게 아니라 안 보이게 깜빡인다.
            여기서는 아예 애니메이션을 안 걸어서 켜진 채로 둔다.
          */}
          <span
            aria-hidden="true"
            className="bg-acid ml-[0.12em] inline-block h-[0.74em] w-[0.16em] translate-y-[0.04em] align-baseline motion-safe:animate-[caret-blink_1.6s_steps(1,end)_infinite]"
          />
        </h1>

        {/*
          세 문장이 각각 다른 일을 한다. 고칠 때 이 역할부터 볼 것.

            1. 믿음 — 이 채널이 무엇을 자산으로 보는가
            2. 자격 — 그 말을 할 수 있는 자리에 있는가 (만들고·사업하고·생각한다)
            3. 약속 — 그래서 여기 무엇이 쌓이는가

          2번을 빼면 1번이 그냥 좋은 말이 되고 3번이 근거를 잃는다. 셋 중 하나만
          남겨야 한다면 2번이다.

          같은 어미로 끝나는 칸이 둘만 생겨도 문장이 아니라 나열로 읽힌다.
        */}
        <p className="text-ink-soft mt-6 max-w-[38rem] text-lg text-pretty sm:text-xl">
          창업자에게 가장 중요한 자산은 자기만의 생각이라고 믿습니다. AI 전환의
          한가운데에서 직접 만들고, 사업하고, 생각합니다. AX를 하는 사업자가 무엇을
          보고, 무엇을 고민하며, 어디로 향하는지 기록합니다.
        </p>

        {/* 버튼은 하나다 (§8).

            ⚠️ **형광이 아니라 보라다.** 이 화면의 형광 한 점은 위의 커서가
            가져갔다. 어두운 바탕에서 형광 알약은 제목보다 크게 울려서, 대문이
            하려는 말("왜 이걸 하나")보다 이동 버튼이 먼저 읽히게 만든다.
            보라는 면으로 쓰면 충분히 단단하고(글자 대비 6.01:1), 무엇보다
            이 층이 30%를 실제로 채워야 화면이 검정+형광 두 겹으로 안 떨어진다.

            소개는 하단 바에서 뺐으므로 아래 밑줄 링크가 그 창구다. */}
        <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href={INTERNAL_LINKS.thoughts}
            className="bg-iris text-on-iris hover:bg-iris-press inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors duration-200"
          >
            생각들 읽기
          </Link>
          <Link
            href={INTERNAL_LINKS.about}
            className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink inline-flex min-h-11 items-center text-[0.9375rem] font-medium underline underline-offset-[6px] transition-colors"
          >
            소개 더 보기
          </Link>
        </div>

        {/*
          얼굴이 맨 아래로 내려왔다. **서명(落款)의 자리다.**

          위에서 주장을 먼저 하고 "누가 하는 말인지"를 뒤에서 밝히는 순서다. 얼굴이
          맨 위에 있으면 대문이 자기소개로 시작하는데, 이 페이지가 먼저 해야 할 말은
          위의 한 줄이다. 그래도 대문에서 사람을 빼지는 않는다 — 인스타에서 얼굴을
          보고 넘어오는 채널이라 대문에 사람이 없으면 두 채널이 남처럼 갈린다.

          이름을 적지 않는다. 헤더의 워드마크가 이미 "규로롱"이고, 여기서 한 번 더
          쓰면 한 화면에 이름이 둘이 된다. 남는 한 줄은 **직함**이라 서명이 된다.

          object-[50%_30%] — 얼굴이 세로 30% 지점에 있다. 정가운데로 자르면
          이마가 날아가고 랩탑만 남는다.

          ⚠️ priority 를 떼었다. 맨 위에 있을 때는 이 사진이 대문의 LCP 였지만
          이제 LCP 는 위의 h1 텍스트다. 작은 사진에 priority 를 남겨두면 그 요청이
          정작 먼저 그려져야 할 것과 대역폭을 다툰다.
        */}
        <div className="mt-14 flex items-center gap-3.5 sm:mt-16">
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
      </div>
    </section>
  );
}
