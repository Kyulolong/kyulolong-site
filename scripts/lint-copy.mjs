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

let hits = 0;
for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const lines = fs.readFileSync(path.join(dir, file), "utf8").split("\n");
    lines.forEach((line, i) => {
      for (const word of BANNED) {
        if (line.includes(word)) {
          console.log(`${dir}/${file}:${i + 1}  「${word}」  ${line.trim().slice(0, 72)}`);
          hits += 1;
        }
      }
    });
  }
}

if (hits > 0) {
  console.error(`\n${hits}곳 — 정체성 호명이면 지우고, 인용이면 알고 둡니다 (drafts/STYLE.md 1번).`);
  process.exit(1);
}
console.log("호명 금지어 없음 — 문은 둘 다 열려 있습니다.");
