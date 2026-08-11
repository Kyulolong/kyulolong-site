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
    "인사담당 출신이 AI한테 시켜서 만든 서비스 목록. 소스코드와 쓴 프롬프트를 같이 열어뒀고, 전부 로그인 없이 바로 열립니다.",
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

  // 필터·정렬은 둘 다에 그대로 걸린 상태로 갈라진다 (아래 그리드 주석 참고).
  const solo = services.filter((s) => !s.team);
  const team = services.filter((s) => s.team);

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

      {solo.length > 0 ? (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {solo.map((service, i) => (
            <li key={service.slug}>
              {/* 최대 3열이므로 첫 행은 세 장 */}
              <ServiceCard service={service} eager={i < 3} />
            </li>
          ))}
        </ul>
      ) : null}

      {/*
        팀으로 만든 것은 목록을 나눠서 아래에 둔다.

        이 채널의 논지가 "혼자서 이만큼 된다"라(CLAUDE.md 4번) 같은 그리드에 섞으면
        위 목록이 하는 말이 흐려진다. 뱃지만으로는 카드 하나하나를 읽어야 구분되는데,
        목록에서 눈에 먼저 들어오는 건 뱃지가 아니라 덩어리다.

        빼지 않고 싣는 이유는 숨길 일이 아니라서다 — 구분만 하면 된다.

        위 그리드가 비어 있으면(태그로 걸러 팀 것만 남은 경우) 구분선을 그리지 않는다.
        필터 바가 이미 선으로 닫혀 있어서, 그 바로 아래 선이 하나 더 생긴다.
      */}
      {team.length > 0 ? (
        <section className={solo.length > 0 ? "border-line mt-16 border-t pt-14" : ""}>
          <h2 className="text-xl font-bold tracking-[-0.02em]">팀으로 만든 것</h2>
          <p className="text-ink-soft mt-2 max-w-[52ch] text-[0.9375rem]">
            여럿이 함께 만들고 있는 것들입니다. 위의 것들과 만든 방식이 달라서
            걸린 시간도 프롬프트도 적지 않았습니다.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {services.length === 0 ? (
        <p className="text-ink-soft py-16 text-center">
          이 태그로는 아직 만든 게 없어요. 위에서 다른 태그를 눌러보세요.
        </p>
      ) : null}
    </div>
  );
}
