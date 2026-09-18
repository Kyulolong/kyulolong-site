import { getThoughts } from "@/lib/content";
import { FEED, SITE_DESCRIPTION, SITE_NAME, absoluteUrl, summarize } from "@/lib/seo";

/**
 * https://kyulolong.com/feed.xml — 글(/thoughts) 의 RSS 2.0.
 *
 * 왜 있나: 네이버 서치어드바이저는 사이트맵과 별도로 RSS 를 제출받아, 새 글을
 * 사이트맵보다 빨리 수집한다. 이 채널에서 매주 늘어나는 건 글이라 글만 싣는다 —
 * 서비스·영상은 사이트맵이 이미 싣고 있다.
 *
 * 빌드 때 한 번 굽는다 (force-static). 글은 MDX 라 배포 사이에 바뀌지 않는다.
 */
export const dynamic = "force-static";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * frontmatter 의 날짜는 한국 날짜다. 시각이 없으니 그날 0시(KST)로 적는다 —
 * UTC 로 읽으면 전날 오후 3시가 되어 목록 날짜와 하루 어긋난다.
 */
function rfc822(date: string): string {
  return new Date(`${date}T00:00:00+09:00`).toUTCString();
}

export function GET() {
  // 사이트 목록은 추천 글이 맨 위지만(byFeaturedThenRecent), 피드는 구독기가
  // 발행순으로 읽으므로 날짜로만 다시 줄 세운다.
  const thoughts = getThoughts()
    .slice()
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const items = thoughts
    .map((thought) => {
      const url = absoluteUrl(`/thoughts/${thought.slug}`);
      const description = thought.summary ?? summarize(thought.body) ?? thought.title;
      return [
        "    <item>",
        `      <title>${escapeXml(thought.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${rfc822(thought.publishedAt)}</pubDate>`,
        `      <category>${escapeXml(thought.series)}</category>`,
        `      <description>${escapeXml(description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  // lastBuildDate 는 빌드 시각이 아니라 가장 최근 글의 날짜다. 글이 안 바뀐
  // 재배포마다 날짜가 움직이면 구독기가 없는 새 글을 찾으러 온다.
  const latest = thoughts[0]?.publishedAt;

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(FEED.title)}</title>`,
    `    <link>${absoluteUrl("/thoughts")}</link>`,
    `    <description>${escapeXml(SITE_DESCRIPTION)}</description>`,
    "    <language>ko</language>",
    `    <copyright>${escapeXml(SITE_NAME)}</copyright>`,
    ...(latest ? [`    <lastBuildDate>${rfc822(latest)}</lastBuildDate>`] : []),
    `    <atom:link href="${absoluteUrl(FEED.url)}" rel="self" type="application/rss+xml"/>`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
