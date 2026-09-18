#!/usr/bin/env node
/**
 * IndexNow 핑 — 새 글·고친 페이지를 검색엔진에 바로 알린다.
 *
 *   npm run indexnow                          # 운영 사이트맵의 주소 전부
 *   npm run indexnow -- /thoughts/<slug> ...  # 고른 주소만 (경로 또는 전체 주소)
 *
 * api.indexnow.org 한 곳에 보내면 참여 엔진(Bing · 네이버 · Yandex · Seznam …)이
 * 같이 받는다. Bing 색인은 ChatGPT 검색과 Copilot 이 쓰는 색인이기도 하다.
 * 구글은 IndexNow 를 받지 않는다 — 구글은 사이트맵의 lastmod 로 간다.
 *
 * ⚠️ **배포가 끝난 뒤에** 돌린다. 엔진이 핑을 받자마자 주소를 열러 오는데, 그때
 *    새 글이 아직 운영에 없으면 404 를 받아 간다. 그리고 엔진은 키 파일
 *    (public/<KEY>.txt)이 운영에서 열리는지로 소유를 확인하므로, 키 파일이 배포되기
 *    전에도 핑이 거절된다. 그래서 이 스크립트는 핑 전에 키 파일부터 확인한다.
 *
 * 키는 비밀이 아니다 — 누구나 열 수 있는 주소에 있어야 동작하는 값이다.
 * 바꾸려면 public/ 의 파일 이름·내용과 아래 KEY 를 같이 바꾼다.
 */

const HOST = "kyulolong.com";
const ORIGIN = `https://${HOST}`;
const KEY = "3ef27eadd902aba2dbe82deb2f06373f";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml 을 못 읽었습니다 (${res.status})`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function toUrl(arg) {
  if (arg.startsWith("http")) return arg;
  return `${ORIGIN}${arg.startsWith("/") ? "" : "/"}${arg}`;
}

async function main() {
  const args = process.argv.slice(2);
  const urls = args.length ? args.map(toUrl) : await sitemapUrls();

  // 남의 호스트 주소가 섞이면 IndexNow 가 요청 전체를 422 로 돌려보낸다.
  const foreign = urls.filter((u) => new URL(u).host !== HOST);
  if (foreign.length) throw new Error(`다른 호스트 주소가 섞였습니다: ${foreign.join(", ")}`);

  const keyRes = await fetch(KEY_LOCATION);
  const keyBody = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (keyBody !== KEY) {
    throw new Error(
      `키 파일이 운영에서 안 열립니다 (${KEY_LOCATION} → ${keyRes.status}). 배포가 끝난 뒤 다시 돌리세요.`,
    );
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
  });

  // 200 = 받음, 202 = 받았고 키 확인은 나중에. 둘 다 성공이다.
  if (res.status !== 200 && res.status !== 202) {
    throw new Error(`IndexNow 가 거절했습니다 (${res.status}): ${await res.text()}`);
  }
  console.log(`IndexNow ${res.status} — 주소 ${urls.length}개를 알렸습니다.`);
  for (const u of urls) console.log(`  ${u}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
