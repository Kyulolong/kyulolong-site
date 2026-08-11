import type { Metadata } from "next";
import type { Service, Video } from "./content/types";

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
 * 검색 결과와 탭에 뜨는 제목.
 *
 * "규로롱" 만 두면 이름을 이미 아는 사람만 찾을 수 있다. 채널의 그 한 줄을
 * 같이 세워서 처음 보는 사람도 뭘 하는 곳인지 알게 한다 (인스타 썸네일과 같은 문구).
 */
export const SITE_TITLE = `${SITE_NAME} — 이게 되네?`;

export const SITE_DESCRIPTION =
  "인사담당 출신이 AI한테 시켜서 매주 서비스를 하나씩 만듭니다. 만든 것마다 소스코드와 쓴 프롬프트를 같이 열어뒀고, 전부 로그인 없이 열립니다.";

/**
 * 기본 공유 카드. public/og.png 는 scripts/make-og.tsx 가 만들어 커밋한 정적 파일이다.
 * 주소가 상대경로인 것은 루트 레이아웃의 metadataBase 가 절대 주소로 바꿔주기 때문이다.
 */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "규로롱 — 이게 되네? 인사담당자가 AI한테 시켜서 1시간",
} as const;

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
  // 템플릿("%s · 규로롱")이 한 번 더 걸려 "규로롱 — 이게 되네? · 규로롱" 이 된다.
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
    alternates: { canonical: path },
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
export function siteJsonLd(social: readonly string[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "ko-KR",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: SITE_NAME,
        url: SITE_URL,
        description:
          "삼성SDS에서 5년간 글로벌 인사담당자로 일하다가, 지금은 AI에게 시켜서 매주 서비스를 하나씩 만듭니다.",
        sameAs: [...social],
      },
    ],
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
    datePublished: service.publishedAt,
    inLanguage: "ko-KR",
    /**
     * 팀으로 만든 것에는 author 를 적지 않는다. 뱃지로만 구분하고 번호도 세지
     * 않는 이유(CLAUDE.md 4번)가 구조화 데이터에서 뒤집히면 안 된다 —
     * 여기서 한 사람을 저자로 박으면 검색엔진에는 그게 사실로 남는다.
     */
    ...(service.team ? {} : { author: { "@type": "Person", name: SITE_NAME, url: SITE_URL } }),
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
    author: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Person", name: SITE_NAME, url: SITE_URL },
  };
}
