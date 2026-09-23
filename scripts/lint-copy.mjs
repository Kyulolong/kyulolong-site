// 호명 금지어 검사 — CLAUDE.md 1번 "쓰지 않을 말".
//
// 읽는 사람을 어떤 부류로 규정하는 말이 글에 들어가는 순간, 그 글은 나머지
// 절반을 내쫓고 남은 절반에게도 광고로 읽힌다. 100편을 쓰다 보면 반드시
// 한 번은 새기 때문에 기계로 잡는다.
//
// 게이트가 아니라 거울이다: 걸린 줄이 의도한 인용(그 말 자체를 다루는 글)이면
// 알고 두면 된다. 그래서 빌드에는 안 물려 있고, 발행 워크플로(drafts/PLAN.md
// 5번)에서 손으로 돌린다. exit 1 은 && 로 발행 명령을 이을 수 있게 하기 위한 것.
import fs from "node:fs";
import path from "node:path";

const BANNED = [
  "예비 창업자",
  "예비창업자",
  "예비 창업가",
  "예비창업가",
  "취준생",
  "주니어",
  "스타트업 리더",
  "커리어 전환",
  "동기부여",
  "인사이트를 드립니다",
  "당신도 할 수 있습니다",
  "여러분",
];

// 발행본과 초고를 같이 본다 — drafts/ 는 gitignore 라 없을 수도 있다.
const DIRS = ["content/thoughts", "drafts/thoughts"];

// 닫는 `**` 가 안 닫히는 자리 (drafts/STYLE.md 2번).
//
// CommonMark 에서 닫는 `**` 는 **앞이 구두점이면 뒤가 공백이나 구두점이어야** 닫힌다.
// 한국어는 볼드 뒤에 조사가 바로 붙으므로 `)` · `"` · `?` 로 끝나는 볼드에서 늘 걸리고,
// 실패하면 별표 넷이 그대로 화면에 찍힌다. 눈으로는 잘 안 잡힌다 — 원고에서는 볼드로
// 보이고 화면에서만 깨지기 때문이다. 실제로 20편이 그렇게 배포됐다 (2026-09-23 발견).
const PUNCT = /[\p{P}\p{S}]/u;
const LETTER = /[\p{L}\p{N}]/u;

/** 한 줄에서 닫히지 못하는 `**` 를 찾는다. 별표는 짝으로 세어 홀수 번째를 여는 자리로 본다. */
function brokenBold(line) {
  // 인라인 코드 안의 별표는 글자다. 자리를 유지하려고 공백으로 덮는다.
  const text = line.replace(/`[^`]*`/g, (m) => " ".repeat(m.length));
  const marks = [];
  for (let i = 0; i < text.length - 1; i += 1) {
    if (text[i] === "*" && text[i + 1] === "*") {
      marks.push(i);
      i += 1;
    }
  }
  const broken = [];
  for (let n = 1; n < marks.length; n += 2) {
    const at = marks[n];
    const before = text[at - 1] ?? " ";
    const after = text[at + 2] ?? " ";
    if (PUNCT.test(before) && LETTER.test(after)) broken.push(`${before}**${after}`);
  }
  return broken;
}

let hits = 0;
let dashes = 0;
let bolds = 0;
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const lines = fs.readFileSync(path.join(dir, file), "utf8").split("\n");
    let inFence = false;
    lines.forEach((line, i) => {
      if (line.trimStart().startsWith("```")) {
        inFence = !inFence;
        return;
      }
      if (!inFence) {
        for (const mark of brokenBold(line)) {
          console.log(`${dir}/${file}:${i + 1}  「${mark}」  ${line.trim().slice(0, 72)}`);
          bolds += 1;
        }
      }
      for (const word of BANNED) {
        if (line.includes(word)) {
          console.log(`${dir}/${file}:${i + 1}  「${word}」  ${line.trim().slice(0, 72)}`);
          hits += 1;
        }
      }
      // 링크는 통째로 걷어내고 본다. 원문 제목 안의 엠대시는 그대로 적어야
      // 그 제목으로 검색해 찾아갈 수 있다 (drafts/STYLE.md 4번).
      if (line.replace(/\[[^\]]*\]\([^)]*\)/g, "").includes("\u2014")) {
        console.log(`${dir}/${file}:${i + 1}  「\u2014」  ${line.trim().slice(0, 72)}`);
        dashes += 1;
      }
    });
  }
}

if (dashes > 0) {
  console.error(
    `\n엠대시 ${dashes}곳. 마침표로 끊거나, 쉼표로 잇거나, 정의 목록이면 콜론입니다 (drafts/STYLE.md 1번).`,
  );
}
if (hits > 0) {
  console.error(`\n${hits}곳 — 정체성 호명이면 지우고, 인용이면 알고 둡니다 (drafts/STYLE.md 1번).`);
}
if (bolds > 0) {
  console.error(
    `\n안 닫히는 볼드 ${bolds}곳. 화면에 별표가 그대로 찍힙니다 — 구두점을 볼드 밖으로 빼거나` +
      ` 조사를 볼드 안으로 넣으세요 (drafts/STYLE.md 2번).`,
  );
}
if (hits > 0 || dashes > 0 || bolds > 0) process.exit(1);
console.log("호명 금지어 없음 — 문은 둘 다 열려 있습니다. 엠대시도, 깨진 볼드도 없습니다.");
