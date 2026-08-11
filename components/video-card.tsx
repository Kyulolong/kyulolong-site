import Link from "next/link";
import { LikeButton } from "@/components/like-button";
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

/**
 * "ep3 · 이게 되네?" — 회차가 붙으면 아카이브가 연재물로 읽힌다.
 * 회차 없는 편도 있어서 시리즈명만 남는 경우를 기본으로 둔다.
 */
export function seriesLabel(video: Video): string {
  return video.episode ? `ep${video.episode} · ${video.series}` : video.series;
}

/**
 * ⚠️ 카드 전체가 <Link> 였는데 마지막 줄만 밖으로 뺐다 — ServiceCard 와 같은 이유다.
 * <a> 안의 <button> 은 HTML 규격 위반이고, 누르면 링크까지 같이 열린다.
 */
export function VideoCard({
  video,
  eager = false,
  likes,
}: {
  video: Video;
  /** 목록 첫 행에서만 켠다 — Thumbnail 의 eager 주석 참고 */
  eager?: boolean;
  /** 서버가 이미 아는 좋아요 수 (랜딩). 없으면 버튼이 스스로 받아온다. */
  likes?: number;
}) {
  return (
    <div className="group border-line bg-canvas hover:shadow-lift rounded-[24px] border p-3 transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5">
      <Link href={`/videos/${video.slug}`} className="block">
        <Thumbnail
          src={video.thumbnail}
          label={video.title}
          eyebrow={seriesLabel(video)}
          tone="video"
          eager={eager}
        />

        <div className="px-3 pt-5">
          <h3 className="line-clamp-2 leading-snug font-bold tracking-[-0.01em]">
            {video.title}
          </h3>
        </div>
      </Link>

      {/* 날짜 줄과 좋아요를 한 줄에 둔다 — 좋아요 때문에 카드가 길어지지 않게 */}
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-3">
        <div className="text-ink-faint flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tabular-nums">
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

        <LikeButton kind="video" slug={video.slug} initialCount={likes} className="-mr-1.5" />
      </div>
    </div>
  );
}
