import type { Metadata } from "next";
import { FilterBar, type FilterOption } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { VideoCard } from "@/components/video-card";
import { SERIES, filterVideos } from "@/lib/content";

export const metadata: Metadata = {
  title: "영상",
  description: "만드는 과정을 남긴 인스타 릴스·유튜브 쇼츠 아카이브.",
};

export default async function VideosPage({ searchParams }: PageProps<"/videos">) {
  const params = await searchParams;
  const raw = typeof params.series === "string" ? params.series : undefined;
  // 없는 시리즈가 주소로 들어오면 필터를 걸지 않는다 — 빈 화면보다 전체 목록이 낫다.
  const series = SERIES.find((s) => s === raw);

  const all = filterVideos({ sort: "recent" });
  const videos = series ? all.filter((v) => v.series === series) : all;

  const options: FilterOption[] = [
    { label: "전체", href: "/videos", active: !series, meta: all.length },
    ...SERIES.map((s) => ({
      label: s,
      href: `/videos?series=${encodeURIComponent(s)}`,
      active: s === series,
      meta: all.filter((v) => v.series === s).length,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <PageHeader
        eyebrow="videos"
        title="만드는 과정"
        description="완성본만 올리면 '역시 되는 사람은 되네'로 끝납니다. 막혔던 데도 같이 남깁니다."
      />

      <div className="border-line mb-10 border-y py-5">
        <FilterBar label="시리즈" options={options} />
      </div>

      {videos.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <li key={video.slug}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-soft py-16 text-center">
          이 시리즈는 아직 비어 있어요. 위에서 다른 시리즈를 눌러보세요.
        </p>
      )}
    </div>
  );
}
