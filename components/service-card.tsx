import Link from "next/link";
import { Thumbnail } from "@/components/thumbnail";
import type { Service } from "@/lib/content";

/**
 * 카드는 소개 페이지(/services/<slug>)로 보낸다.
 * 실제 서비스(kyulolong.com/<slug>)로는 소개 페이지의 CTA 가 보낸다 — 스펙 3번.
 *
 * featured 를 초록 점으로 표시하지 않는다. 대표작이 서너 개면 그 점들이
 * 그리드 전체에 흩어지는데, DESIGN.md §2 가 세는 건 개수가 아니라 흩어짐이다.
 * featured 는 이미 '목록 맨 앞'이라는 형태로 드러나 있다.
 */
export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group border-line bg-canvas hover:shadow-lift block rounded-[24px] border p-3 transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5"
    >
      <Thumbnail src={service.thumbnail} label={service.title} tone="service" />

      <div className="px-3 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[1.0625rem] font-bold tracking-[-0.01em]">
            {service.title}
          </h3>
          {service.status === "soon" ? (
            <span className="bg-surface-2 text-ink-faint shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium">
              준비 중
            </span>
          ) : null}
        </div>

        <p className="text-ink-soft mt-2 line-clamp-2 text-sm leading-relaxed">
          {service.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="bg-surface-2 text-ink-faint rounded-full px-2.5 py-1 text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
