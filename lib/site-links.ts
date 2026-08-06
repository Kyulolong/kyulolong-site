/**
 * 외부 채널 링크. 추가할 때 이 배열만 건드리면 푸터가 따라온다.
 *
 * 유튜브는 아직 채널 주소가 없어서 넣지 않았다. 주소가 생기면
 * { label: "유튜브", href: "..." } 한 줄만 추가하면 된다.
 */
export const SOCIAL_LINKS = [
  { label: "인스타그램", href: "https://www.instagram.com/kyulolong/" },
  { label: "깃허브", href: "https://github.com/Kyulolong" },
] as const;

/** 홈페이지 내부 경로. 스펙 2번의 예약 경로 안에서만 쓴다. */
export const INTERNAL_LINKS = {
  services: "/services",
  videos: "/videos",
  about: "/about",
} as const;
