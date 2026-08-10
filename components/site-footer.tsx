import Link from "next/link";
import { Brand } from "@/components/brand";
import { VisitorCount } from "@/components/visitor-count";
import { INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

const NAV = [
  { label: "서비스", href: INTERNAL_LINKS.services },
  { label: "영상", href: INTERNAL_LINKS.videos },
  { label: "소개", href: INTERNAL_LINKS.about },
];

export function SiteFooter() {
  return (
    <footer className="border-line mt-24 border-t sm:mt-32">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-14 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-8">
          <div>
            <Brand />
            <p className="text-ink-faint mt-3 max-w-[26rem] text-sm">
              만든 서비스와 소스코드, 만드는 과정을 남긴 영상을 모아둡니다.
            </p>
          </div>

          <div className="flex gap-12">
            <nav className="flex flex-col gap-2.5">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink-soft hover:text-ink text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <nav className="flex flex-col gap-2.5">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-ink-soft hover:text-ink text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* 방문자 수는 없을 수도 있다. 없으면 이 줄은 예전 그대로 보인다. */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-ink-faint font-mono text-xs tracking-[0.06em] opacity-70">
            kyulolong.com
          </p>
          <VisitorCount />
        </div>
      </div>
    </footer>
  );
}
