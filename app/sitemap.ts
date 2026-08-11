import type { MetadataRoute } from "next";
import { getServices, getVideos } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/**
 * https://kyulolong.com/sitemap.xml
 *
 * 여기에 **서비스 앱 자체**(/navigator/, /prompt/ …)도 같이 싣는다.
 *
 * 그 앱들은 별도 레포·별도 컨테이너지만 같은 오리진의 경로에 얹혀 있고
 * (CLAUDE.md 2번), 오리진 루트를 서빙하는 건 이 홈페이지뿐이라 sitemap 과
 * robots.txt 를 놓을 수 있는 자리도 여기 하나다. 여기서 빼면 그 앱들은
 * 어디에서도 목록에 오르지 못한다 — 홈페이지 링크를 타고 발견되기만 기다리게 된다.
 *
 * 훗날 앱이 자기 sitemap 을 갖게 되면(예: /navigator/sitemap.xml) 그때는
 * 여기서 URL 을 빼고 app/robots.ts 의 sitemap 목록에 그 주소를 더하는 게 맞다.
 *
 * ⚠️ 주소 끝의 슬래시를 임의로 떼지 말 것. loader 가 `/navigator` 를
 *    `/navigator/` 로 채워서 내보내고(lib/content/types.ts), 홈페이지의 링크도
 *    그 형태다. 사이트맵만 다른 형태로 적으면 같은 문서가 둘로 세어진다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const services = getServices();
  const videos = getVideos();

  // 목록·랜딩의 lastmod 는 "가장 최근에 올린 콘텐츠" 날짜다. 새 서비스를 올리면
  // 목록 페이지도 실제로 바뀌므로, 크롤러에게 다시 와야 할 이유를 알려주는 값이다.
  const latest = (dates: string[]) => dates.slice().sort().at(-1);
  const lastService = latest(services.map((s) => s.publishedAt));
  const lastVideo = latest(videos.map((v) => v.publishedAt));
  const lastAny = latest([lastService, lastVideo].filter((d): d is string => Boolean(d)));

  return [
    { url: absoluteUrl("/"), lastModified: lastAny, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/services"),
      lastModified: lastService,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/videos"),
      lastModified: lastVideo,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },

    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified: service.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),

    // 실제로 도는 앱들. 아직 주소가 없는 것(status: soon)과 외부 스토어 링크는 뺀다.
    // 이 사이트 자신(url 이 "/")도 뺀다 — 여기서 세는 건 '별도 컨테이너에 도는
    // 남의 앱'이고, 루트는 이미 맨 위에 한 번 실려 있다. 안 빼면 같은 주소가
    // changeFrequency·priority 만 다른 채로 두 번 나간다.
    ...services
      .filter((s) => s.status === "live" && s.url?.startsWith("/") && s.url !== "/")
      .map((service) => ({
        url: absoluteUrl(service.url as string),
        lastModified: service.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),

    ...videos.map((video) => ({
      url: absoluteUrl(`/videos/${video.slug}`),
      lastModified: video.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
