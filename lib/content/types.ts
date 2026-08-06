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
 * strictObject 를 쓰는 이유: 오타난 키를 조용히 무시하지 않고 빌드 실패로 만든다.
 * 구스펙의 relatedRepos / demo 같은 키가 남아 있으면 여기서 걸린다.
 */
export const serviceFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  tagline: z.string().min(1),
  url: z.string().min(1),
  github: z.url().optional(),
  stack: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  needsAuth: z.boolean().default(false),
  publishedAt: isoDate,
  featured: z.boolean().default(false),
  // 스펙 5번: 썸네일이 없어도 깨지지 않아야 한다. 없으면 UI 가 기본 블록을 만든다.
  thumbnail: z.string().optional(),
  relatedVideos: z.array(z.string()).default([]),
});

export const videoFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  series: z.enum(SERIES),
  platform: z.array(z.enum(PLATFORMS)).min(1),
  embedUrl: z.url(),
  publishedAt: isoDate,
  thumbnail: z.string().optional(),
  relatedServices: z.array(z.string()).default([]),
});

export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>;
export type VideoFrontmatter = z.infer<typeof videoFrontmatterSchema>;

/** content/services/<slug>.mdx */
export interface Service {
  /** 파일명에서 온다. 실제 서비스 URL 이 되므로 RESERVED_PATHS 와 겹칠 수 없다. */
  slug: string;
  title: string;
  tagline: string;
  /** 같은 도메인의 경로 (예: /navigator) */
  url: string;
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
  embedUrl: string;
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
