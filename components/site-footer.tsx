import Link from "next/link";
import { INTERNAL_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

export function SiteFooter() {
  return (
    <footer className="border-line mt-auto border-t">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-12">
        <Link
          href={INTERNAL_LINKS.about}
          className="hover:text-accent inline-flex items-center gap-1.5 font-bold transition-colors"
        >
          왜 이걸 만드나
          <span aria-hidden="true">→</span>
        </Link>

        <nav className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer noopener"
              className="text-muted hover:text-accent text-sm transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <p className="text-muted/60 mt-8 font-mono text-xs">kyulolong.com</p>
      </div>
    </footer>
  );
}
