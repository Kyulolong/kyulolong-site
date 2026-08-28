import type { Metadata } from "next";
import { FilterBar, FilterRail, type FilterOption } from "@/components/filter-bar";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { filterServices, getAllTags, type SortOrder } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

/**
 * canonical 은 쿼리 없는 /services 하나다. ?tag=지도 · ?sort=recent 는
 * 같은 목록을 걸러 보여줄 뿐이라, 조합마다 다른 문서로 세어지면
 * (태그 8개 × 정렬 3개) 같은 카드 목록이 24벌로 갈린다.
 */
export const metadata: Metadata = pageMetadata({
  title: "만든 서비스",
  description:
    "인사담당 출신이 AI와 함께 만든 서비스 목록. 소스코드와 쓴 프롬프트를 같이 열어뒀고, 전부 로그인 없이 바로 열립니다.",
  path: "/services",
});

const SORTS: { value: SortOrder; label: string }[] = [
  // "대표작 먼저"는 대표작만 보여준다고 읽힌다. 실제로는 위로 올릴 뿐 전부 나온다.
  { value: "featured", label: "추천순" },
  { value: "recent", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

function isSortOrder(value: string | undefined): value is SortOrder {
  return SORTS.some((s) => s.value === value);
}

/** 현재 필터에서 한 가지만 바꾼 주소를 만든다. 나머지 조건은 유지된다. */
function hrefWith(current: { tag?: string; sort?: SortOrder }, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const next = { ...current, ...patch };
  if (next.tag) params.set("tag", next.tag);
  if (next.sort && next.sort !== "featured") params.set("sort", next.sort);
  const query = params.toString();
  return query ? `/services?${query}` : "/services";
}

export default async function ServicesPage({ searchParams }: PageProps<"/services">) {
  const params = await searchParams;
  const rawTag = typeof params.tag === "string" ? params.tag : undefined;
  const rawSort = typeof params.sort === "string" ? params.sort : undefined;
  const sort: SortOrder = isSortOrder(rawSort) ? rawSort : "featured";

  const allTags = getAllTags();
  // 없는 태그가 주소로 들어오면 필터를 걸지 않는다 — 빈 화면보다 전체 목록이 낫다.
  const tag = allTags.some((t) => t.tag === rawTag) ? rawTag : undefined;

  const services = filterServices({ tags: tag ? [tag] : undefined, sort });
  const total = filterServices().length;

  const tagOptions: FilterOption[] = [
    { label: "전체", href: hrefWith({ tag, sort }, { tag: undefined }), active: !tag, meta: total },
    ...allTags.map((t) => ({
      label: t.tag,
      href: hrefWith({ tag, sort }, { tag: t.tag }),
      active: t.tag === tag,
      meta: t.count,
    })),
  ];

  const sortOptions: FilterOption[] = SORTS.map((s) => ({
    label: s.label,
    href: hrefWith({ tag, sort }, { sort: s.value }),
    active: s.value === sort,
  }));

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <PageHeader
        eyebrow="services"
        title="만든 서비스"
        description="쓰다가 불편했던 걸 하나씩 만들었습니다. 로그인도 결제도 없고, 주소만 알면 그냥 열립니다."
      />

      <FilterRail>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <FilterBar label="태그" options={tagOptions} />
          <FilterBar label="정렬" options={sortOptions} />
        </div>
      </FilterRail>

      {services.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug}>
              {/* 최대 3열이므로 첫 행은 세 장 */}
              <ServiceCard service={service} eager={i < 3} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink-soft py-16 text-center">
          이 태그로는 아직 만든 게 없어요. 위에서 다른 태그를 눌러보세요.
        </p>
      )}
    </div>
  );
}
