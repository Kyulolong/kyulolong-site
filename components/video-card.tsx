import Link from "next/link";
import { Thumbnail } from "@/components/thumbnail";
import type { Video } from "@/lib/content";

/** 2026-08-01 -> 2026.08.01 (고정폭으로 그린다) */
function formatDate(iso: string): string {
  return iso.replaceAll("-", ".");
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      href={`/videos/${video.slug}`}
      className="group border-line hover:border-accent/40 focus-visible:border-accent/40 block rounded-xl border p-3 transition-colors"
    >
      <Thumbnail src={video.thumbnail} label={video.title} eyebrow={video.series} />

      <div className="px-1 pt-3.5 pb-1">
        <h3 className="group-hover:text-accent line-clamp-2 leading-snug font-bold break-keep transition-colors">
          {video.title}
        </h3>

        <div className="text-muted mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px]">
          <time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>
          {video.platform.length > 0 ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{video.platform.join(" / ")}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
