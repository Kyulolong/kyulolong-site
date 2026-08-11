import type { Metadata } from "next";
import { FilterBar, type FilterOption } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { VideoCard } from "@/components/video-card";
import { SERIES, filterVideos } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/** ?series=… 는 같은 목록을 거른 것이라 canonical 은 /videos 하나다 (/services 와 같은 이유). */
export const metadata: Metadata = pageMetadata({
  title: "만드는 과정",
  description:
    "서비스를 만드는 과정을 그대로 남긴 인스타 릴스·유튜브 쇼츠 아카이브. 되는 장면만이 아니라 막힌 데도 같이 있습니다.",
  path: "/videos",
});

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
        description="저는 가르치는 사람이 아닙니다. 만드는 과정을 공유합니다."
      />

      <div className="border-line mb-10 border-y py-5">
        <FilterBar label="시리즈" options={options} />
      </div>

      {videos.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <li key={video.slug}>
              {/* 최대 3열이므로 첫 행은 세 장 */}
              <VideoCard video={video} eager={i < 3} />
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
