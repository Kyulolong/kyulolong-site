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
export function ServiceCard({
  service,
  eager = false,
}: {
  service: Service;
  /** 목록 첫 행에서만 켠다 — Thumbnail 의 eager 주석 참고 */
  eager?: boolean;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group border-line bg-canvas hover:shadow-lift block rounded-[24px] border p-3 transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5"
    >
      <Thumbnail
        src={service.thumbnail}
        label={service.title}
        tone="service"
        eager={eager}
      />

      <div className="px-3 pt-5 pb-3">
        <div className="flex items-center gap-2">
          {/* 인스타 썸네일의 `#5` 와 같은 번호. 목록이 60개가 돼도 "몇 번째"가
              보이면 아카이브가 아니라 쌓여가는 연재물로 읽힌다. */}
          {service.seq ? (
            <span className="text-ink-faint shrink-0 font-mono text-sm tabular-nums">
              #{service.seq}
            </span>
          ) : null}
          <h3 className="truncate text-[1.0625rem] font-bold tracking-[-0.01em]">
            {service.title}
          </h3>
          {service.status === "soon" ? (
            <span className="bg-surface-2 text-ink-faint shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium">
              준비 중
            </span>
          ) : null}
          {service.team ? (
            <span className="bg-paper-sky text-ink-soft shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium">
              팀
            </span>
          ) : null}
        </div>

        <p className="text-ink-soft mt-2 line-clamp-2 text-sm leading-relaxed">
          {service.tagline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {/* 걸린 시간을 태그보다 앞에 세운다. 목록에서 "나도 해볼 만한가"를
              판단하게 만드는 건 태그가 아니라 이 숫자다. */}
          {service.buildTime ? (
            <span className="text-ink-soft border-line rounded-full border px-2.5 py-1 font-mono text-[11px] tabular-nums">
              {service.buildTime}
            </span>
          ) : null}
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
