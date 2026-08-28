import Link from "next/link";
import { Brand } from "@/components/brand";
import { VisitorCount } from "@/components/visitor-count";
import { BUSINESS_EMAIL, INTERNAL_LINKS, PRIMARY_NAV, SOCIAL_LINKS } from "@/lib/site-links";

/** 하단 바에서 뺀 소개·시작하기가 여기서는 다 나온다 — 푸터는 전체 지도다. */
const NAV = [
  { label: "시작하기", href: INTERNAL_LINKS.start },
  ...PRIMARY_NAV,
  { label: "소개", href: INTERNAL_LINKS.about },
];

/**
 * 푸터는 **보라 띠**다 (DESIGN.md §1 — 30%).
 *
 * 이유가 둘이다.
 *   1. 이 사이트에서 가장 진한 보라 슬랩은 대문에 딱 하나뿐이라(page.tsx),
 *      그것만으로는 30% 층이 페이지마다 서지 않는다. 푸터는 **모든 페이지**에
 *      있으므로, 여기 한 겹을 깔면 보라가 사이트 전체의 구조가 된다.
 *   2. 어두운 바탕 위에서 페이지가 어디서 끝나는지가 안 보였다. 띠 하나가
 *      문서를 닫는다 — 브랜드 팔레트가 보라에 준 역할이 그대로 '메인 프레임'이다.
 *
 * ⚠️ 이 면 위에서 --ink-faint 는 4.1:1 이라 기준(4.5)을 못 넘는다. 아래 글자들이
 * 전부 --ink-soft 인 이유다 (7.4:1). 푸터라고 옅게 깔면 그대로 접근성 위반이 된다.
 */
export function SiteFooter() {
  return (
    <footer className="border-line bg-iris-wash mt-24 border-t sm:mt-32">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-14 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-8">
          <div>
            <Brand />
            <p className="text-ink-soft mt-3 max-w-[26rem] text-sm">
              만든 서비스와 소스코드, 만드는 과정을 남긴 영상을 모아둡니다.
            </p>

            {/* 라벨을 붙여 두는 이유: 주소만 있으면 "만들어달라" 요청도 여기로 온다.
                그건 인스타 DM 이 받는다 (/about 의 규칙 3번). 주소는 고정폭으로
                적는다 — 눈으로 옮겨 적는 문자열이라 l·1·I 가 갈려야 한다. */}
            <p className="text-ink-soft mt-4 text-sm">
              문의{" "}
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink inline-flex min-h-11 items-center align-middle font-mono underline underline-offset-4 transition-colors md:inline md:min-h-0"
              >
                {BUSINESS_EMAIL}
              </a>
            </p>
          </div>

          <div className="flex gap-12">
            {/* 랜드마크에 이름을 준다 — 이름 없는 nav 가 한 contentinfo 안에
                둘이면 스크린리더에서 구분이 안 된다 */}
            <nav aria-label="사이트 메뉴" className="flex flex-col md:gap-2.5">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink-soft hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors md:min-h-0"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav aria-label="채널" className="flex flex-col md:gap-2.5">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink-soft hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors md:min-h-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* 방문자 수는 없을 수도 있다. 없으면 이 줄은 예전 그대로 보인다. */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-ink-soft font-mono text-xs tracking-[0.08em]">
            kyulolong.com
          </p>
          <VisitorCount />
        </div>
      </div>
    </footer>
  );
}
