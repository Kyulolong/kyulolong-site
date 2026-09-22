import Image from "next/image";
import Link from "next/link";
import { GOAL_GUIDE, INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 목표 설계 가이드를 **그 물건의 모양**으로 세우는 종이 한 장.
 *
 * 홈의 가이드 절(app/page.tsx)이 오른쪽 칸에 세우고, 자료실의 신청 칸
 * (components/guide-download.tsx)이 표지(GuideCover)만 빌려 쓴다.
 *
 * ── 왜 카드가 아니라 종이인가 (hero-links.tsx 에서 물려받았다, 2026-09-23)
 *
 * 대문에 흰 종이·노랑 방 타일 둘이 서던 시절(2026-09-17)에 배운 것 하나가 남았다:
 * 보라 면 카드로 두면 "사이트 안의 카드"로만 읽혀서 누르면 무엇이 열리는지를 글자로
 * 읽어야 했고, **표지가 보이는 흰 문서**로 바꾸자 눈이 먼저 알아봤다. 그 타일은
 * 창업 질문지를 가리켰고 이제 그 질문지는 자료실의 보조 자료라 타일째로 내렸지만,
 * 종이의 모양은 새 주인공(목표 가이드)이 그대로 물려받는다. 노랑 방 타일은 같이
 * 내렸다 — 오픈채팅은 아래에 제 절이 있어 같은 방 입구가 둘이 된다.
 *
 * ⚠️ **히어로 바로 아래에 세우지 않는다.** 09-17 에 정확히 그 자리에서 첫 화면의
 * 종이가 h1 보다 크게 울려 캐치프레이즈 대신 "PDF 받기"가 먼저 읽혔다. 자리는 추천 글
 * 세 줄 아래다 — 글을 본 사람이 집어 가는 물건이다.
 *
 * ⚠️ **빌려온 색은 이 파일 밖으로 가져가지 않는다** (app/globals.css `--color-paper`·
 * `--color-pdf`). 흰 종이가 다른 자리에 서면 이 종이가 종이로 안 읽힌다.
 *
 * ⚠️ **표지 그림은 손으로 만들지 않는다.** `npm run guide:cover` 가 PDF 첫 장에서
 * 찍는다 (scripts/make-guide-cover.mjs). 가이드를 다시 뽑았으면 그 명령 하나로.
 *
 * ── 글자의 역할
 *   1. 굵은 줄 — 표지에 박힌 이름 그대로. 무엇에 쓰는지는 왼쪽 h2 가 이미 말한다.
 *   2. 고정폭 줄 — 사실만. 파일 이름·장 수 (DESIGN.md §5 기록 줄). 형용사가 들어가는
 *      순간 광고가 된다. "전자책"이라 부르지 않는 것도 같은 이유다.
 *   "무료"는 이 사실 줄에 한 번만 적는다 — 홈에서 네 번 반복되던 것을 여기로 모았다.
 *   읽는 사람을 규정하는 말은 어느 줄에도 넣지 않는다 (CLAUDE.md 1번).
 *
 * ⚠️ 화살표를 붙이지 않는다 (§6). "이메일로 받기"가 이미 목적지를 말한다.
 */

/** 링크 주소에서 그대로 뗀다 — 파일 이름을 두 곳에 적어두면 언젠가 어긋난다 */
const PDF_FILENAME = GOAL_GUIDE.href.split("/").pop();

/**
 * 표지 + 뒤에 깔린 두 장. 한 장짜리 그림이 아니라 여러 장짜리 문서로 읽히게 한다.
 * 종이 모서리라 반경을 주지 않는다 (§6 반경 예산에 칸을 더하지 않는다).
 * `lift` 는 부모가 `group` 일 때 hover 로 살짝 들리는 것 — 링크 안에서만 켠다.
 */
export function GuideCover({
  width = 88,
  lift = false,
  className = "",
}: {
  width?: number;
  lift?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`relative block shrink-0 ${className}`}
      style={{ width }}
    >
      <span className="bg-paper absolute inset-0 translate-x-[6px] translate-y-[6px] ring-1 ring-black/10" />
      <span className="bg-paper absolute inset-0 translate-x-[3px] translate-y-[3px] ring-1 ring-black/10" />
      <Image
        src={GOAL_GUIDE.cover}
        alt=""
        width={565}
        height={800}
        sizes={`${width}px`}
        className={
          lift
            ? "ease-[var(--ease-calm)] relative block h-auto w-full ring-1 ring-black/10 transition-transform duration-200 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-rotate-2"
            : "relative block h-auto w-full ring-1 ring-black/10"
        }
      />
      <span className="bg-pdf absolute bottom-3 -left-2 px-1 py-0.5 text-[9px] leading-none font-bold tracking-[0.04em] text-white">
        PDF
      </span>
    </span>
  );
}

export function GuidePaper() {
  return (
    <Link
      href={`${INTERNAL_LINKS.resources}#goal-guide`}
      data-umami-event="home-guide-open"
      /* 라이트에서는 바탕도 흰색이라 그림자만으로는 종이 가장자리가 흐리다 —
         테두리 한 줄을 더한다. 다크에서는 거의 안 보이고, 안 보여도 된다.
         hover 는 2px 뜨기 (§6). 색은 바꾸지 않는다. */
      className="group bg-paper text-on-paper rounded-card ring-line-strong ease-[var(--ease-calm)] flex gap-5 p-6 shadow-[0_10px_28px_-18px_rgba(23,21,31,0.35)] ring-1 transition-transform duration-200 hover:-translate-y-0.5 sm:gap-6 sm:p-7"
    >
      <GuideCover width={96} lift className="self-start" />

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-on-paper-soft truncate font-mono text-[11px]">{PDF_FILENAME}</span>
        <span className="mt-1.5 text-[1.0625rem] leading-snug font-bold tracking-[-0.01em] text-pretty">
          목표 설계 가이드
        </span>
        <span className="text-on-paper-soft mt-1 text-[0.8125rem] leading-snug text-pretty">
          목표의 기준, KPI·OKR·MBO 의 차이, 세운 뒤의 운영
        </span>
        <span className="mt-auto flex items-center justify-between gap-3 pt-5">
          {/* 장 수는 lib/site-links.ts 에서 오고, npm run guide:cover 가 대조해 세운다 */}
          <span className="text-on-paper-soft font-mono text-[12px] tabular-nums">
            {GOAL_GUIDE.pages}장 · 무료
          </span>
          {/* 버튼처럼 보이는 라벨. 종이 전체가 링크라 실제 버튼은 아니다 — 누를 곳을
              눈에 찍어주는 자리다. 종이의 글자색을 면으로 뒤집어 쓴다. */}
          <span className="bg-on-paper text-paper shrink-0 rounded-full px-4 py-2 text-[13px] leading-none font-bold">
            이메일로 받기
          </span>
        </span>
      </span>
    </Link>
  );
}
