/**
 * 링크 미리보기 카드(public/og.png)를 만든다.
 *
 * 왜 스크립트로 만들어 커밋하나 (app/opengraph-image.tsx 로 매 빌드 그리지 않고)
 *   - 그리려면 Pretendard 통짜 OTF 가 필요하다. 사이트가 실제로 서빙하는 폰트는
 *     woff2 다이나믹 서브셋(92조각)이라 satori 가 읽지 못한다. 빌드 타임에 그리려면
 *     4MB 짜리 OTF 를 레포에 넣고 Docker 로 실어 날라야 하는데, 1년에 몇 번 바뀌지도
 *     않는 그림 한 장 때문에 매 배포가 무거워진다.
 *   - 결과물이 정적 PNG 한 장이라 런타임 의존이 0 이다. 카톡·슬랙이 og:image 를
 *     받아갈 때 서버가 그림을 그리지 않는다.
 *
 * 쓰는 법 (문구나 브랜드가 바뀔 때만)
 *   npm install --no-save pretendard@1.3.9
 *   npx tsx scripts/make-og.tsx
 *
 * scripts/sync-fonts.mjs 와 같은 방식이다 — 폰트 패키지는 받아서 쓰고 버린다.
 */
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

const FONT_DIR = path.join(process.cwd(), "node_modules/pretendard/dist/public/static");
const OUT = path.join(process.cwd(), "public/og.png");

// 카톡·슬랙·X 가 공통으로 기대하는 비율 (1.91:1)
const SIZE = { width: 1200, height: 630 };

// docs/DESIGN.md §3 토큰. 값이 어긋나면 공유 카드만 다른 사이트처럼 보인다.
const INK = "#1a1a17";
const INK_SOFT = "#55544c";
const INK_FAINT = "#73726a";
const CANVAS = "#ffffff";
const PAPER_LIME = "#f2ffdd";

function readFont(file: string): Buffer {
  const full = path.join(FONT_DIR, file);
  if (!fs.existsSync(full)) {
    console.error(
      "pretendard 패키지가 없습니다.\n" +
        "  npm install --no-save pretendard@1.3.9\n" +
        "를 먼저 실행하세요.",
    );
    process.exit(1);
  }
  return fs.readFileSync(full);
}

const mark = fs.readFileSync(path.join(process.cwd(), "public/brand/mark.svg"), "base64");
const markSrc = `data:image/svg+xml;base64,${mark}`;

function card() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: CANVAS,
        padding: "72px 80px",
        fontFamily: "Pretendard",
        letterSpacing: "-0.02em",
        // 한글은 어절 중간에서 끊기면 눈에 걸린다 (globals.css 의 body 와 같은 규칙)
        wordBreak: "keep-all",
      }}
    >
      {/* 머리: 마크 + 이름. 이 카드의 형광 한 점은 마크뿐이다. */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* 여기를 그리는 건 브라우저가 아니라 satori 라서 next/image 는 쓸 수 없다 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markSrc} width={52} height={52} alt="" />
        <div style={{ fontSize: 34, fontWeight: 700, color: INK }}>규로롱</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* 인스타 썸네일에 박혀 있는 그 줄. 릴스를 보고 넘어온 사람이 같은 얼굴을 만난다. */}
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            backgroundColor: PAPER_LIME,
            color: INK_SOFT,
            fontSize: 26,
            fontWeight: 500,
            padding: "10px 24px",
            borderRadius: 999,
          }}
        >
          {/* 히어로 눈썹 줄과 같은 문구다 (components/hero.tsx).
              한쪽만 고치면 링크 미리보기와 도착한 화면이 다른 말을 한다. */}
          인사담당자가 · 요청 한 번에 · 앱스토어까지
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 116,
            fontWeight: 700,
            color: INK,
            letterSpacing: "-0.045em",
            lineHeight: 1.05,
          }}
        >
          이게 되네?
        </div>

        <div
          style={{
            marginTop: 26,
            fontSize: 32,
            color: INK_SOFT,
            lineHeight: 1.45,
            maxWidth: 900,
          }}
        >
          AI한테 시켜서 매주 하나씩 만듭니다. 전부 로그인 없이 열리고,
          소스코드와 프롬프트까지 같이 열어뒀습니다.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 26, color: INK_FAINT }}>kyulolong.com</div>
        <div style={{ fontSize: 26, color: INK_FAINT }}>만든 서비스 · 소스코드 · 만드는 과정</div>
      </div>
    </div>
  );
}

async function main() {
  const image = new ImageResponse(card(), {
    ...SIZE,
    fonts: [
      { name: "Pretendard", data: readFont("Pretendard-Regular.otf"), weight: 400, style: "normal" },
      { name: "Pretendard", data: readFont("Pretendard-Medium.otf"), weight: 500, style: "normal" },
      { name: "Pretendard", data: readFont("Pretendard-Bold.otf"), weight: 700, style: "normal" },
    ],
  });

  const buffer = Buffer.from(await image.arrayBuffer());
  fs.writeFileSync(OUT, buffer);
  console.log(
    `✓ ${path.relative(process.cwd(), OUT)} (${SIZE.width}×${SIZE.height}, ${(buffer.length / 1024).toFixed(0)} KB)`,
  );
}

main();
