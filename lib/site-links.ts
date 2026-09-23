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
 * 카카오톡 오픈채팅. 글과 자료를 적용하며 생긴 질문과 경험을 나누는 방이다.
 * 홈·자료실·관련 글·가이드 신청 완료 화면·푸터에서 같은 주소와 코드를 쓴다.
 *
 * **입장코드를 숨기지 않는다.** 코드는 봇을 거르는 문턱이지 사람을 거르는
 * 장치가 아니라, 감춰서 얻는 게 없다. 채널 추가나 DM 을 조건으로 걸지 않는
 * 것도 같은 이유다 — 11번의 "로그인은 문이 아니라 덤"이 여기까지 이어진다.
 *
 * ⚠️ 방 제목·설명에서는 상대를 불러도 된다. 카카오 안의 문패는 그 방을 찾는
 * 사람이 읽는 것이고, 이 사이트의 목소리(CLAUDE.md 1번 "쓰지 않을 말")는
 * 여기 적히는 라벨과 슬랩의 문장까지다.
 */
export const KAKAO_OPENCHAT = {
  /** 푸터 '채널' 줄에 서는 이름. 그 칸은 플랫폼 목록이라 플랫폼 이름으로 적는다 */
  label: "오픈채팅",
  /** 홈·자료실의 공통 소개는 components/community-invitation.tsx. 화면 문구도 거기 있다 */
  href: "https://open.kakao.com/o/gygwZpMi",
  /** 입장할 때 치는 숫자. 고정폭으로 적는다 — 눈으로 옮겨 적는 문자열이다 */
  code: "2609",
} as const;

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
 * 여기 넣으면 12번의 "구조화 데이터에는 사실만 적는다"가 흐려진다. 오픈채팅방은
 * 프로필이 아니라 장소라서 아래 FOOTER_CHANNELS 에서만 합류한다.
 */
const INSTAGRAM = { label: "인스타그램", href: INSTAGRAM_URL } as const;
const GITHUB = { label: "깃허브", href: "https://github.com/Kyulolong" } as const;
const PERPLZ = { label: "퍼플즈", href: PERPLZ_PROFILE_URL } as const;

export const SOCIAL_LINKS = [INSTAGRAM, GITHUB, PERPLZ] as const;

/**
 * 푸터의 '채널' 줄. 인스타그램·퍼플즈에 오픈채팅을 더한 것이다.
 *
 * 푸터는 전체 지도라(FOOTER_NAV 와 같은 이유) 대문 슬랩에서만 열리는 방도
 * 여기 실린다 — 슬랩을 지나쳐 내려온 사람에게 남는 유일한 입구다.
 *
 * ⚠️ **깃허브는 푸터에서 뺐다** (2026-09-16, 본인 요청). SOCIAL_LINKS 에는 남아 있어서
 * sameAs 와 /about 의 채널 버튼에는 그대로 나간다. 그래서 SOCIAL_LINKS 를 펼치지
 * 않고 하나씩 집는다 — 라벨로 filter 하면 이름을 고칠 때 조용히 다시 살아난다.
 */
export const FOOTER_CHANNELS = [
  INSTAGRAM,
  PERPLZ,
  { label: KAKAO_OPENCHAT.label, href: KAKAO_OPENCHAT.href },
] as const;

/** 홈페이지 내부 경로. 스펙 2번의 예약 경로 안에서만 쓴다. */
export const INTERNAL_LINKS = {
  thoughts: "/thoughts",
  resources: "/resources",
  proof: "/proof",
  start: "/start",
  services: "/services",
  about: "/about",
} as const;

const THOUGHTS = { label: "생각들", href: INTERNAL_LINKS.thoughts } as const;
const RESOURCES = { label: "자료실", href: INTERNAL_LINKS.resources } as const;
const PROOF = { label: "Proof 코칭", href: INTERNAL_LINKS.proof } as const;
const ABOUT = { label: "소개", href: INTERNAL_LINKS.about } as const;
export const PRIMARY_NAV = [THOUGHTS, RESOURCES, ABOUT] as const;
export const MOBILE_NAV = [THOUGHTS, RESOURCES, PROOF] as const;
export const FOOTER_NAV = [
  THOUGHTS, RESOURCES, PROOF, ABOUT,
  { label: "만든 것", href: INTERNAL_LINKS.services },
  { label: "직접 만들기 안내", href: INTERNAL_LINKS.start },
] as const;

/**
 * Proof 파일럿 참여 신청이 도착하는 곳 (app/api/proof/apply/route.ts). 웨이팅리스트 수신함이라
 * BUSINESS_EMAIL 과 다르다 — 저쪽은 사람이 답하는 일반 창구, 이쪽은 신청서만 쌓이는 함.
 * 폼이 안 열릴 때의 안내 줄에도 이 주소를 적어 명단이 한 곳에 모이게 한다.
 */
export const PROOF_INBOX_EMAIL = "incu@kyulolong.com";
