/**
 * 창업 질문지(public/founder-questions.pdf)를 굽는다.
 *
 * 왜 종이인가 (docs 에 적어둘 만한 판단이라 여기 남긴다)
 *   - `/start` 는 PDF 로 만들지 않는다. 거긴 가격·버전·설치 명령이 들어 있어서
 *     종이에 굳히면 여섯 달 뒤 틀린 채로 돌아다니고 고칠 방법이 없다.
 *   - 이 질문들에는 굳을 값이 하나도 없다. 그리고 **답을 적어 넣는 물건**이라
 *     문서라는 형식에 이유가 있다. 화면에서는 접힘 줄이 열 개지만, 종이에서는
 *     갈래마다 한 장씩 서고 그 아래에 빈 줄이 생긴다 — 그게 이 파일의 전부다.
 *
 * 왜 스크립트로 구워서 커밋하나 (scripts/make-og.tsx 와 같은 이유)
 *   - 결과가 정적 파일 한 장이라 런타임 의존이 0 이다. 받아가는 사람이 눌렀을 때
 *     서버가 PDF 를 그리지 않는다.
 *   - 질문은 1년에 몇 번 바뀌지 않는다. 매 빌드에 크롬을 띄울 이유가 없다.
 *
 * 쓰는 법 (lib/founder-questions.ts 를 고쳤을 때만)
 *   npm run questions
 *
 * ⚠️ **질문 원본은 lib/founder-questions.ts 하나다.** 이 스크립트는 거기서 읽어
 * 오기만 한다. 종이에 문장을 직접 적어 넣지 말 것 — 화면과 종이가 다른 말을 하는
 * 순간, 이 파일이 쌓으려는 신뢰가 정확히 그만큼 깎인다.
 *
 * ── 종이의 색 (docs/DESIGN.md §3 라이트 대응 · §10)
 *   흰 종이라 라이트 토큰을 쓴다. **형광은 한 점도 없다** — `--acid` 는 흰 바탕에서
 *   1.27:1 이라 인쇄하면 통째로 사라진다 (§10 이 명시적으로 경고하는 자리다).
 *   보라도 글자로 쓰지 않는다: 띠와 가는 선, 곧 '면'으로만 나온다 (§3).
 *   마크는 mark-on-light.svg — 그 표가 "흰 종이·인쇄"라고 적어둔 변형이다 (§7).
 *
 * ── 폰트
 *   사이트가 실제로 서빙하는 것과 같은 파일을 쓴다. Pretendard 다이나믹 서브셋과
 *   DM Mono 는 public/fonts/ 에 있고, 크롬이 그걸 받아갈 수 있도록 이 스크립트가
 *   잠깐 정적 서버를 하나 띄운다. make-og.tsx 처럼 통짜 OTF 를 따로 받지 않아도
 *   되는 건, 그리는 주체가 satori 가 아니라 크롬이라서다.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public/founder-questions.pdf");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/** docs/DESIGN.md §3 의 라이트 대응 토큰. 값이 어긋나면 종이만 다른 사이트가 된다. */
const C = {
  ink: "#17151f",
  inkSoft: "#514d61",
  inkFaint: "#6f6a80",
  line: "#e8e5f0",
  lineStrong: "#d6d2e4",
  iris: "#6332eb",
  irisWash: "#f0ebff",
  onIris: "#f5f3ff",
};

const SITE = "kyulolong.com";

// ── 질문 원본 읽기 ────────────────────────────────────────────────────────
// lib/founder-questions.ts 는 타입이 붙은 TS 라 그냥 import 할 수 없다. tsx 를
// 부르는 대신 배열 리터럴만 떼어내 evaluate 한다 — 이 파일이 읽는 건 데이터뿐이고
// 타입은 tsc 가 이미 본다.
function readGroups() {
  const src = fs.readFileSync(path.join(ROOT, "lib/founder-questions.ts"), "utf8");
  const start = src.indexOf("export const FOUNDER_QUESTION_GROUPS");
  if (start === -1) throw new Error("lib/founder-questions.ts 에서 배열을 찾지 못했습니다.");
  const open = src.indexOf("[", start);
  const end = src.lastIndexOf("] as const;");
  if (open === -1 || end === -1) throw new Error("배열의 끝을 찾지 못했습니다.");
  const literal = src.slice(open, end + 1);
  const groups = new Function(`return ${literal};`)();
  if (!Array.isArray(groups) || groups.length === 0) throw new Error("질문이 비어 있습니다.");
  for (const g of groups) {
    if (!g.title || !Array.isArray(g.items) || g.items.length !== 2) {
      throw new Error(`갈래 "${g.title}" 의 물음이 둘이 아닙니다.`);
    }
  }
  return groups;
}

/**
 * 히어로 타일이 화면에 그리는 장 수(`FOUNDER_QUESTIONS.pages`)를 읽어온다.
 *
 * 갈래를 하나 더하면 종이는 한 장 늘어나는데 저 숫자는 안 따라온다. 그러면
 * 타일에 "12장"이라 적힌 종이를 열었더니 13장인 상황이 되는데, 이 절이
 * 세우려는 게 정확히 **크기를 정직하게 적는 것**이라(CLAUDE.md 3번) 그 한 글자가
 * 절 전체의 전제를 깬다. 눈으로는 절대 못 잡는 종류라 기계로 막는다.
 */
function readClaimedPages() {
  const src = fs.readFileSync(path.join(ROOT, "lib/site-links.ts"), "utf8");
  const m = src.match(/export const FOUNDER_QUESTIONS = \{[\s\S]*?pages:\s*(\d+)/);
  if (!m) throw new Error("lib/site-links.ts 에서 FOUNDER_QUESTIONS.pages 를 찾지 못했습니다.");
  return Number(m[1]);
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pad = (n) => String(n).padStart(2, "0");

// ── HTML ──────────────────────────────────────────────────────────────────
function buildHtml(groups) {
  const total = groups.length + 2; // 표지 + 차례 + 갈래들

  const cover = `
  <section class="page cover">
    <div>
      <div class="brandline">
        <img class="mark" src="/brand/mark-on-light.svg" alt="" />
        <span class="wordmark">규로롱</span>
      </div>
      <p class="eyebrow">사람 · 조직 · 창업</p>
    </div>

    <div class="cover-title">
      <div class="band"></div>
      <h1>사업계획서부터<br />쓰지 마세요</h1>
      <p class="lede">
        코드를 짜는 것 부터 지식노동까지 이제 AI가 더 잘하게 될겁니다. 서비스는
        일주일이면 나옵니다. 그래서 창업에서 어려운 건 만드는 일이 아니라
        <strong>어떤 회사를 만들 것인지 답하는 일</strong>입니다.
      </p>
      <p class="lede">
        창업하기 전 스스로 답을 찾아볼 질문 열 개를 적어보았습니다. 정답이 있는
        질문은 하나도 없습니다. 답이 매번 달라질 수도 있습니다. 다만 답을 적어두면,
        다음 선택은 조금 더 선명해질 겁니다.
      </p>
    </div>

    <div class="cover-foot">
      <p class="meta"><span class="num">${groups.length}</span>갈래 · 물음 <span class="num">${groups.length * 2}</span>개 · 답은 비어 있습니다</p>
      <p class="foot-note">
        이 종이는 그대로 복사해 쓰셔도 됩니다. 팀에 나눠 주셔도 되고, 고쳐서
        쓰셔도 됩니다. 원본은 <span class="mono">${SITE}</span> 에 있습니다.
      </p>
    </div>
  </section>`;

  /*
   * 차례. 종이는 갈래마다 한 장이라, 이 장이 없으면 열 갈래를 한눈에 볼 데가
   * 어디에도 없다 — 사이트에서도 없어졌다(대문 슬랩을 2026-09-07 에 지웠다).
   * CLAUDE.md 1번의 "제목 셋이 곧 명함"과 같은 이유다: 훑는 사람은 제목만 읽는다.
   */
  const toc = `
  <section class="page">
    <header class="phead">
      <span class="num phead-num">차례</span>
      <h2>회사를 시작하기 전에</h2>
    </header>
    <ol class="toc">
      ${groups
        .map(
          (g, i) => `
      <li>
        <span class="num toc-num">${pad(i + 1)}</span>
        <span class="toc-body">
          <span class="toc-title">${esc(g.title)}</span>
          <span class="toc-labels">${g.items.map((it) => esc(it.label)).join(" · ")}</span>
        </span>
        <span class="num toc-page">${pad(i + 3)}</span>
      </li>`,
        )
        .join("")}
    </ol>
    <p class="toc-note">
      순서에는 뜻이 있습니다. 회사의 바깥(존재 이유)에서 시작해 안(조직·보상)을 지나
      마지막이 창업자 자신(한계선)입니다. 앞에서 막히면 건너뛰고 뒤부터 적으셔도 됩니다.
    </p>
    <footer class="pfoot">
      <span class="mono">${SITE}</span>
      <span class="num">${pad(2)} / ${pad(total)}</span>
    </footer>
  </section>`;

  const pages = groups
    .map(
      (g, i) => `
  <section class="page">
    <header class="phead">
      <span class="num phead-num">${pad(i + 1)}</span>
      <h2>${esc(g.title)}</h2>
    </header>
    ${g.items
      .map(
        (item) => `
    <div class="q">
      <p class="q-text"><strong>${esc(item.label)} —</strong> ${esc(item.q)}</p>
      <p class="q-ex">${esc(item.ex)}</p>
      <div class="rules">
        <div class="rule"></div><div class="rule"></div><div class="rule"></div>
        <div class="rule"></div><div class="rule"></div><div class="rule"></div>
      </div>
    </div>`,
      )
      .join("")}
    <footer class="pfoot">
      <span class="mono">${SITE}</span>
      <span class="num">${pad(i + 3)} / ${pad(total)}</span>
    </footer>
  </section>`,
    )
    .join("");

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>사업계획서부터 쓰지 마세요 — 창업 전 질문 ${groups.length}갈래</title>
<link rel="stylesheet" href="/pretendard.css" />
<style>
  @font-face {
    font-family: "DM Mono";
    font-style: normal;
    font-weight: 400;
    src: url("/fonts/dm-mono-400.woff2") format("woff2");
  }
  @font-face {
    font-family: "DM Mono";
    font-style: normal;
    font-weight: 500;
    src: url("/fonts/dm-mono-500.woff2") format("woff2");
  }

  @page { size: A4; margin: 0; }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  body {
    font-family: "Pretendard", -apple-system, sans-serif;
    color: ${C.ink};
    background: #fff;
    /* 한글은 어절 중간에서 끊기면 눈에 걸린다 (app/globals.css 의 body 와 같은 규칙) */
    word-break: keep-all;
    line-height: 1.7;
    letter-spacing: -0.01em;
  }

  .mono, .num { font-family: "DM Mono", ui-monospace, Menlo, monospace; }
  /* 고정폭에 bold 를 걸지 않는다 — 400/500 만 받는다 (CLAUDE.md 7번) */
  .num { font-weight: 500; font-variant-numeric: tabular-nums; letter-spacing: 0; }

  .page {
    width: 210mm;
    height: 297mm;
    padding: 22mm 20mm 16mm;
    display: flex;
    flex-direction: column;
    break-after: page;
    overflow: hidden;
  }
  .page:last-child { break-after: auto; }

  /* ── 표지 ────────────────────────────────────────── */
  /* 표지는 space-between 을 쓰지 않는다 — 덩어리 셋을 균등하게 벌리면 눈썹과
     제목 사이에 손바닥만 한 구멍이 생긴다. 제목은 위에서 내려온 자리에 두고,
     맨 아래 줄만 auto 로 바닥에 붙인다. */
  .cover-title { margin-top: 62mm; }
  .cover-foot { margin-top: auto; }
  .brandline { display: flex; align-items: center; gap: 10px; }
  .mark { width: 34px; height: 34px; }
  .wordmark { font-size: 22px; font-weight: 700; letter-spacing: -0.03em; }
  .eyebrow { margin-top: 14px; font-size: 13px; color: ${C.inkFaint}; letter-spacing: 0.02em; }

  /* 보라는 면이다 — 글자로 쓰지 않는다 (DESIGN.md §3).
     종이에 보라를 통째로 찍지 않는 이유는 잉크가 아니라 위계다: 이 문서의
     주인공은 질문이고, 브랜드는 띠 하나로 서명만 하면 된다. */
  .band { width: 56px; height: 6px; background: ${C.iris}; border-radius: 999px; }

  h1 {
    margin-top: 22px;
    font-size: 44px;
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.035em;
  }
  .lede { margin-top: 16px; font-size: 13.5px; color: ${C.inkSoft}; max-width: 150mm; }
  .lede strong { color: ${C.ink}; font-weight: 700; }
  .meta { font-size: 12px; color: ${C.inkFaint}; }
  .meta .num { color: ${C.inkSoft}; }
  .foot-note {
    margin-top: 10px; padding-top: 10px;
    border-top: 1px solid ${C.line};
    font-size: 11.5px; color: ${C.inkFaint}; max-width: 150mm;
  }

  /* ── 질문 장 ─────────────────────────────────────── */
  .phead {
    display: flex; align-items: baseline; gap: 12px;
    padding-bottom: 10px; border-bottom: 1.5px solid ${C.ink};
  }
  .phead-num { font-size: 14px; color: ${C.inkFaint}; }
  .phead h2 { font-size: 21px; font-weight: 800; letter-spacing: -0.03em; }

  /* ── 차례 ────────────────────────────────────────── */
  .toc { list-style: none; margin-top: 7mm; }
  .toc li {
    display: flex; align-items: baseline; gap: 12px;
    padding: 4.1mm 0; border-bottom: 1px solid ${C.line};
  }
  .toc-num { font-size: 13px; color: ${C.inkFaint}; width: 22px; flex: none; }
  .toc-body { flex: 1; }
  .toc-title { display: block; font-size: 15px; font-weight: 700; letter-spacing: -0.02em; }
  .toc-labels { display: block; margin-top: 2px; font-size: 11.5px; color: ${C.inkFaint}; }
  .toc-page { font-size: 12px; color: ${C.inkFaint}; }
  .toc-note {
    margin-top: 7mm; padding-left: 11px;
    border-left: 2px solid ${C.lineStrong};
    font-size: 11.5px; line-height: 1.65; color: ${C.inkSoft}; max-width: 150mm;
  }

  .q { margin-top: 11mm; }
  .q-text { font-size: 14px; line-height: 1.6; max-width: 160mm; }
  .q-text strong { font-weight: 700; }
  /* 예시는 저자의 목소리다. 들여쓴 선 하나로 물음과 갈라 "예:" 없이도 층이 읽힌다
     들여쓴 선 하나로 물음과 갈라, "예:" 같은 접두 없이 층을 만든다. */
  .q-ex {
    margin-top: 7px; padding-left: 11px;
    border-left: 2px solid ${C.lineStrong};
    font-size: 11.5px; line-height: 1.65; color: ${C.inkSoft}; max-width: 155mm;
  }
  .rules { margin-top: 7mm; }
  .rule { height: 10mm; border-bottom: 1px solid ${C.lineStrong}; }

  .pfoot {
    margin-top: auto; padding-top: 8mm;
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 10.5px; color: ${C.inkFaint};
  }

</style>
</head>
<body>
${cover}
${toc}
${pages}
</body>
</html>`;
}

// ── 정적 서버 (폰트와 마크를 크롬에 먹이기 위한 임시 서버) ───────────────
const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
};

function serve(html) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent((req.url || "/").split("?")[0]);
      if (url === "/") {
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(html);
        return;
      }
      // 레포 밖으로 나가는 경로는 받지 않는다
      const map = { "/pretendard.css": "app/pretendard.css" };
      const rel = map[url] ?? path.posix.join("public", url);
      const file = path.resolve(ROOT, rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

// ── 크롬 (CDP) ────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function withChrome(fn) {
  if (!fs.existsSync(CHROME)) {
    console.error(`크롬을 찾지 못했습니다: ${CHROME}`);
    process.exit(1);
  }
  const port = 9500 + Math.floor(Math.random() * 400);
  const profile = path.join(process.env.TMPDIR ?? "/tmp", `kyulolong-pdf-${port}`);
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let target;
  for (let i = 0; i < 60; i++) {
    await sleep(250);
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = list.find((t) => t.type === "page");
      if (target) break;
    } catch {
      /* 아직 안 떴다 */
    }
  }
  if (!target) {
    chrome.kill();
    throw new Error("크롬이 뜨지 않았습니다.");
  }

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((res) => {
      const i = ++id;
      pending.set(i, res);
      ws.send(JSON.stringify({ id: i, method, params }));
    });

  try {
    return await fn(send);
  } finally {
    ws.close();
    // 크롬이 아직 프로필에 쓰고 있는 동안 지우면 ENOTEMPTY 로 죽는다. 종료를
    // 기다리고, 그래도 남으면 그냥 둔다 — 임시 폴더 하나 때문에 PDF 를 버리지 않는다.
    const exited = new Promise((res) => chrome.once("exit", res));
    chrome.kill();
    await Promise.race([exited, sleep(3000)]);
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch {
      /* 임시 폴더는 OS 가 치운다 */
    }
  }
}

// ── main ──────────────────────────────────────────────────────────────────
const groups = readGroups();
const html = buildHtml(groups);

// `npm run questions -- --html out.html` 로 중간 HTML 을 꺼낸다. 종이의 레이아웃을
// 손볼 때 크롬에서 직접 열어보는 게 PDF 를 열두 번 굽는 것보다 빠르다.
// (폰트는 http 로 서빙돼야 붙으므로, 연 뒤 인쇄 미리보기로 확인할 것.)
const htmlOutFlag = process.argv.indexOf("--html");
if (htmlOutFlag !== -1) {
  const dest = process.argv[htmlOutFlag + 1];
  if (!dest) throw new Error("--html 뒤에 파일 경로가 필요합니다.");
  fs.writeFileSync(dest, html);
  console.log(`✓ ${dest} (중간 HTML)`);
}

const { server, port } = await serve(html);

try {
  const buffer = await withChrome(async (send) => {
    await send("Page.enable");
    await send("Runtime.enable");
    await send("Page.navigate", { url: `http://127.0.0.1:${port}/` });
    await sleep(1500);

    // 다이나믹 서브셋은 필요한 조각만 늦게 받아간다. 다 받기 전에 인쇄하면
    // 한글이 시스템 폰트로 떨어진 채 굳는다 — 눈에 잘 안 띄는 종류의 실패다.
    await send("Runtime.evaluate", { expression: "document.fonts.ready", awaitPromise: true });
    await sleep(1200);

    // ⚠️ .page 는 overflow:hidden 이라 **넘친 장이 조용히 잘린다.** 실제로 한 번
    // 밟았다(차례의 마지막 문단이 반 줄만 남았다). 높이로는 안 잡히므로
    // scrollHeight 로 본다 — 이 검사가 없으면 열어보기 전엔 모른다.
    const { result } = await send("Runtime.evaluate", {
      expression: `JSON.stringify({
        count: document.querySelectorAll('.page').length,
        overflow: [...document.querySelectorAll('.page')]
          .map((p, i) => ({ pg: i + 1, over: p.scrollHeight - p.clientHeight }))
          .filter((x) => x.over > 1),
      })`,
      returnByValue: true,
    });
    const { count, overflow } = JSON.parse(result.result.value);
    if (count !== groups.length + 2) {
      throw new Error(`장 수가 맞지 않습니다: ${count} (기대: ${groups.length + 2})`);
    }
    if (overflow.length > 0) {
      throw new Error(
        `내용이 넘쳐 잘린 장이 있습니다: ` +
          overflow.map((x) => `${x.pg}장(+${x.over}px)`).join(", ") +
          `\n  줄 수나 여백을 줄이세요 (.rules 의 .rule 개수, .toc li 의 padding).`,
      );
    }

    const pdf = await send("Page.printToPDF", {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
    });
    if (!pdf.result?.data) throw new Error(`printToPDF 실패: ${JSON.stringify(pdf).slice(0, 300)}`);
    return Buffer.from(pdf.result.data, "base64");
  });

  fs.writeFileSync(OUT, buffer);

  // 굽고 나서 장 수를 파일에서 다시 센다. HTML 이 맞아도 인쇄에서 넘칠 수 있고,
  // 그 실패는 열어보기 전엔 안 보인다.
  const printed = (buffer.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(
    `✓ ${path.relative(ROOT, OUT)} — ${printed}장, ${(buffer.length / 1024).toFixed(0)} KB` +
      `\n  질문 ${groups.length}갈래 · 물음 ${groups.length * 2}개 (lib/founder-questions.ts)`,
  );
  const claimed = readClaimedPages();
  if (printed !== claimed) {
    console.error(
      `\n⚠️ 화면에 적힌 장 수와 다릅니다 — lib/site-links.ts 의 FOUNDER_QUESTIONS.pages 가 ` +
        `${claimed} 인데 종이는 ${printed}장입니다.\n  그 값을 ${printed} 로 고치세요 ` +
        `(히어로 타일이 그대로 그립니다).`,
    );
    process.exit(1);
  }
  if (printed !== groups.length + 2) {
    console.error(
      `\n⚠️ 장 수가 기대와 다릅니다 (기대 ${groups.length + 2}). 어딘가에서 넘쳤습니다 — 열어서 확인하세요.`,
    );
    process.exit(1);
  }
} finally {
  server.close();
}
