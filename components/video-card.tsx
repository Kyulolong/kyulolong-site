import Link from "next/link";
import { Thumbnail } from "@/components/thumbnail";
import type { Video } from "@/lib/content";

/** 2026-08-01 -> 2026.08.01 (고정폭으로 그린다) */
export function formatDate(iso: string): string {
  return iso.replaceAll("-", ".");
}

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "인스타그램",
  youtube: "유튜브",
};

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group border-line bg-canvas hover:shadow-lift block rounded-[24px] border p-3 transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5"
    >
      <Thumbnail
        src={video.thumbnail}
        label={video.title}
        eyebrow={video.series}
        tone="video"
      />

      <div className="px-3 pt-5 pb-3">
        <h3 className="line-clamp-2 leading-snug font-bold tracking-[-0.01em]">
          {video.title}
        </h3>

        <div className="text-ink-faint mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tabular-nums">
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
          {video.platform.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-sans">
                {video.platform.map((p) => PLATFORM_LABEL[p] ?? p).join(" / ")}
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
