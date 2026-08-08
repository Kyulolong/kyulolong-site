import type { MetadataRoute } from "next";

/**
 * PWA 매니페스트.
 *
 * docs/brand/site.webmanifest 는 아이콘 세트에 딸려온 '원본 참고본'이고,
 * 실제로 서빙되는 건 이 파일이다. Next 가 /manifest.webmanifest 로 내보내고
 * <link rel="manifest"> 까지 자동으로 붙여주므로, HTML 에 직접 태그를 넣지 않는다.
 *
 * 아이콘은 maskable 이다 — 안드로이드 런처가 원·사각·물방울로 잘라내므로
 * 마크가 캔버스의 52% 안에 들어가 있다. 꽉 채우면 어떤 런처에서는 잘린다.
 * (public/icon-*-maskable.png)
 *
 * 색이 어두운 건 의도다. 사이트 본문은 라이트지만 앱 아이콘과 스플래시는
 * 마크의 잉크색을 쓴다 — 형광이 가장 잘 서는 바탕이고, 홈 화면에서
 * 흰 타일은 다른 앱들 사이에서 존재감이 없다.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "규로롱",
    short_name: "규로롱",
    description:
      "인사담당 출신이 IT 서비스를 만듭니다. 만든 서비스와 소스코드, 만드는 과정을 남긴 영상을 모아둡니다.",
    start_url: "/",
    display: "standalone",
    theme_color: "#14180F",
    background_color: "#14180F",
    icons: [
      {
        src: "/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      // maskable 만 두면 일부 브라우저가 잘린 아이콘을 그대로 쓴다. 원본도 같이 준다.
      { src: "/brand/mark.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
