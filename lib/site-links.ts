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
 * 카카오톡 오픈채팅. 질문지(public/founder-questions.pdf)의 질문들을 **같이 적는
 * 방**이다. 사이트 안의 입구는 히어로 타일(components/hero-links.tsx)과 푸터 둘이다.
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
  /**
   * ⚠️ **화면에 보이는 문구는 여기 없다.** 히어로 타일(components/hero-links.tsx)이
   * 유일한 자리라 거기 인라인으로 두고, 이 파일은 **주소와 숫자**만 갖는다.
   * 두 번째 자리가 생기면 그때 문구를 이리로 올릴 것 — 아래 "목적지 하나에 이름
   * 하나"가 그때부터 걸린다.
   */
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
 * ⚠️ **`pages` 는 화면에 그대로 나가는 숫자다** (히어로 타일의 "무료 · 12장").
 * 갈래를 더하면 종이가 늘어나는데 이 숫자는 안 따라오므로, `npm run questions` 가
 * 굽고 나서 이 값과 대조해 어긋나면 세운다. 크기를 정직하게 적는 게 이 절의
 * 전제라(CLAUDE.md 3번), 틀린 장 수는 오탈자가 아니라 그 전제를 깨는 일이다.
 */
export const FOUNDER_QUESTIONS = {
  href: "/founder-questions.pdf",
  pages: 12,
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
  /** 글. 이 채널이 쌓아가는 축이라 네비의 첫 자리다. */
  thoughts: "/thoughts",
  /**
   * 설치부터 첫 화면까지의 안내. 서비스 상세의 접힘 상자가 여기로 넘긴다.
   * 새 예약 경로라 CLAUDE.md 2번 목록에도 `start` 를 같이 적어뒀다 —
   * 안 적어두면 언젠가 `start` 슬러그 서비스를 만들 때 이 경로와 부딪힌다.
   */
  start: "/start",
  services: "/services",
  videos: "/videos",
  about: "/about",
} as const;

/**
 * 목적지 하나에 이름 하나.
 *
 * ⚠️ 예전엔 헤더·푸터가 "서비스", 히어로 CTA 가 "만든 것" 이었다. 같은 곳을 두
 * 이름으로 부르면 처음 온 사람은 그게 다른 곳인 줄 안다. 아래 배열들이 전부 이
 * 상수를 집어다 쓰므로, 라벨을 고칠 자리는 늘 여기 한 곳이다.
 */
const START = { label: "시작하기", href: INTERNAL_LINKS.start } as const;
const THOUGHTS = { label: "생각들", href: INTERNAL_LINKS.thoughts } as const;
const SERVICES = { label: "만든 것", href: INTERNAL_LINKS.services } as const;
const VIDEOS = { label: "영상", href: INTERNAL_LINKS.videos } as const;
const ABOUT = { label: "소개", href: INTERNAL_LINKS.about } as const;

/**
 * 네비게이션 셋. 하단 바(md 미만)가 그대로 펴고, 헤더(md 이상)는 여기에 퍼플즈
 * 한 칸을 더한다.
 *
 * ⚠️ **"영상"이 여기에 없다** (2026-08-28). 칸이 셋인데(하단 바의 상한) 소개가
 * 그 자리를 가져갔다 — 이 채널은 "왜 이걸 하나"를 묻는 사람이 먼저 오는 곳이라
 * 소개가 상시 입구여야 하고, 영상은 인스타·유튜브가 이미 가진 채널이라 이
 * 사이트가 유일한 입구가 아니다. `/videos` 는 그대로 살아서 **푸터**로 들어간다
 * (FOOTER_NAV). 네 칸으로 늘리지 말 것 — 375px 하단 바에서 라벨이 붙는다.
 */
export const PRIMARY_NAV = [THOUGHTS, SERVICES, ABOUT] as const;

/**
 * 푸터는 **전체 지도**다. 네비에서 빠진 것(시작하기·영상)까지 전부 싣는다 —
 * 영상은 이제 사이트 안에서 여기가 유일한 입구다.
 */
export const FOOTER_NAV = [START, THOUGHTS, SERVICES, VIDEOS, ABOUT] as const;
