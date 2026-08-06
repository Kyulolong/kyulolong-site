import Link from "next/link";
import { Thumbnail } from "@/components/thumbnail";
import type { Service } from "@/lib/content";

/**
 * 카드는 소개 페이지(/services/<slug>)로 보낸다.
 * 실제 서비스(kyulolong.com/<slug>)로는 소개 페이지의 CTA 가 보낸다 — 스펙 3번.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group border-line hover:border-accent/40 focus-visible:border-accent/40 block rounded-xl border p-3 transition-colors"
    >
      <Thumbnail src={service.thumbnail} label={service.title} />

      <div className="px-1 pt-3.5 pb-1">
        <div className="flex items-center gap-2">
          {service.featured ? (
            <span className="bg-accent size-1.5 shrink-0 rounded-full" aria-label="대표작" />
          ) : null}
          <h3 className="group-hover:text-accent truncate font-bold transition-colors">
            {service.title}
          </h3>
        </div>

        <p className="text-muted mt-1.5 line-clamp-2 text-sm leading-relaxed break-keep">
          {service.tagline}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className="text-muted/80 font-mono text-[11px]">{service.url}</span>
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="border-line text-muted rounded-full border px-2 py-0.5 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
