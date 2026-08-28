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

export const SOCIAL_LINKS = [
  { label: "인스타그램", href: INSTAGRAM_URL },
  { label: "깃허브", href: "https://github.com/Kyulolong" },
  { label: "퍼플즈", href: PERPLZ_PROFILE_URL },
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
