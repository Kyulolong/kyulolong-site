import { z } from "zod";

/**
 * 스펙 6번: 영상 시리즈.
 *
 * 여기 적힌 것이 곧 /videos 의 필터 칩이다 — 편이 하나도 없는 축도 칩으로
 * 그려져서 "0" 이 붙는다. 안 만들기로 한 축은 목록에서 뺀다. 만들 마음이
 * 있을 때 한 줄 다시 넣으면 되고, 그 전까지 대문에 빈칸을 세워둘 이유가 없다.
 */
export const SERIES = ["이게 되네?", "커리어 인사이트"] as const;
export type Series = (typeof SERIES)[number];

/**
 * 스펙 6번: 글(생각들) 시리즈. `/thoughts` 의 필터 칩이 곧 이 목록이다.
 *
 * 영상의 SERIES 와 **합치지 않는다.** 두 축은 각자 늘어나고, "이게 되네?" 는
 * 영상 쪽에만 있다. 합쳐두면 영상 시리즈를 하나 늘릴 때 글 필터가 같이 늘어난다.
 *
 * 셋이 지도 노릇을 한다 — 인스타 프로필 3행(AX · 창업 · 조직과 사람)과 같은
 * 세 키워드다. AX 는 AI 가 일을 바꾸는 축, 창업은 만드는 일의 축, 조직과 사람은
 * 인사 10년이 본 제도의 축. 칩 옆에 설명을 붙이지 않는다 (제목이 스스로 말한다).
 * (2026-08-31 에 `이게 되네? · 생각소스` 를 이 둘로 바꿨다 — 글 100편이 쌓일
 * 기둥이라, 감탄사·재료가 아니라 프로필과 같은 키워드로 세운다.)
 */
export const THOUGHT_SERIES = ["AX", "창업", "조직과 사람"] as const;
export type ThoughtSeries = (typeof THOUGHT_SERIES)[number];

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
  "thoughts",
  "about",
  "start",
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
    /**
     * 이 서비스를 만들면서 써본 개념 (스펙 6번).
     *
     * buildTime·prompt 와 같은 자리에 있는 필드다 — 결과물만 걸어두면
     * "역시 되는 사람은 되네"로 끝나므로, 가져갈 수 있는 것을 같이 준다.
     * 프롬프트가 '어떻게 시켰나'라면 이건 '무엇을 알고 있으면 되나'다.
     *
     * ⚠️ 최대 3개는 **상한이지 목표가 아니다.** 칸이 셋이면 사람은 셋을 채우고,
     * 그 순간 "가져갈 것 하나"가 기능 목록이 된다. 기본은 하나, 정말 갈래가
     * 둘일 때 둘. 셋은 어지간해서는 쓰지 말 것.
     *
     * 첫 번째가 대표다 — 훑고 지나가는 사람은 그 하나만 읽는다.
     * 검색해서 더 알아볼 수 있게 통용되는 이름으로 적는다 (full 에 원어).
     */
    concept: z
      .array(
        z.strictObject({
          /** 개념 이름. 예: BYOK */
          name: z.string().min(1),
          /** 원어·풀이. 검색 단서가 된다. 예: Bring Your Own Key */
          full: z.string().min(1).optional(),
          /** 이 서비스에서 그게 무엇이었는지 두세 문장 */
          summary: z.string().min(1),
        }),
      )
      .min(1)
      .max(3, "개념은 3개까지입니다. 넷째가 있다면 그건 본문에 쓸 얘기입니다")
      .optional(),
    /**
     * 만들면서 보고 따라 한 곳 (영상·글·문서).
     *
     * buildTime·prompt·concept 과 같은 줄에 선 필드다. 그 셋이 "얼마나 걸리나 ·
     * 어떻게 시키나 · 무엇을 알고 있으면 되나"에 답한다면, 이건 **"그건 어디서
     * 봤나"**에 답한다. 혼자 알아낸 것처럼 적어두면 "역시 되는 사람은 되네"로
     * 끝나는 게 이 채널의 전제라, 출처를 지우지 않는 쪽이 논지에 맞다.
     *
     * 제목은 손으로 적는다. 링크만 있으면 목록이 주소 셋으로 보이고, 무엇을
     * 참고했는지는 눌러봐야 알게 된다. 원문 제목 그대로 적을 것 — 번역하면
     * 그 제목으로 검색해서 찾아갈 수 없다.
     */
    references: z
      .array(
        z.strictObject({
          /** 원문 제목 그대로 */
          title: z.string().min(1),
          url: z.url(),
        }),
      )
      .default([]),
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
    /**
     * iframe 으로 심을 수 있는 주소 (유튜브 등).
     *
     * ⚠️ 인스타 게시물에는 채우지 말 것. `/embed/` 를 붙이면 심기는 게 맞지만,
     * 로그아웃 상태로 판정된 요청에는 임베드 대신 로그인 셸이 `x-frame-options:
     * DENY` 와 함께 돌아와서 브라우저가 iframe 을 통째로 막는다. iframe 은
     * 서드파티 컨텍스트라 인스타 쿠키가 안 실리는 게 기본이고, IP 단위 rate
     * limit 도 걸린다 — 즉 되는 날과 안 되는 날이 갈린다. 남의 응답 헤더라
     * 이쪽에서 손댈 데가 없고, 실패가 회색 상자로 조용히 남아서 더 나쁘다.
     * 인스타 편은 externalUrl 만 채워 새 탭 CTA 로 보낸다.
     */
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

/**
 * content/thoughts/<slug>.mdx — 글.
 *
 * ⚠️ 필드가 서비스보다 훨씬 적은 게 의도다. 서비스 쪽이 buildTime·prompt·concept 로
 * 무거운 건 그게 "0부터 시작하지 마세요"의 실물이라서인데, 글에 같은 무게를 얹으면
 * 쓰기 전에 채울 칸부터 보게 되고 결국 안 쓰게 된다. 글은 title·series·publishedAt
 * 셋이면 선다. 새 필드를 더하고 싶을 때 이 문단을 먼저 읽을 것.
 *
 * 썸네일 필드도 두지 않는다 (스펙 5번) — 매주 이미지를 손으로 만들어야 하면
 * 그 부담 때문에 등록을 미루게 된다. 목록은 제목·시리즈·날짜·읽는 시간으로 선다.
 */
export const thoughtFrontmatterSchema = z.strictObject({
  title: z.string().min(1),
  /**
   * 목록에 걸리는 한 줄. 비우면 본문 첫 문단에서 summarize() 가 만들어낸다 —
   * 없어도 목록이 안 깨지는 게 중요해서 optional 이다.
   */
  summary: z.string().optional(),
  series: z.enum(THOUGHT_SERIES),
  tags: z.array(z.string()).default([]),
  publishedAt: isoDate,
  /**
   * 목록 맨 위 고정. byFeaturedThenRecent 가 이미 그 일을 한다.
   * 이 채널에서는 "이 섹션이 무엇인지 설명하는 글"을 세우는 데 쓴다.
   */
  featured: z.boolean().default(false),
  /**
   * 글이 인용하는 서비스. **단방향이다** — 서비스 MDX 에 되받는 필드가 없다.
   * 이유는 validate.ts 상단 주석에 적어뒀다.
   */
  relatedServices: z.array(z.string()).default([]),
  /** 공유 카드 전용 래스터. 없으면 사이트 기본 카드로 떨어진다. */
  ogImage: z.string().optional(),
});

export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>;
export type VideoFrontmatter = z.infer<typeof videoFrontmatterSchema>;
export type ThoughtFrontmatter = z.infer<typeof thoughtFrontmatterSchema>;

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
  /**
   * 만들면서 써본 개념 — 프롬프트가 '어떻게'라면 이건 '무엇을 알면 되나'다.
   * 1~3개, 첫 번째가 대표. 기본은 하나다 (스키마 주석 참고).
   */
  concept?: { name: string; full?: string; summary: string }[];
  /** 만들면서 보고 따라 한 곳 — '그건 어디서 봤나'에 답한다 (스키마 주석 참고) */
  references: { title: string; url: string }[];
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

/** content/thoughts/<slug>.mdx */
export interface Thought {
  slug: string;
  title: string;
  /** 목록의 한 줄. 없으면 본문에서 뽑는다. */
  summary?: string;
  series: ThoughtSeries;
  tags: string[];
  publishedAt: string;
  /** 목록 맨 위 고정 */
  featured: boolean;
  /** 글이 인용하는 서비스 (단방향) */
  relatedServices: string[];
  ogImage?: string;
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
const _thoughtMatches: AssertEqual<
  ThoughtFrontmatter,
  Omit<Thought, "slug" | "body">
> = true;
void _serviceMatches;
void _videoMatches;
void _thoughtMatches;
