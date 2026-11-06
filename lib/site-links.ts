/**
 * 외부 채널 링크. 추가할 때 이 배열만 건드리면 푸터가 따라온다.
 *
 * 유튜브는 아직 채널 주소가 없어서 넣지 않았다. 주소가 생기면
 * { label: "유튜브", href: "..." } 한 줄만 추가하면 된다.
 */
/**
 * 아이디어 제보 창구이자 팔로우 창구라 히어로·CTA 에서 따로 쓴다.
 * SOCIAL_LINKS 안의 문자열을 재사용하면 배열 순서가 바뀔 때 조용히 깨진다.
 */
export const INSTAGRAM_URL = "https://www.instagram.com/kyulolong/";

/**
 * 퍼플즈의 내 프로필. 작업 과정이 여기에 녹화된다 — 다른 채널이 못 보여주는
 * 축이라 소셜 목록에 같이 세운다.
 *
 * 여기 걸리는 건 **내 프로필**이지 서비스가 아니다. 퍼플즈는 팀으로 만드는
 * 것이라 이 사이트의 서비스 목록에서는 뺐다 (소개 페이지도 없다).
 */
export const PERPLZ_PROFILE_URL =
  "https://perplz.com/team/kyulolong";

/**
 * 비즈니스 문의 창구. 팀임팩트(퍼플즈를 만드는 회사) 주소다.
 *
 * SOCIAL_LINKS 에 넣지 않는다 — 저쪽은 "만드는 걸 구경할 수 있는 곳"이고
 * 이건 "일 얘기를 걸 수 있는 곳"이라, 같은 줄에 세우면 둘 다 흐려진다.
 * 아이디어 제보는 여전히 인스타 DM 이다 (about 의 규칙 3번).
 */
export const BUSINESS_EMAIL = "kyulolong@teaminpact.com";

/**
 * 질문 열 개를 적어 넣을 수 있게 묶은 종이. scripts/make-questions-pdf.mjs 가
 * lib/founder-questions.ts 에서 구워 public/ 에 커밋해둔다 (og.png 와 같은 방식).
 *
 * 페이지가 아니라 정적 파일이라 INTERNAL_LINKS 에 넣지 않는다 — 저쪽은 예약
 * 경로 목록(CLAUDE.md 2번)이고 이건 그 규칙과 무관한 자산이다.
 *
 * ⚠️ **`pages` 는 화면에 그대로 나가는 숫자다** (자료실의 "PDF 12장").
 * 갈래를 더하면 종이가 늘어나는데 이 숫자는 안 따라오므로, `npm run questions` 가
 * 굽고 나서 이 값과 대조해 어긋나면 세운다. 크기를 정직하게 적는 게 이 절의
 * 전제라(CLAUDE.md 3번), 틀린 장 수는 오탈자가 아니라 그 전제를 깨는 일이다.
 *
 * 사이트 안의 입구는 자료실(app/resources/page.tsx) 하나다 — 2026-09-22 에 대문
 * 타일에서 내려왔다. 새 방향(3~15년차 직장인·작은 팀의 리더)에서는 보조 자료다.
 */
export const FOUNDER_QUESTIONS = {
  href: "/founder-questions.pdf",
  pages: 12,
} as const;

/**
 * 목표 설계 가이드 — 「작은 팀을 위한 인사」 다섯 권 중 첫째. 이메일로 보낸다
 * (app/api/guides/goal-design). 홈의 가이드 절(components/guide-paper.tsx)과
 * 자료실(components/guide-download.tsx)이 표지·파일명·장 수로 이 종이를 세운다.
 *
 * `cover` 는 `npm run guide:cover` 가 PDF 첫 장에서 찍어 커밋한 PNG 다 — 손으로
 * 만들지 않는다. `pages` 는 그 스크립트가 PDF 와 대조해 어긋나면 세운다
 * (FOUNDER_QUESTIONS 와 같은 규칙).
 *
 * `href` 는 화면에서 직접 열지 않는다 — 메일로 보내는 주소다. 페이지가 아니라 정적
 * 파일이라 INTERNAL_LINKS 에 넣지 않는다.
 */
export const GOAL_GUIDE = {
  href: "/guides/01-goal-design-guide.pdf",
  cover: "/guides/01-goal-design-guide-cover.png",
  pages: 30,
  /** 표지에 박힌 시리즈 이름과 권 번호. 홈·자료실 눈썹 줄이 그대로 읽는다 */
  series: "작은 팀을 위한 인사",
  volume: "01",
} as const;

/**
 * ⚠️ **이 배열은 구조화 데이터의 `sameAs` 로도 나간다** (app/page.tsx → siteJsonLd).
 * `sameAs` 는 "이 사람이 누구인지 가리키는 프로필 주소"라, 프로필이 아닌 것을
 * 여기 넣으면 12번의 "구조화 데이터에는 사실만 적는다"가 흐려진다. 프로필이 아닌
 * 장소(예전의 오픈채팅방)는 아래 FOOTER_CHANNELS 에서만 합류한다.
 */
const INSTAGRAM = { label: "인스타그램", href: INSTAGRAM_URL } as const;
const GITHUB = { label: "깃허브", href: "https://github.com/Kyulolong" } as const;
const PERPLZ = { label: "퍼플즈", href: PERPLZ_PROFILE_URL } as const;

export const SOCIAL_LINKS = [INSTAGRAM, GITHUB, PERPLZ] as const;

/**
 * 푸터의 '채널' 줄. 인스타그램·퍼플즈.
 *
 * 오픈채팅이 셋째 칸이었는데 2026-11-03 에 뺐다 — 방을 운영하지 않는다.
 *
 * ⚠️ **깃허브는 푸터에서 뺐다** (2026-09-16, 본인 요청). SOCIAL_LINKS 에는 남아 있어서
 * sameAs 와 /about 의 채널 버튼에는 그대로 나간다. 그래서 SOCIAL_LINKS 를 펼치지
 * 않고 하나씩 집는다 — 라벨로 filter 하면 이름을 고칠 때 조용히 다시 살아난다.
 */
export const FOOTER_CHANNELS = [INSTAGRAM, PERPLZ] as const;

/** 홈페이지 내부 경로. 스펙 2번의 예약 경로 안에서만 쓴다. */
export const INTERNAL_LINKS = {
  thoughts: "/thoughts",
  resources: "/resources",
  start: "/start",
  services: "/services",
  about: "/about",
} as const;

const THOUGHTS = { label: "생각들", href: INTERNAL_LINKS.thoughts } as const;
const RESOURCES = { label: "자료실", href: INTERNAL_LINKS.resources } as const;
const ABOUT = { label: "소개", href: INTERNAL_LINKS.about } as const;
export const PRIMARY_NAV = [THOUGHTS, RESOURCES, ABOUT] as const;
/** Proof 코칭이 셋째 칸이었다 — 2026-11-06 에 내려놓으면서 소개가 헤더 글자 링크에서 여기로 내려왔다. */
export const MOBILE_NAV = [THOUGHTS, RESOURCES, ABOUT] as const;
export const FOOTER_NAV = [
  THOUGHTS, RESOURCES, ABOUT,
  { label: "만든 것", href: INTERNAL_LINKS.services },
  { label: "직접 만들기 안내", href: INTERNAL_LINKS.start },
] as const;
