import { summarize } from "../seo";
import type { Thought } from "./types";

/**
 * 글 검색 — `/thoughts?q=…`.
 *
 * **서버에서 거른다.** 본문까지 찾으려면 본문이 있어야 하는데, 브라우저로 색인을
 * 내려보내면 100편(drafts/PLAN.md 의 목표)일 때 1MB 가까이 된다 — 지금 12편이
 * 이미 110KB 다. `?q=` 는 `?series=` 와 같은 주소 필터라 공유·뒤로가기·JS 없는
 * 환경이 전부 그냥 된다 (components/filter-bar.tsx 가 링크로만 만든 것과 같은 판단).
 *
 * 규칙은 셋이다.
 *
 * - **띄어쓰기를 무시한다.** `일하는방식` 이 `일하는 방식` 에 걸린다. 한국어는
 *   띄어쓰기가 사람마다 달라서, 이걸 안 하면 "분명 쓴 말인데 안 나온다"가 된다.
 * - **낱말이 여럿이면 전부 들어간 글만.** 하나만 걸려도 내보내면 낱말을 더할수록
 *   결과가 늘어나서, 좁히려고 친 말이 거꾸로 넓힌다.
 * - **제목에 걸린 글이 먼저다.** 제목 → 요약·시리즈·태그 → 본문 순으로 점수를
 *   매기고, 같은 점수끼리는 평소 순서(추천 → 최신)를 그대로 둔다.
 */

/** 주소에 그대로 실리는 값이라 무한정 받지 않는다. 입력 칸의 maxLength 와 같다. */
export const MAX_QUERY_LENGTH = 40;
const MAX_TERMS = 5;

/** 목록 줄의 요약과 같은 길이 (components/thought-row.tsx 의 summarize 110자) */
const EXCERPT_LENGTH = 110;
/** 걸린 낱말 앞에 남길 글자 수. 이보다 멀면 문장 첫머리 대신 어절 경계에서 자른다. */
const EXCERPT_LEAD = 36;

/**
 * `/thoughts` 의 주소. 시리즈 칩과 검색 칸이 같은 규칙으로 만든다 — 한쪽이
 * 다른 쪽 조건을 떨어뜨리면 칩을 누르는 순간 검색이 풀린다.
 */
export function thoughtsHref({ series, query }: { series?: string; query?: string }): string {
  const params = new URLSearchParams();
  if (series) params.set("series", series);
  if (query) params.set("q", query);
  const search = params.toString();
  return search ? `/thoughts?${search}` : "/thoughts";
}

/** 주소의 q 를 화면·링크에 쓸 모양으로 다듬는다. 없으면 빈 문자열. */
export function normalizeQuery(raw: string | undefined): string {
  if (!raw) return "";
  return raw.normalize("NFC").replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH).trim();
}

/** 다듬은 검색어를 낱말로 쪼갠다. 대소문자는 정규식이 무시하므로 여기서는 중복만 걷는다. */
export function queryTerms(query: string): string[] {
  if (!query) return [];
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const term of query.split(" ")) {
    const key = term.toLowerCase();
    if (!term || seen.has(key)) continue;
    seen.add(key);
    terms.push(term);
  }
  return terms.slice(0, MAX_TERMS);
}

/** 글자 사이마다 `\s*` 를 끼운다 — 띄어쓰기를 무시하면서도 원문에서 걸린 자리를 그대로 짚는다. */
function termSource(term: string): string {
  return Array.from(term)
    .map((ch) => ch.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&"))
    .join("\\s*");
}

function termPattern(term: string): RegExp {
  return new RegExp(termSource(term), "iu");
}

/** 한 줄로 서는 조각의 첫머리 — 목록 한 칸, 표 한 줄, 소제목 */
const ITEM_START = /^\s{0,3}(?:[-*+]|\d+\.)\s+|^\s*\|/;
const HEADING = /^\s{0,3}#{1,6}\s+/;

function cleanLine(line: string): string {
  return line
    .replace(/^\s*```.*$/, "") // 코드블록 울타리 (안의 글자는 남긴다)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 이미지
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // 링크는 글자만
    .replace(/<[^>]+>/g, " ") // JSX·HTML 태그
    .replace(/^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/, "") // 표 구분줄 |---|---|
    .replace(/^\s{0,3}(?:#{1,6}|>+|[-*+]|\d+\.)\s+/, "") // 줄머리 기호 (소제목·인용·목록)
    .replace(/\|/g, " ")
    .replace(/[*_`~]/g, "");
}

interface PlainText {
  /** 찾는 데 쓰는 글 전체 — 소제목까지 들어간다 */
  all: string;
  /** 발췌를 떼는 데 쓰는 글 — 소제목을 뺀 문장들 */
  prose: string;
}

/**
 * 색인에 넣을 본문 — 마크다운 기호와 **링크 주소**를 걷어낸 글자만.
 *
 * 주소를 남겨두면 `youtube` 로 찾았을 때 본문에 그 말이 한 번도 없는 글이 걸린다.
 *
 * 조각 경계는 `\n` 으로 남긴다. 문단 하나, 그리고 **목록 한 칸·표 한 줄도 각자
 * 한 조각**이다 — 안 그러면 발췌가 `수행: … 결정: … 평가: …` 처럼 세 칸을 한 줄로
 * 이어 붙인다. 소제목은 찾기에는 넣고 발췌에서는 뒤로 미룬다: "맥그리거가 실제로
 * 쓴 것" 보다 그 아래 문장이 무엇에 대한 글인지 더 많이 말해준다.
 */
function toPlainText(body: string): PlainText {
  const all: string[] = [];
  const prose: string[] = [];

  for (const block of body.normalize("NFC").split(/\n\s*\n/)) {
    let current: string[] = [];
    let heading = false;
    const flush = () => {
      const text = current.join(" ").replace(/\s+/g, " ").trim();
      if (text) {
        all.push(text);
        if (!heading) prose.push(text);
      }
      current = [];
      heading = false;
    };

    for (const line of block.split("\n")) {
      const isHeading = HEADING.test(line);
      if (isHeading || ITEM_START.test(line)) flush();
      heading ||= isHeading;
      current.push(cleanLine(line));
      if (isHeading) flush();
    }
    flush();
  }

  return { all: all.join("\n"), prose: prose.join("\n") };
}

// getThoughts() 가 프로세스 동안 같은 배열을 돌려주므로 글마다 한 번만 만든다.
const plainTextCache = new WeakMap<Thought, PlainText>();

function plainTextOf(thought: Thought): PlainText {
  let text = plainTextCache.get(thought);
  if (text === undefined) {
    text = toPlainText(thought.body);
    plainTextCache.set(thought, text);
  }
  return text;
}

/** [from, to) 안에서 마지막 문장이 끝난 바로 다음 자리. 없으면 from. */
function sentenceStartBefore(text: string, from: number, to: number): number {
  const ends = /[.?!][”’"')\]]*\s/g;
  ends.lastIndex = from;
  let start = from;
  for (let m = ends.exec(text); m && m.index < to; m = ends.exec(text)) {
    start = m.index + m[0].length;
  }
  return start;
}

/**
 * 걸린 낱말이 나온 자리를 한 줄로 떼어낸다.
 *
 * 앞은 되도록 **문장 첫머리부터** 자른다 — "…관점이 사람을" 보다 "그 뒤의 연구들이
 * 보여준 것은…" 이 무엇에 대한 글인지 훨씬 빨리 말해준다. 문장이 너무 길어 낱말이
 * 앞에서 멀면 어절 경계에서 자르고 `…` 을 붙인다. 문단을 넘어가지 않는다.
 */
function excerptAround(text: string, pattern: RegExp): string | undefined {
  const m = pattern.exec(text);
  if (!m) return undefined;
  const hitStart = m.index;
  const hitEnd = m.index + m[0].length;
  const blockStart = text.lastIndexOf("\n", hitStart - 1) + 1;
  const newline = text.indexOf("\n", hitEnd);
  const blockEnd = newline === -1 ? text.length : newline;

  let start = sentenceStartBefore(text, blockStart, hitStart);
  let lead = "";
  if (hitStart - start > EXCERPT_LEAD) {
    start = hitStart - EXCERPT_LEAD;
    const space = text.indexOf(" ", start);
    if (space !== -1 && space < hitStart) start = space + 1;
    lead = "…";
  }

  let end = Math.max(start + EXCERPT_LENGTH, hitEnd);
  let tail = "";
  if (end < blockEnd) {
    const space = text.lastIndexOf(" ", end);
    if (space > hitEnd) end = space;
    tail = "…";
  } else {
    end = blockEnd;
  }

  const body = text.slice(start, end).replace(/\s+/g, " ").trim();
  // 문장이 끝난 자리에서 잘렸으면 말줄임표를 붙이지 않는다 ("…내놓았습니다.…" 가 된다)
  if (/[.?!][”’"')\]]*$/.test(body)) tail = "";
  return `${lead}${body}${tail}`;
}

/** 목록 줄이 요약 자리에 그리는 글. thought-row.tsx 와 같은 규칙이어야 "보이는가"를 맞게 판단한다. */
export function rowSummary(thought: Thought): string | undefined {
  return thought.summary ?? summarize(thought.body, EXCERPT_LENGTH);
}

export interface ThoughtHit {
  thought: Thought;
  /**
   * 요약 자리에 대신 설 본문 발췌. 낱말이 제목·요약·시리즈에서 이미 보이면 없다.
   *
   * 요약만 걸어두면 본문에서만 걸린 글은 **왜 나왔는지가 화면에 없다** — 제목에도
   * 요약에도 그 말이 없으니 검색이 고장 난 것처럼 보인다. 그래서 그 말이 나온
   * 문장을 대신 보여준다.
   */
  excerpt?: string;
}

/** 검색어 낱말이 전부 들어간 글만, 점수 순으로. 낱말이 없으면 받은 그대로 돌려준다. */
export function searchThoughts(thoughts: Thought[], terms: string[]): ThoughtHit[] {
  if (terms.length === 0) return thoughts.map((thought) => ({ thought }));
  const patterns = terms.map(termPattern);

  const hits: (ThoughtHit & { score: number })[] = [];
  for (const thought of thoughts) {
    const title = thought.title.normalize("NFC");
    const summary = rowSummary(thought)?.normalize("NFC") ?? "";
    const body = plainTextOf(thought);

    let score = 0;
    let hidden: RegExp | undefined;
    let missing = false;
    for (const p of patterns) {
      const inTitle = p.test(title);
      const inSummary = p.test(summary);
      const inSeries = p.test(thought.series);
      const inTags = thought.tags.some((tag) => p.test(tag));
      const inBody = p.test(body.all);
      if (!inTitle && !inSummary && !inSeries && !inTags && !inBody) {
        missing = true;
        break;
      }
      score += inTitle ? 4 : inSummary || inSeries || inTags ? 2 : 1;
      // 태그는 목록 줄에 안 그려지므로 "보이는" 칸이 아니다 — 태그로만 걸렸어도 발췌를 붙인다
      if (!inTitle && !inSummary && !inSeries && inBody) hidden ??= p;
    }
    if (missing) continue;

    const excerpt = hidden
      ? (excerptAround(body.prose, hidden) ?? excerptAround(body.all, hidden))
      : undefined;
    hits.push({ thought, score, excerpt });
  }

  // sort 는 안정 정렬이라 같은 점수끼리는 들어온 순서(추천 → 최신)가 그대로 남는다
  return hits.sort((a, b) => b.score - a.score).map(({ thought, excerpt }) => ({ thought, excerpt }));
}

/** 하이라이트용으로 글을 걸린 조각과 아닌 조각으로 나눈다. */
export function splitMatches(text: string, terms: string[]): { text: string; hit: boolean }[] {
  const source = text.normalize("NFC");
  if (terms.length === 0) return [{ text: source, hit: false }];

  // 긴 낱말부터 — `조직과` 와 `조직` 이 같이 있으면 긴 쪽이 먼저 잡혀야 칠이 안 쪼개진다
  const pattern = new RegExp(
    [...terms].sort((a, b) => b.length - a.length).map(termSource).join("|"),
    "giu",
  );

  const parts: { text: string; hit: boolean }[] = [];
  let last = 0;
  for (const m of source.matchAll(pattern)) {
    if (m.index > last) parts.push({ text: source.slice(last, m.index), hit: false });
    parts.push({ text: m[0], hit: true });
    last = m.index + m[0].length;
  }
  if (last < source.length) parts.push({ text: source.slice(last), hit: false });
  return parts;
}
