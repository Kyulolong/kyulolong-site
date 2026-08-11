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
    /**
     * 팀으로 만든 것. 기본값이 false 인 이유는 이 채널의 논지가
     * "혼자서 이만큼 된다"라서다 — 팀 산출물을 같은 줄에 세우면 그 논지가 흐려진다.
     * 목록에서 빼지는 않고 뱃지로 구분만 한다.
     */
    team: z.boolean().default(false),
    /**
     * MVP 가 나오기까지 걸린 시간 ("2시간" 처럼 사람이 읽는 문자열).
     * 보는 사람이 "나도 해볼 만한가"를 계산하는 유일한 숫자라 눈에 띄는 자리에 그린다.
     * 팀 프로젝트(team: true)는 혼자 만든 것과 비교가 안 되므로 비워둔다.
     */
    buildTime: z.string().optional(),
    /**
     * 이 서비스를 다시 만든다면 AI 에게 넘길 프롬프트 전문.
     * 결과물만 보여주면 "역시 되는 사람은 되네"로 끝나서, 시작점을 같이 준다.
     * YAML 블록 스칼라(`prompt: |`)로 여러 줄을 그대로 적는다.
     */
    prompt: z.string().optional(),
    publishedAt: isoDate,
    featured: z.boolean().default(false),
    // 스펙 5번: 썸네일이 없어도 깨지지 않아야 한다. 없으면 UI 가 기본 블록을 만든다.
    thumbnail: z.string().optional(),
    /**
     * 공유 카드 전용 이미지 (1200x630 안팎의 png/jpg).
     *
     * thumbnail 로 겸할 수 없어서 따로 둔다. 썸네일은 목록 격자에 들어가는 SVG
     * 일러스트이고 공유 카드는 가로로 긴 래스터다 — 카톡·슬랙·X 는 SVG 를 og:image 로
     * 받지 않는다. 썸네일을 png 로 바꾸면 사이트 그림이 같이 바뀐다.
     *
     * 대개 그 서비스 앱이 자기 것을 이미 갖고 있다 (/wave-sound/og.png 처럼).
     * 여기서 그걸 가리키면 앱과 소개 페이지가 같은 얼굴을 쓴다. 대신 그 앱에 파일이
     * 올라가기 전에 값을 적으면 카드가 빈칸이 되므로, 배포를 확인하고 적을 것.
     *
     * 비우면 shareableImage() 가 thumbnail 로 내려가고, 그것도 SVG 면 기본 카드가 뜬다.
     * withTrailingSlash 를 태우지 않는다 — 디렉터리가 아니라 파일이다.
     */
    ogImage: z.string().optional(),
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
     * 시리즈 회차. 아카이브를 연재물로 읽히게 만드는 유일한 장치라
     * "이게 되네?" 편에는 되도록 붙인다. 번호가 없는 편도 있을 수 있어 optional.
     */
    episode: z.number().int().positive().optional(),
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
    /**
     * 작업 과정 원본 (퍼플즈 싱크).
     *
     * 릴스는 1분짜리 편집본이라 "어디서 막혔는지"가 다 잘려 나간다. 그 원본이
     * 따로 있다는 게 이 채널이 다른 계정과 갈리는 지점이라(스펙 7번 브랜드),
     * externalUrl 과 같은 칸에 두지 않고 별도 필드로 세운다.
     */
    processUrl: z.url().optional(),
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
  /**
   * 작업 번호 — 몇 번째로 만든 것인가. 인스타 썸네일의 `#5` 와 같은 번호다.
   *
   * frontmatter 에 없다. publishedAt 오름차순으로 로더가 매긴다 (loader.ts).
   * 팀으로 만든 것은 이 줄을 세지 않으므로 번호가 없다.
   */
  seq?: number;
  /** 팀으로 만든 것. 뱃지로만 구분하고 목록에서 빼지는 않는다. */
  team: boolean;
  /** MVP 까지 걸린 시간 ("2시간"). 팀 프로젝트는 비운다. */
  buildTime?: string;
  /** 다시 만든다면 AI 에게 넘길 프롬프트 전문 */
  prompt?: string;
  publishedAt: string;
  featured: boolean;
  thumbnail?: string;
  /** 공유 카드 전용 래스터 이미지. 없으면 thumbnail → 사이트 기본 카드 순으로 내려간다. */
  ogImage?: string;
  relatedVideos: string[];
  /** frontmatter 아래 MDX 본문 */
  body: string;
}

/** content/videos/<slug>.mdx */
export interface Video {
  slug: string;
  title: string;
  series: Series;
  /** 시리즈 회차. 아카이브를 연재물로 읽히게 한다. */
  episode?: number;
  platform: Platform[];
  /** iframe 임베드용. externalUrl 과 최소 하나는 있어야 한다. */
  embedUrl?: string;
  /** 원본 주소 — 임베드가 없으면 새 탭 CTA, 있으면 그 아래 보조 링크. */
  externalUrl?: string;
  /** 작업 과정 원본 (퍼플즈 싱크) */
  processUrl?: string;
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
// seq 는 frontmatter 가 아니라 로더가 계산해서 붙이므로 비교에서 뺀다.
const _serviceMatches: AssertEqual<
  ServiceFrontmatter,
  Omit<Service, "slug" | "body" | "seq">
> = true;
const _videoMatches: AssertEqual<
  VideoFrontmatter,
  Omit<Video, "slug" | "body">
> = true;
void _serviceMatches;
void _videoMatches;
