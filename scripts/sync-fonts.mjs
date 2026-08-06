/**
 * Pretendard 다이나믹 서브셋을 저장소 안으로 복사한다.
 *
 * 왜 이렇게 하나
 *   - 폰트를 같은 도메인에서 서빙한다. LTE 에서는 CDN 한 곳을 더 거치는
 *     DNS + TLS 왕복이 조각 파일 전송보다 오래 걸린다.
 *   - 다이나믹 서브셋은 unicode-range 로 쪼개져 있어서, 브라우저가 페이지에
 *     실제로 쓰인 글자가 든 조각만 받는다. 랜딩 페이지 실측으로 웨이트당
 *     11/92 조각(125KB)만 전송됐다. 통짜 서브셋은 늘 웨이트당 260KB 를 낸다.
 *   - next/font 는 unicode-range 를 다루지 못해서 @font-face 를 직접 쓴다.
 *
 * 쓰는 법 (폰트 갱신할 때만)
 *   npm install --no-save pretendard@<version>
 *   node scripts/sync-fonts.mjs
 *
 * 산출물
 *   public/fonts/*.woff2   조각 파일 (같은 오리진에서 서빙)
 *   app/pretendard.css     @font-face 정의 (globals.css 가 import)
 */
import fs from "node:fs";
import path from "node:path";

// 유지할 웨이트. 한글은 합성 볼드가 뭉개져서 Bold 를 실제 파일로 받는다.
const WEIGHTS = [400, 700];

/**
 * unicode-range 는 원본 그대로 둔다.
 *
 * 한자 / 가나 대역을 걷어내 본 적이 있는데 CSS 가 gzip 기준 5KB 줄었을 뿐이고
 * (용량 대부분은 한자가 아니라 한글 음절 대역 선언이다), 대신 본문에 한자가
 * 한 글자만 섞여도 그 글자만 폴백 폰트로 빠져 굵기·자폭이 어긋난다.
 * 5KB 를 얻자고 원인 찾기 어려운 함정을 만들 이유가 없다.
 */

const PKG = path.join(process.cwd(), "node_modules/pretendard/dist/web/static");
const SRC_CSS = path.join(PKG, "pretendard-dynamic-subset.css");
const CHUNK_DIR = path.join(PKG, "woff2-dynamic-subset");
const OUT_FONTS = path.join(process.cwd(), "public/fonts");
const OUT_CSS = path.join(process.cwd(), "app/pretendard.css");

if (!fs.existsSync(SRC_CSS)) {
  console.error(
    "pretendard 패키지가 없습니다.\n" +
      "  npm install --no-save pretendard@1.3.9\n" +
      "를 먼저 실행하세요.",
  );
  process.exit(1);
}

const source = fs.readFileSync(SRC_CSS, "utf8");

// @font-face 블록 단위로 자른다.
const blocks = source
  .split("@font-face")
  .slice(1)
  .map((b) => "@font-face" + b.slice(0, b.indexOf("}") + 1));

const kept = [];
const needed = new Set();

for (const block of blocks) {
  const weight = Number(block.match(/font-weight:\s*(\d+)/)?.[1]);
  if (!WEIGHTS.includes(weight)) continue;

  const file = block.match(/woff2-dynamic-subset\/([^)]+\.woff2)/)?.[1];
  const range = block.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();
  if (!file || !range) {
    console.error(`파싱 실패한 블록이 있습니다 (weight=${weight})`);
    process.exit(1);
  }

  needed.add(file);
  // woff 폴백은 뺀다. woff2 를 못 읽는 브라우저는 폴백 스택으로 내려간다.
  kept.push(
    `@font-face {\n` +
      `  font-family: "Pretendard";\n` +
      `  font-style: normal;\n` +
      `  font-weight: ${weight};\n` +
      `  font-display: swap;\n` +
      `  src: url("/fonts/${file}") format("woff2");\n` +
      `  unicode-range: ${range};\n` +
      `}`,
  );
}

fs.rmSync(OUT_FONTS, { recursive: true, force: true });
fs.mkdirSync(OUT_FONTS, { recursive: true });

let bytes = 0;
for (const file of needed) {
  const from = path.join(CHUNK_DIR, file);
  if (!fs.existsSync(from)) {
    console.error(`조각 파일이 없습니다: ${file}`);
    process.exit(1);
  }
  fs.copyFileSync(from, path.join(OUT_FONTS, file));
  bytes += fs.statSync(from).size;
}

/**
 * OFL-1.1 은 폰트 사본에 라이선스 전문을 동봉하도록 요구한다.
 * 이 스크립트가 public/fonts 를 통째로 지우고 다시 만들기 때문에
 * 라이선스도 매번 같이 복사해야 한다 — 빠뜨리면 재배포 조건 위반이다.
 */
const LICENSE_SRC = path.join(process.cwd(), "node_modules/pretendard/dist/LICENSE.txt");
if (!fs.existsSync(LICENSE_SRC)) {
  console.error("LICENSE.txt 를 찾을 수 없습니다. 폰트만 복사하고 끝낼 수 없습니다.");
  process.exit(1);
}
fs.copyFileSync(LICENSE_SRC, path.join(OUT_FONTS, "LICENSE.txt"));

const header =
  "/* 자동 생성 파일 — 직접 고치지 마세요. scripts/sync-fonts.mjs 가 만듭니다.\n" +
  `   Pretendard 다이나믹 서브셋, weight ${WEIGHTS.join(" / ")}, 같은 오리진 서빙. */\n\n`;
fs.writeFileSync(OUT_CSS, header + kept.join("\n\n") + "\n");

console.log(
  `✓ 폰트 동기화 완료\n` +
    `  조각 파일 ${needed.size}개 → public/fonts/ (${(bytes / 1024 / 1024).toFixed(1)} MB)\n` +
    `  @font-face ${kept.length}개 → app/pretendard.css (${(fs.statSync(OUT_CSS).size / 1024).toFixed(0)} KB)\n` +
    `  브라우저는 이 중 페이지에 쓰인 글자가 든 조각만 받습니다.`,
);
