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
        {/*
          얼굴이 맨 위에 온다.

          예전엔 이 사이트의 유일한 사진이 /about 에만 있었다. 인스타에서 얼굴을
          보고 넘어오는 채널인데 대문에 사람이 없으면 두 채널이 남처럼 갈린다.

          ⚠️ **아바타 크기를 키우지 말 것.** 원본은 778×1202 세로 사진이라 크게
          깔고 싶어지는데, 375×667 에서 4:5 로 깔면 제목과 형광 버튼이 첫 화면
          밖으로 밀린다. "인물 사진이 맨 위"는 이 크기로 이미 충족된다.

          object-[50%_30%] — 얼굴이 세로 30% 지점에 있다. 정가운데로 자르면
          이마가 날아가고 랩탑만 남는다.
        */}
        <div className="flex items-center gap-3.5">
          <Image
            src="/kyulolong2.png"
            alt="랩탑 앞에 앉아 있는 규로롱"
            width={112}
            height={112}
            sizes="(min-width: 768px) 7rem, 5rem"
            className="bg-surface-2 size-20 shrink-0 rounded-full object-cover object-[50%_30%] md:size-28"
            /* 대문의 LCP 다 */
            priority
          />
          <div>
            <p className="text-[1.0625rem] font-bold tracking-[-0.02em]">규로롱</p>
            {/* 화살표 하나가 이력서 한 줄보다 많은 걸 말한다.
                §6 이 금지한 건 버튼 라벨 뒤의 장식 화살표고, 이건 문장이다. */}
            <p className="text-ink-faint mt-0.5 text-sm">인사담당자 → AX하는 창업가</p>
          </div>
        </div>

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
        <p className="text-ink-faint mt-9 font-mono text-[13px] tracking-[0.04em] sm:mt-11">
          AX · 이게 되네? · 생각소스
        </p>

        {/*
          이 한 줄이 대문의 논지다.

          ⚠️ **`내일` 과 `내 일` 의 띄어쓰기 차이는 오타가 아니라 이 문장의 전부다.**
          [내일 = tomorrow] 와 [내 일 = my work] 이 같은 소리라, 한 줄에 둘 다
          놓으면 "내일의 일"이 "내 일"이 되는 게 문장 자체로 보인다. 한쪽만 남기면
          그 순간 오타가 되므로 **둘을 반드시 같은 줄에 둔다.**

          축이 두 개 겹친다 — `내일 ↔ 오늘`(시간)과 `내일 ↔ 내 일`(같은 소리).
          인스타 소개 1행이 "내일의 창업, 오늘 시작합니다" 라 앞이 똑같다:
          릴스를 보고 넘어온 사람이 같은 사람을 만나되 같은 문장을 또 읽지는 않는다.

          예전엔 여기가 `이게 되네?` 였다. 그건 **만드는 사람의 감탄사**지 창업가의
          문장이 아니라서, 채널이 "AX하는 창업가" 로 옮겨가면서 자리가 안 맞게 됐다.
          버린 게 아니라 제자리로 내려놨다 — 바로 위 눈썹 줄에 시리즈명으로 그대로
          있고, 영상 여섯 편이 여전히 그 이름으로 묶여 있다.

          두 줄로 접히는 게 맞다. `내일의 창업,` / `오늘 내 일로` 로 갈려서
          말장난이 둘째 줄 머리에 떨어지고, 커서가 그 끝에서 깜빡인다.
        */}
        <h1 className="mt-4 text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.14] font-extrabold tracking-[-0.035em] text-balance">
          내일의 창업, 오늘 내 일로
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

            1. 출발선의 좌표 — 읽는 사람이 자기 위치를 잰다
            2. 인사이트의 출처 — 여기 뭐가 쌓이는지
            3. 가져갈 수 있다는 증거 — 읽고 끝나는 곳이 아니다

          같은 어미로 끝나는 칸이 둘만 생겨도 문장이 아니라 나열로 읽힌다.
        */}
        <p className="text-ink-soft mt-6 max-w-[38rem] text-lg text-pretty sm:text-xl">
          인사담당자로 10년, 코드는 한 줄도 못 짰습니다. 지금은 AI와 함께 만들고,
          만들면서 알게 된 것을 여기 적습니다. 걸린 시간도 쓴 프롬프트도 그대로 열어뒀어요.
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
      </div>
    </section>
  );
}
