import type { Metadata } from "next";
import { FilterBar, FilterRail, type FilterOption } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { ThoughtRow } from "@/components/thought-row";
import { THOUGHT_SERIES, filterThoughts, getThoughtSeries } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/**
 * ?series=… 는 같은 목록을 거른 것이라 canonical 은 /thoughts 하나다
 * (스펙 12번 — 조합마다 다른 문서로 세어지면 목록이 여러 벌로 갈린다).
 */
export const metadata: Metadata = pageMetadata({
  title: "생각들",
  description:
    "만들면서 알게 된 것들을 적어둡니다. 조직에서 일이 어떻게 굴러가는지, 만들다 어디서 막혔는지.",
  path: "/thoughts",
});

export default async function ThoughtsPage({ searchParams }: PageProps<"/thoughts">) {
  const params = await searchParams;
  const raw = typeof params.series === "string" ? params.series : undefined;
  // 없는 시리즈가 주소로 들어오면 필터를 걸지 않는다 — 빈 화면보다 전체 목록이 낫다.
  const series = THOUGHT_SERIES.find((s) => s === raw);

  const all = filterThoughts();
  const thoughts = series ? all.filter((t) => t.series === series) : all;

  const options: FilterOption[] = [
    { label: "전체", href: "/thoughts", active: !series, meta: all.length },
    // 글이 하나도 없는 축은 칩으로 세우지 않는다 (getThoughtSeries).
    ...getThoughtSeries().map(({ series: s, count }) => ({
      label: s,
      href: `/thoughts?series=${encodeURIComponent(s)}`,
      active: s === series,
      meta: count,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      {/* 본문 폭에 맞춰 가둔다. 목록이 카드 격자가 아니라 글줄이라
          1120px 를 다 쓰면 제목 하나가 화면을 가로지른다. */}
      <div className="mx-auto max-w-[46rem]">
        <PageHeader
          eyebrow="thoughts"
          title="생각들"
          description="만들면서 알게 된 것을 적어둡니다. 정답은 아니고, 틀린 것도 그대로 둡니다."
        />

        <FilterRail>
          <FilterBar label="시리즈" options={options} />
        </FilterRail>

        {thoughts.length > 0 ? (
          <ul>
            {thoughts.map((thought) => (
              <li key={thought.slug}>
                <ThoughtRow thought={thought} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-soft py-16 text-center">
            이 시리즈는 아직 비어 있어요. 위에서 다른 시리즈를 눌러보세요.
          </p>
        )}
      </div>
    </div>
  );
}
