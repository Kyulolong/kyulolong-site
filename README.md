# 규로롱 홈페이지 (kyulolong-site)

**[kyulolong.com](https://kyulolong.com)** 의 소스코드입니다.

규로롱(kyulolong)은 직장인·인사전문가·창업가의 시선으로 회사 안에서 벌어지는 사람과
일의 문제를 해석하는 개인 사이트입니다. 삼성SDS 인사팀에서 5년, 스타트업에서 2년 일한 뒤
창업한 사람이 운영합니다.

> The source of [kyulolong.com](https://kyulolong.com), a Korean-language site about people,
> organizations, and how work changes with AI.

## 사이트에 있는 것

- [생각들](https://kyulolong.com/thoughts): 글. 조직과 사람 · 일과 성장 · AX · 창업 네 시리즈
- [만든 서비스](https://kyulolong.com/services): AI와 함께 만든 서비스. 서비스마다 AI에게 준
  프롬프트 전문과 걸린 시간, 소스코드를 같이 적어뒀습니다
- [만드는 과정](https://kyulolong.com/videos): 서비스를 만든 과정을 담은 영상 아카이브
- [소개](https://kyulolong.com/about) · [시작하기](https://kyulolong.com/start)

이 저장소도 그 서비스 가운데 하나입니다:
[규로롱 홈페이지 — 만든 과정과 프롬프트](https://kyulolong.com/services/kyulolong-site).

## 구조

- Next.js (App Router) · TypeScript · Tailwind · MDX
- 콘텐츠는 DB 없이 `content/` 의 MDX 파일입니다. 글 하나, 서비스 하나가 파일 하나입니다
  (`content/thoughts/` · `content/services/` · `content/videos/`)
- 서비스들은 별도 저장소·별도 컨테이너로, 같은 도메인의 경로(`kyulolong.com/navigator` 등)에
  붙습니다. 이 저장소는 그 경로들을 쓰지 않습니다
- 로그인 없이 모든 페이지가 열립니다. Supabase 는 로그인 창구(`/login`)와 좋아요·댓글에만 씁니다
- 검색: `app/sitemap.ts` · `app/robots.ts` · `app/feed.xml` (RSS) · `app/llms.txt` · `lib/seo.ts` (메타데이터와 구조화 데이터)

## 로컬에서 띄우기

```bash
npm install
npm run dev              # http://localhost:3000
npm run validate:content # MDX frontmatter 검증 (빌드 때도 돈다)
npm run build
```

## 라이선스

[MIT](LICENSE)
