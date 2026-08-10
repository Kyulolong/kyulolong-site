import { z } from "zod";

/** 스펙 6번: 영상 시리즈 세 축 */
export const SERIES = [
  "이게 되네?",
  "이렇게 살아도 되네?",
  "커리어 인사이트",
] as const;
export type Series = (typeof SERIES)[number];

export const PLATFORMS = ["instagram", "youtube"] as const;
export type Platform = (typeof PLATFORMS)[number];

/**
 * 임베드 플레이어의 방향. 릴스·쇼츠가 기본이라 portrait 이 디폴트다.
 * 화면녹화(퍼플즈 싱크 등)는 가로라 landscape 를 명시한다.
 */
export const ORIENTATIONS = ["portrait", "landscape"] as const;
export type Orientation = (typeof ORIENTATIONS)[number];

/**
 * 스펙 5번: 매주 늘어나는 목록이라 "다음에 만들 것"도 목록의 일부다.
 * soon 은 아직 갈 곳이 없는 서비스 — 카드가 링크가 아니라 예고로 그려진다.
 */
export const SERVICE_STATUS = ["live", "soon"] as const;
export type ServiceStatus = (typeof SERVICE_STATUS)[number];

/**
 * 스펙 2번: 홈페이지가 점유하는 루트 경로.
 * 서비스 앱들은 kyulolong.com/<slug> 에 배포되므로, 서비스 슬러그가
 * 이 목록과 겹치면 실제 배포에서 경로가 충돌한다. 빌드 타임에 잡는다.
 */
export const RESERVED_PATHS = [
  "services",
  "videos",
  "about",
  "api",
  "_next",
  "static",
  "admin",
  "login",
  "blog",
] as const;

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "publishedAt 는 YYYY-MM-DD 형식이어야 합니다");

/**
 * 같은 오리진의 경로에 얹힌 서비스는 **끝 슬래시까지** 찍어서 내보낸다.
 *
 * `/navigator` 로 들어가면 그 앱 HTML 안의 상대경로 자산(`<script src="app.js">`)이
 * `/app.js` 로 풀려서 홈페이지에 떨어지고 404 난다. `/navigator/` 면 멀쩡하다.
 * 엣지(Traefik)에도 끝 슬래시 리다이렉트를 걸어두지만, 홈페이지가 내보내는 링크가
 * 처음부터 옳으면 사용자가 308 을 한 번 덜 탄다.
 *
 * MDX 에는 `/navigator` 라고 편하게 쓰고 여기서 채운다. 스펙 5번대로 서비스 추가는
 * 파일 하나여야 하는데, 끝 슬래시를 매주 손으로 기억하게 만들면 언젠가 빠뜨린다.
 */
function withTrailingSlash(url: string): string {
  // 외부 링크(iOS 앱 소개 등)와 쿼리·해시가 붙은 주소는 건드리지 않는다
  if (!url.startsWith("/") || url.includes("?") || url.includes("#")) return url;
  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * strictObject 를 쓰는 이유: 오타난 키를 조용히 무시하지 않고 빌드 실패로 만든다.
 * 구스펙의 relatedRepos / demo 같은 키가 남아 있으면 여기서 걸린다.
 */
export const serviceFrontmatterSchema = z
  .strictObject({
    title: z.string().min(1),
    tagline: z.string().min(1),
    /**
     * 아직 만들지 않은 서비스(status: soon)는 갈 곳이 없으므로 url 이 없다.
     * live 인데 url 이 없으면 아래 refine 이 빌드 실패로 잡는다.
     */
    url: z.string().min(1).transform(withTrailingSlash).optional(),
    status: z.enum(SERVICE_STATUS).default("live"),
    github: z.url().optional(),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    needsAuth: z.boolean().default(false),
    publishedAt: isoDate,
    featured: z.boolean().default(false),
    // 스펙 5번: 썸네일이 없어도 깨지지 않아야 한다. 없으면 UI 가 기본 블록을 만든다.
    thumbnail: z.string().optional(),
    relatedVideos: z.array(z.string()).default([]),
  })
  .refine((v) => v.status === "soon" || Boolean(v.url), {
    message: "url 이 없습니다. 아직 만들기 전이면 status: soon 을 넣으세요",
    path: ["url"],
  });

export const videoFrontmatterSchema = z
  .strictObject({
    title: z.string().min(1),
    series: z.enum(SERIES),
    /**
     * 인스타/유튜브 게시 현황. 아직 어느 쪽에도 안 올렸으면 빈 배열이다.
     * 억지로 하나 채우게 하면 플랫폼 필터가 거짓말을 하게 된다.
     */
    platform: z.array(z.enum(PLATFORMS)).default([]),
    /** iframe 으로 심을 수 있는 주소 (인스타/유튜브/퍼플즈 임베드) */
    embedUrl: z.url().optional(),
    /**
     * 원본이 올라가 있는 주소. embedUrl 이 없으면 새 탭 CTA 가 되고,
     * 둘 다 있으면 임베드 아래 "원본 보기" 링크로 남는다.
     */
    externalUrl: z.url().optional(),
    /** 임베드 비율. 릴스·쇼츠는 세로, 화면녹화는 가로. */
    orientation: z.enum(ORIENTATIONS).default("portrait"),
    publishedAt: isoDate,
    thumbnail: z.string().optional(),
    relatedServices: z.array(z.string()).default([]),
  })
  .refine((v) => v.embedUrl || v.externalUrl, {
    message: "embedUrl 이나 externalUrl 중 최소 하나는 있어야 합니다 (없으면 영상에 갈 곳이 없습니다)",
  });

export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>;
export type VideoFrontmatter = z.infer<typeof videoFrontmatterSchema>;

/** content/services/<slug>.mdx */
export interface Service {
  /** 파일명에서 온다. 실제 서비스 URL 이 되므로 RESERVED_PATHS 와 겹칠 수 없다. */
  slug: string;
  title: string;
  tagline: string;
  /** 같은 도메인의 경로 (예: /navigator). status 가 soon 이면 아직 없다. */
  url?: string;
  status: ServiceStatus;
  github?: string;
  stack: string[];
  tags: string[];
  /** 로그인 시 기록이 저장되는 서비스인지 (통합 계정은 홈페이지 범위 밖) */
  needsAuth: boolean;
  publishedAt: string;
  featured: boolean;
  thumbnail?: string;
  relatedVideos: string[];
  /** frontmatter 아래 MDX 본문 */
  body: string;
}

/** content/videos/<slug>.mdx */
export interface Video {
  slug: string;
  title: string;
  series: Series;
  platform: Platform[];
  /** iframe 임베드용. externalUrl 과 최소 하나는 있어야 한다. */
  embedUrl?: string;
  /** 원본 주소 — 임베드가 없으면 새 탭 CTA, 있으면 그 아래 보조 링크. */
  externalUrl?: string;
  /** 임베드 비율 (기본 portrait — 이 채널은 릴스·쇼츠가 기본이다) */
  orientation: Orientation;
  publishedAt: string;
  thumbnail?: string;
  relatedServices: string[];
  body: string;
}

/**
 * 인터페이스와 zod 스키마가 어긋나면 컴파일 에러가 나도록 묶어둔다.
 * 한쪽만 고치는 실수를 막는다.
 */
type AssertEqual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
const _serviceMatches: AssertEqual<
  ServiceFrontmatter,
  Omit<Service, "slug" | "body">
> = true;
const _videoMatches: AssertEqual<
  VideoFrontmatter,
  Omit<Video, "slug" | "body">
> = true;
void _serviceMatches;
void _videoMatches;
