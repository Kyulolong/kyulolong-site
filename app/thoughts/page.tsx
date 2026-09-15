import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar, FilterRail, type FilterOption } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { ThoughtRow } from "@/components/thought-row";
import { ThoughtSearch } from "@/components/thought-search";
import {
  THOUGHT_SERIES,
  filterThoughts,
  getThoughtSeries,
  normalizeQuery,
  queryTerms,
  searchThoughts,
  thoughtsHref,
} from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/**
 * ?series=… · ?q=… 는 같은 목록을 거른 것이라 canonical 은 /thoughts 하나다
 * (스펙 12번 — 조합마다 다른 문서로 세어지면 목록이 여러 벌로 갈린다).
 */
export const metadata: Metadata = pageMetadata({
  title: "생각들",
  description:
    "직장인·인사전문가·창업가의 시선으로 사람과 조직을 이해하고, 회사에서 다음 일을 준비하는 방법을 이야기합니다.",
  path: "/thoughts",
});

export default async function ThoughtsPage({ searchParams }: PageProps<"/thoughts">) {
  const params = await searchParams;
  const raw = typeof params.series === "string" ? params.series : undefined;
  // 없는 시리즈가 주소로 들어오면 필터를 걸지 않는다 — 빈 화면보다 전체 목록이 낫다.
  const series = THOUGHT_SERIES.find((s) => s === raw);
  const query = normalizeQuery(typeof params.q === "string" ? params.q : undefined);
  const terms = queryTerms(query);

  // 검색은 시리즈보다 먼저, 전체에 건다. 칩 숫자가 "이 검색어로 그 시리즈에 몇 편"을
  // 말해야 해서다 — 지금 시리즈에 없으면 어느 칩으로 가면 되는지가 숫자로 보인다.
  const matched = searchThoughts(filterThoughts(), terms);
  const hits = series ? matched.filter((h) => h.thought.series === series) : matched;

  const options: FilterOption[] = [
    { label: "전체", href: thoughtsHref({ query }), active: !series, meta: matched.length },
    // 글이 하나도 없는 축은 칩으로 세우지 않는다 (getThoughtSeries).
    // 검색 중에 0 이 된 축은 그대로 둔다 — 칩이 들락거리면 늘 누르던 자리가 밀린다.
    ...getThoughtSeries().map(({ series: s }) => ({
      label: s,
      href: thoughtsHref({ series: s, query }),
      active: s === series,
      meta: matched.filter((h) => h.thought.series === s).length,
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
          description="사람과 조직을 이해하고, 회사에서 다음 일을 준비합니다."
        />

        <FilterRail>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <FilterBar label="시리즈" options={options} />
            <ThoughtSearch query={query} series={series} />
          </div>
        </FilterRail>

        {/* 결과 줄은 검색할 때만 채운다. 자리는 늘 두어야 스크린리더가 바뀐 숫자를 읽는다. */}
        <div role="status">
          {terms.length > 0 && hits.length > 0 ? (
            <p className="text-ink-soft text-sm">
              <span className="text-ink font-semibold">‘{query}’</span> 검색 결과{" "}
              <span className="font-mono tabular-nums">{hits.length}</span>편
            </p>
          ) : null}
        </div>

        {hits.length > 0 ? (
          <ul>
            {hits.map(({ thought, excerpt }) => (
              <li key={thought.slug}>
                <ThoughtRow thought={thought} terms={terms} excerpt={excerpt} />
              </li>
            ))}
          </ul>
        ) : terms.length === 0 ? (
          <p className="text-ink-soft py-16 text-center">
            이 시리즈는 아직 비어 있어요. 위에서 다른 시리즈를 눌러보세요.
          </p>
        ) : (
          <div className="py-16 text-center">
            <p className="text-ink-soft">
              {matched.length > 0 && series
                ? `이 시리즈에는 ‘${query}’ 검색 결과가 없어요.`
                : `‘${query}’ 검색 결과가 아직 없어요.`}
              {/* 낱말이 여럿이면 전부 들어간 글만 나온다 — 줄이면 넓어진다는 걸 알려준다 */}
              {matched.length === 0 && terms.length > 1 ? (
                <>
                  <br />
                  낱말을 줄이면 더 넓게 찾아요.
                </>
              ) : null}
            </p>
            <Link
              href={matched.length > 0 && series ? thoughtsHref({ query }) : "/thoughts"}
              className="text-ink-soft hover:text-ink decoration-line-strong hover:decoration-ink mt-4 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-[6px] transition-colors md:min-h-0"
            >
              {matched.length > 0 && series ? "전체에서 찾기" : "전체 글 보기"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
