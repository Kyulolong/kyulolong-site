import { THOUGHT_SERIES, getServices, getThoughts } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, summarize } from "@/lib/seo";

/**
 * https://kyulolong.com/llms.txt — AI 가 이 사이트를 읽을 때 먼저 보는 안내서.
 *
 * ChatGPT · Claude · Perplexity 같은 생성엔진이 검색 도구로 사이트에 들어오면
 * 페이지를 하나씩 긁기 전에 이 파일로 "무엇이 어디 있는지"를 잡는다. 형식은
 * llmstxt.org 의 마크다운 규약 (# 이름 → > 한 줄 요약 → ## 절마다 링크 목록).
 *
 * 손으로 쓰지 않고 콘텐츠에서 만든다. 글이 매주 늘어나는데 손으로 쓴 목록은
 * 두 번째 주부터 틀린다 — sitemap.ts 와 같은 이유다.
 *
 * 구조화 데이터와 같은 규칙: 화면에 있는 사실만 적는다 (lib/seo.ts).
 */
export const dynamic = "force-static";

export function GET() {
  const thoughts = getThoughts()
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  // 시리즈 칩 순서(THOUGHT_SERIES)대로 묶는다. /thoughts 의 필터와 같은 칸이다.
  const thoughtSections = THOUGHT_SERIES.map((series) => {
    const rows = thoughts
      .filter((t) => t.series === series)
      .map((t) => {
        const summary = t.summary ?? summarize(t.body) ?? "";
        return `- [${t.title}](${absoluteUrl(`/thoughts/${t.slug}`)}): ${summary} (${t.publishedAt})`;
      });
    return rows.length ? [`### ${series}`, "", ...rows, ""].join("\n") : "";
  }).filter(Boolean);

  // 팀으로 만든 것은 싣지 않는다 (CLAUDE.md 4번 — 이 목록은 혼자 만든 줄이다).
  const services = getServices()
    .filter((s) => !s.team)
    .map((s) => {
      const state = s.status === "live" ? "" : " (준비 중)";
      return `- [${s.title}](${absoluteUrl(`/services/${s.slug}`)}): ${s.tagline}${state}`;
    });

  const body = [
    `# ${SITE_NAME} (kyulolong)`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "직장인 · 인사전문가 · 창업가의 시선으로 회사 안에서 벌어지는 사람과 일의 문제를 해석하는 개인 사이트입니다.",
    "운영자는 대기업 해외인사 5년, 스타트업 운영총괄 2년을 경험한 스타트업 대표 3년차입니다.",
    "모든 페이지는 로그인 없이 열립니다. 글에 인용한 연구와 기사는 본문에 원문 제목 그대로 링크해 두었습니다.",
    "",
    "## 주요 페이지",
    "",
    `- [소개](${absoluteUrl("/about")}): 운영자가 누구이고 왜 이 사이트를 하는지`,
    `- [생각들](${absoluteUrl("/thoughts")}): 글 목록. 조직과 사람 · 일과 성장 · AX · 창업 네 시리즈`,
    `- [자료실](${absoluteUrl("/resources")}): 무료 목표 설계 가이드와 창업 질문지`,
    `- [Proof 코칭](${absoluteUrl("/proof")}): 5~20인 팀의 업무 기록에 기반한 진단·코칭·변화 확인 과정. 파일럿 준비 중이며 참여 문의 가능`,
    `- [만든 서비스](${absoluteUrl("/services")}): AI와 함께 만든 서비스. 서비스마다 AI에게 준 프롬프트 전문과 걸린 시간을 적고, 소스코드도 대부분 공개`,
    `- [RSS](${absoluteUrl("/feed.xml")}): 글 피드`,
    "",
    "## 글",
    "",
    ...thoughtSections,
    "## 만든 서비스",
    "",
    ...services,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
