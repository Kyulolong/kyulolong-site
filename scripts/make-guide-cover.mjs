// 목표 설계 가이드(public/guides/01-goal-design-guide.pdf)의 표지를 PNG 로 찍는다.
//
// 홈의 가이드 절(components/guide-paper.tsx)과 자료실(components/guide-download.tsx)이
// 이 그림을 "그 물건의 모양"으로 세운다 — 카드가 아니라 표지·파일명·장 수로 문서를
// 보여주는 자리라, 표지가 실제 PDF 첫 장과 다르면 안 된다. 그래서 손으로 만들지 않고
// PDF 에서 찍는다. 가이드를 다시 뽑았으면 `npm run guide:cover` 를 같이 돌릴 것.
//
// ⚠️ macOS 전용이다 (qlmanage · mdls). `npm run og` 와 같은 방식으로 **결과 PNG 를
// 커밋**하므로 빌드는 이 스크립트에 의존하지 않는다.
//
// 장 수도 여기서 대조한다. lib/site-links.ts 의 GOAL_GUIDE.pages 는 화면에 그대로
// 나가는 숫자인데(“30장”), PDF 를 고치면 장 수는 바뀌고 그 상수는 안 따라온다.
// 크기를 정직하게 적는 게 그 절의 전제라 어긋나면 여기서 세운다.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PDF = path.join(ROOT, "public/guides/01-goal-design-guide.pdf");
const OUT = path.join(ROOT, "public/guides/01-goal-design-guide-cover.png");
const SIZE = 800; // 긴 변 px. 화면에서는 최대 240px 정도로 쓰니 2~3배면 충분하다

// site-links.ts 는 TS 라 여기서 import 하지 못한다. 정규식으로 pages 만 읽는다.
const siteLinks = fs.readFileSync(path.join(ROOT, "lib/site-links.ts"), "utf8");
const declared = Number(
  siteLinks.match(/GOAL_GUIDE\s*=\s*\{[^}]*pages:\s*(\d+)/s)?.[1],
);

if (!fs.existsSync(PDF)) {
  console.error(`PDF 가 없습니다: ${PDF}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "guide-cover-"));
execFileSync("qlmanage", ["-t", "-s", String(SIZE), "-o", tmp, PDF], { stdio: "ignore" });
const produced = path.join(tmp, `${path.basename(PDF)}.png`);
if (!fs.existsSync(produced)) {
  console.error("qlmanage 가 썸네일을 만들지 못했습니다.");
  process.exit(1);
}
fs.copyFileSync(produced, OUT);
fs.rmSync(tmp, { recursive: true, force: true });

const pages = Number(
  execFileSync("mdls", ["-raw", "-name", "kMDItemNumberOfPages", PDF]).toString().trim(),
);
console.log(`표지 → ${path.relative(ROOT, OUT)} (${pages}장)`);

if (Number.isFinite(pages) && pages !== declared) {
  console.error(
    `PDF 는 ${pages}장인데 lib/site-links.ts 의 GOAL_GUIDE.pages 는 ${declared} 입니다. 그 값을 고치세요.`,
  );
  process.exit(1);
}
