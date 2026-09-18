import type { Metadata } from "next";
import type { Service, Thought, Video } from "./content/types";

/**
 * 검색엔진과 링크 미리보기(카톡·슬랙·X)가 읽는 것들의 단일 출처.
 *
 * 왜 페이지마다 안 쓰고 여기 모으나
 *   Next 의 metadata 는 **얕게** 상속된다. 자식이 `openGraph` 를 한 줄이라도
 *   정의하면 부모의 openGraph 객체가 통째로 교체된다 — og:title 만 바꾸려다
 *   og:image·og:site_name 이 조용히 사라진다. 그래서 페이지가 openGraph 를
 *   직접 쓰지 않고 pageMetadata() 한 곳에서 매번 전부 채워 내보낸다.
 *
 * 이 파일은 런타임 의존이 없다 (타입만 import). next.config.ts 가 호스트 하나를
 * 여기서 가져다 쓰기 때문에, fs 를 읽는 모듈을 여기에 물리면 설정 로드가 무거워진다.
 */

/** 서비스가 실제로 사는 호스트. www 는 next.config.ts 가 여기로 308 로 넘긴다. */
export const SITE_HOST = "kyulolong.com";
export const SITE_URL = `https://${SITE_HOST}`;

export const SITE_NAME = "규로롱";

/**
 * 검색 결과와 탭에 뜨는 제목. **태그라인 전문**이다 (2026-09-07 확정).
 *
 * "규로롱" 만 두면 이름을 이미 아는 사람만 찾을 수 있다. 채널이 무엇을 하는지
 * 한 줄로 같이 세워야 처음 보는 사람도 뭘 하는 곳인지 안다.
 *
 * **캐치프레이즈가 아니라 태그라인이 여기 온다.** 제목은 설명하는 자리고 주장하는
 * 자리가 아니다 — "회사는 사람과 일하는 방식으로 만들어집니다"는 검색 결과에서
 * 무엇을 파는 곳인지 알려주지 못한다. 그 문장은 대문 h1 이 맡는다
 * (components/hero.tsx).
 *
 * ⚠️ **`창업` 이 이 줄에서 빠졌다.** 예전 줄(`오늘의 생각이 내일의 창업으로`)에는
 * 있었고, 그게 이름을 모르는 사람이 닿는 문이었다. 지금 줄이 대신 여는 문은
 * **`AI`·`일하는 방식`** 이다. `창업` 은 히어로 눈썹 줄과 `/thoughts` 시리즈 칩에
 * 그대로 살아 있지만, **제목 태그에서는 사라졌다** — 유입이 줄면 여기부터 볼 것.
 */
export const SITE_TITLE = `${SITE_NAME} — 사람과 AI, 일하는 방식을 탐구합니다`;

/**
 * 검색 결과의 두 줄. **캐치프레이즈로 연다** — 제목이 무엇을 하는 곳인지 말했으니
 * 여기서는 무엇을 주장하는지가 다음에 온다. 뒤는 그 주장의 근거(실물)다.
 */
export const SITE_DESCRIPTION =
  "회사는 사람과 일하는 방식으로 만들어집니다. 인사팀에서 일하다 창업한 규로롱이 사람과 조직을 해석하고, 회사에서 다음 일을 준비하는 방법을 기록합니다. 직접 만든 서비스의 소스코드와 프롬프트도 열어뒀습니다.";

/**
 * 기본 공유 카드. public/og.png 는 scripts/make-og.tsx 가 만들어 커밋한 정적 파일이다.
 * 주소가 상대경로인 것은 루트 레이아웃의 metadataBase 가 절대 주소로 바꿔주기 때문이다.
 */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  // 카드에 실제로 그려진 것을 적는다 (scripts/make-og.tsx). 예전 문구
  // "인사담당자가 · 요청 한 번에 · 앱스토어까지" 는 옛 인스타 소개글이라 카드에 없다.
  alt: "규로롱 — 회사는 사람과 일하는 방식으로 만들어집니다. 사람 · 조직 · 창업",
} as const;

/**
 * 글 목록의 RSS. 네이버 서치어드바이저가 새 글을 빨리 긁어가는 입구다 (사이트맵은
 * 전체 목록, RSS 는 "방금 올라온 것"). 경로는 app/feed.xml/route.ts.
 *
 * <head> 의 `<link rel="alternate">` 로도 내보낸다. 이 값을 layout 과
 * pageMetadata() 양쪽에 싣는 이유는 openGraph 와 같다 — `alternates` 도 얕게
 * 상속돼서, 페이지가 canonical 을 적는 순간 layout 의 RSS 링크가 통째로 사라진다.
 */
export const FEED = { url: "/feed.xml", title: `${SITE_NAME} · 생각들` } as const;
export const FEED_ALTERNATE = { "application/rss+xml": [FEED] };

/**
 * 공유 카드에 쓸 수 있는 이미지인지.
 *
 * 서비스 썸네일은 SVG 다 (public/services/*.svg). 카톡·슬랙·X 는 SVG 를 og:image 로
 * 받지 않으므로, 그대로 넘기면 미리보기가 **빈칸**이 된다 — 실패가 눈에 안 띄는 종류라
 * 기본 카드로 떨어뜨리는 편이 낫다. 나중에 png/jpg 썸네일을 넣으면 자동으로 그게 쓰인다.
 */
const RASTER = /\.(png|jpe?g|webp|gif)$/i;

export function shareableImage(thumbnail?: string): string | undefined {
  return thumbnail && RASTER.test(thumbnail) ? thumbnail : undefined;
}

/**
 * MDX 본문 첫 문단을 검색 결과용 한 줄로 줄인다.
 *
 * 영상에는 tagline 같은 요약 필드가 없다. 없다고 `시리즈 · 날짜` 를 description 으로
 * 내보내면 모든 영상이 거의 같은 문장을 갖게 되고, 검색엔진은 그걸 중복으로 본다.
 * 본문 첫 줄이 이미 그 편의 요약이라 그걸 쓴다.
 */
export function summarize(body: string, limit = 150): string | undefined {
  const text = body
    .split(/\n{2,}/)[0] // 첫 문단만
    ?.replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 이미지
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // 링크는 글자만
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return undefined;
  if (text.length <= limit) return text;
  // 자를 때 단어 중간에서 끊지 않는다
  const cut = text.slice(0, limit);
  const space = cut.lastIndexOf(" ");
  return `${(space > limit * 0.6 ? cut.slice(0, space) : cut).trim()}…`;
}

interface PageMeta {
  /** 페이지 제목. 비우면 사이트 기본 제목이 그대로 쓰인다 (랜딩). */
  title?: string;
  description: string;
  /**
   * canonical 경로. **쿼리스트링은 넣지 않는다** — /services?tag=지도 는
   * 목록을 걸러 보여줄 뿐 다른 문서가 아니라서, 전부 /services 하나로 모은다.
   */
  path: string;
  /** 대표 이미지 경로. 비우면 기본 카드. shareableImage() 로 걸러서 넘길 것. */
  image?: string;
  /** 날짜가 있는 상세 페이지면 넣는다 (og:type 이 article 이 된다). */
  publishedAt?: string;
  /** 색인하지 않는다. 로그인처럼 검색에서 만나면 안 되는 페이지에만. */
  noIndex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  publishedAt,
  noIndex,
}: PageMeta): Metadata {
  // 제목이 없으면 사이트 기본 제목을 그대로 쓴다. 그냥 문자열로 주면 레이아웃의
  // 템플릿("%s · 규로롱")이 한 번 더 걸려 "규로롱 — 오늘의 생각이 … · 규로롱"
  // 이 된다 — 이름이 두 번 나온다.
  const shareTitle = title ?? { absolute: SITE_TITLE };
  /**
   * 페이지 전용 이미지에도 alt 를 붙인다. 기본 카드(OG_IMAGE)는 alt 를 갖고 있어서,
   * 안 붙이면 전용 이미지를 쓰는 페이지만 스크린리더에서 설명이 사라진다.
   * 크기(width/height)는 적지 않는다 — 페이지마다 다를 수 있고, 모르는 숫자를 적느니
   * 플랫폼이 직접 재게 두는 편이 맞다.
   */
  const images = image
    ? [{ url: image, alt: typeof shareTitle === "string" ? shareTitle : SITE_TITLE }]
    : [OG_IMAGE];

  const shared = {
    title: shareTitle,
    description,
    url: path,
    siteName: SITE_NAME,
    locale: "ko_KR",
    images,
  };

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path, types: FEED_ALTERNATE },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: publishedAt
      ? { ...shared, type: "article", publishedTime: publishedAt }
      : { ...shared, type: "website" },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** metadataBase 가 없는 자리(JSON-LD)를 위해 절대 주소로 만든다. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/**
 * 구조화 데이터 (schema.org).
 *
 * 여기에 적는 건 전부 페이지에 실제로 있는 사실이어야 한다. 특히 별점
 * (aggregateRating)은 받은 적이 없으므로 넣지 않는다 — 없는 평가를 적는 건
 * 구조화 데이터 정책 위반이고, 적발되면 리치 결과가 사이트 단위로 막힌다.
 */
const WEBSITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#person`;

/**
 * 글·서비스·영상의 저자 자리에 넣는 참조.
 *
 * 예전엔 페이지마다 `{ "@type": "Person", name, url }` 을 새로 적었다. 그러면
 * 검색엔진에게는 대문의 규로롱과 글 18편의 규로롱이 서로 다른 사람 19명이다.
 * @id 로 대문에 선언한 한 사람을 가리키게 한다. name·url 을 같이 두는 건
 * @id 를 페이지 밖까지 따라가지 않는 파서가 있어서다.
 */
const PERSON_REF = { "@type": "Person", "@id": PERSON_ID, name: SITE_NAME, url: SITE_URL };

/**
 * 대문(WebSite 옆)과 /about(ProfilePage 의 주인공)이 같은 사람을 싣는다.
 * 한 곳에서 만들어야 두 페이지의 서술이 갈라지지 않는다.
 */
function personNode(social: readonly string[]): Record<string, unknown> {
  return {
    ...PERSON_REF,
    // 도메인 · 인스타 · 깃허브가 전부 이 로마자 이름이다. 한글 이름과 같은 실체라고 묶어둔다.
    alternateName: "kyulolong",
    // 사실만 (이 파일 위 주석). 2026-09-16 본인 확인: 삼성SDS 인사팀 5년 → 스타트업 2년 → 창업.
    description:
      "삼성SDS 인사팀에서 5년, 스타트업에서 2년 일한 뒤 창업해 회사를 운영하고 있습니다. 사람과 조직, 일하는 방식에 대해 쓰고 AI로 서비스를 만듭니다.",
    // 글의 네 시리즈(THOUGHT_SERIES)와 인사 경력. 화면에 이미 있는 말만 적는다.
    knowsAbout: ["인사", "조직과 사람", "일과 성장", "AX", "창업"],
    sameAs: [...social],
  };
}

export function siteJsonLd(social: readonly string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: "kyulolong",
        description: SITE_DESCRIPTION,
        inLanguage: "ko-KR",
        publisher: { "@id": PERSON_ID },
      },
      personNode(social),
    ],
  };
}

/**
 * /about — 이 페이지가 한 사람에 대한 문서라고 밝힌다. 검색엔진은 저자 페이지를
 * 찾을 때 ProfilePage 를 본다. 글마다 걸린 저자(PERSON_REF)가 여기로 모인다.
 */
export function profilePageJsonLd(social: readonly string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    inLanguage: "ko-KR",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: personNode(social),
  };
}

/**
 * 상세 페이지의 자리 — 대문 › 목록 › 이 페이지. 세 상세 페이지 모두 화면 맨 위에
 * 목록으로 돌아가는 링크가 있어서, 여기 적는 경로는 화면에 이미 있는 길이다.
 */
export function breadcrumbJsonLd(
  items: readonly { name: string; path: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(service: Service): Record<string, unknown> {
  /**
   * 같은 오리진의 경로에 우리가 직접 올린 것인지 (/navigator 같은).
   * 앱스토어 링크나 퍼플즈처럼 남의 도메인에 사는 것은 여기서 갈린다 —
   * 우리가 값과 접근 조건을 장담할 수 있는 건 우리가 올린 것뿐이다.
   */
  const selfHosted = service.url?.startsWith("/") === true;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: service.title,
    description: service.tagline,
    // url 은 '가서 쓰는 곳', mainEntityOfPage 는 '이걸 설명하는 문서'다.
    url: absoluteUrl(service.url ?? `/services/${service.slug}`),
    mainEntityOfPage: absoluteUrl(`/services/${service.slug}`),
    applicationCategory: "UtilitiesApplication",
    ...(selfHosted ? { operatingSystem: "Web" } : {}),
    /**
     * 공유 카드와 같은 그림을 쓴다. SVG 썸네일은 shareableImage 가 걸러내므로
     * (검색엔진도 SVG 를 대표 이미지로 잘 안 받는다) 래스터가 있을 때만 적는다.
     */
    ...(() => {
      const image = shareableImage(service.ogImage ?? service.thumbnail);
      return image ? { image: absoluteUrl(image) } : {};
    })(),
    datePublished: service.publishedAt,
    inLanguage: "ko-KR",
    /**
     * 팀으로 만든 것에는 author 를 적지 않는다. 뱃지로만 구분하고 번호도 세지
     * 않는 이유(CLAUDE.md 4번)가 구조화 데이터에서 뒤집히면 안 된다 —
     * 여기서 한 사람을 저자로 박으면 검색엔진에는 그게 사실로 남는다.
     */
    ...(service.team ? {} : { author: PERSON_REF }),
    ...(service.stack.length ? { keywords: service.stack.join(", ") } : {}),
    /**
     * 우리가 올린 것은 전부 무료이고 로그인도 요구하지 않는다 (CLAUDE.md 3번).
     * 남의 도메인에 사는 것의 값은 우리가 아는 사실이 아니라 적지 않는다.
     */
    ...(selfHosted
      ? {
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: 0, priceCurrency: "KRW" },
        }
      : {}),
    ...(service.github ? { codeRepository: service.github } : {}),
  };
}

/**
 * 글 — BlogPosting.
 *
 * 서비스(SoftwareApplication)·영상(VideoObject)과 달리 값·접근조건을 적을 게
 * 없어서 훨씬 짧다. 여기서도 별점은 넣지 않는다 (이 파일 위 주석).
 *
 * dateModified 를 적지 않는다. frontmatter 에 그 필드가 없어서 적으려면
 * publishedAt 을 그대로 베껴야 하는데, 그건 "고친 적 없다"는 사실 주장이
 * 된다 — 실제로는 고치고 있다. 모르는 건 비워두는 쪽이 맞다.
 */
export function thoughtJsonLd(thought: Thought): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: thought.title,
    description: thought.summary ?? summarize(thought.body) ?? thought.title,
    datePublished: thought.publishedAt,
    inLanguage: "ko-KR",
    url: absoluteUrl(`/thoughts/${thought.slug}`),
    mainEntityOfPage: absoluteUrl(`/thoughts/${thought.slug}`),
    isPartOf: { "@id": WEBSITE_ID },
    // 글 전용 카드가 없으면 og:image 로 나가는 기본 카드를 그대로 적는다 — 공유 카드와
    // 같은 그림이라 사실이고, 이미지가 빠진 BlogPosting 은 기사 결과에서 밀린다.
    image: absoluteUrl(shareableImage(thought.ogImage) ?? OG_IMAGE.url),
    // 시리즈가 곧 이 글이 속한 갈래다. 태그는 그 아래 결이라 같이 싣는다.
    articleSection: thought.series,
    ...(thought.tags.length
      ? { keywords: [thought.series, ...thought.tags].join(", ") }
      : { keywords: thought.series }),
    author: PERSON_REF,
    publisher: PERSON_REF,
  };
}

export function videoJsonLd(video: Video): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: summarize(video.body) ?? `${video.series} · ${video.title}`,
    uploadDate: video.publishedAt,
    inLanguage: "ko-KR",
    ...(video.thumbnail ? { thumbnailUrl: absoluteUrl(video.thumbnail) } : {}),
    ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
    /**
     * url 은 이 영상을 설명하는 문서, 즉 우리 페이지다. 인스타 주소를 url 로 적으면
     * 검색엔진에게 "이 영상의 본진은 인스타"라고 말하는 셈이라 아카이브 쪽이 밀린다.
     * 원본은 sameAs 로 "같은 것"이라고만 걸어둔다.
     */
    url: absoluteUrl(`/videos/${video.slug}`),
    ...(video.externalUrl ? { sameAs: video.externalUrl } : {}),
    author: PERSON_REF,
    publisher: PERSON_REF,
  };
}
