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
 * 축이라 소셜 목록에 같이 세운다. 서비스로서의 퍼플즈는 /services/perplz 쪽이다.
 */
export const PERPLZ_PROFILE_URL =
  "https://perplz.com/user/05120996-33fb-49fe-9e5e-539291d2ef81";

export const SOCIAL_LINKS = [
  { label: "인스타그램", href: INSTAGRAM_URL },
  { label: "깃허브", href: "https://github.com/Kyulolong" },
  { label: "퍼플즈", href: PERPLZ_PROFILE_URL },
] as const;

/** 홈페이지 내부 경로. 스펙 2번의 예약 경로 안에서만 쓴다. */
export const INTERNAL_LINKS = {
  services: "/services",
  videos: "/videos",
  about: "/about",
} as const;
