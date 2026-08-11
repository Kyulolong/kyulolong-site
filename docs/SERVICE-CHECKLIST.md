# 서비스를 `kyulolong.com/<slug>` 에 올릴 때

**이 문서는 서비스 레포에서 읽는다.** 홈페이지가 지킬 것은 `CLAUDE.md` 에 있고, 여기 있는 건
`auto-prompt` · `wave-sound` 같은 **서비스 앱 쪽**이 해야 하는 일이다.

전부 실제로 한 번씩 밟은 것들이다. 각 항목의 "왜"가 본문이고, 체크박스는 그 요약이다.
새 서비스를 붙일 때 위에서부터 훑으면 된다.

---

## 0. 전제 — 컨테이너는 자기가 어디 얹혔는지 모른다

Traefik 이 `/<slug>` 프리픽스를 **떼고** 컨테이너에 넘긴다. 그래서 앱이 받는 경로는 항상
루트(`/`)다. 자기가 `kyulolong.com/prompt` 에 산다는 걸 알 방법이 런타임에는 없다.

여기서 나오는 사고가 이 문서 절반의 원인이다. 브라우저는 `kyulolong.com/prompt/…` 를 부르는데
앱은 `/…` 를 기준으로 주소를 만들어서, 그 요청이 **홈페이지로 가서 404** 가 난다.

> **증상으로 외워둘 것:** 배포는 성공했는데 흰 화면이거나, 아이콘·이미지만 안 나오거나,
> 홈페이지의 404 페이지가 엉뚱한 자리에서 튀어나오면 거의 항상 이 문제다.

---

## 1. 끝 슬래시는 `/<slug>/` 다

이 사이트의 규약이다. 예외를 만들지 말 것.

- 홈페이지가 `lib/content/types.ts` 의 `withTrailingSlash` 로 frontmatter 의 `url` 을 채워서
  `/prompt/` 로 링크한다.
- `app/sitemap.ts` 도 같은 형태로 내보낸다 (그 파일 주석에 경고가 붙어 있다).
- 밑바탕의 이유: 끝 슬래시가 없으면 브라우저가 상대경로를 **한 단계 위**, 즉 홈페이지 루트
  기준으로 푼다.

`/<slug>` 와 `/<slug>/` 는 둘 다 200 으로 열린다. 그래서 **검색엔진에는 서로 다른 두 문서**이고,
정하지 않으면 평가가 둘로 쪼개진다. 앱의 `canonical` 을 슬래시 붙은 쪽으로 박아야 사이트맵·
내부링크와 신호가 일치한다.

- [ ] `canonical`, `og:url`, JSON-LD 의 `url` 이 전부 `https://kyulolong.com/<slug>/`
- [ ] 매니페스트의 `start_url` · `scope` 도 같은 형태
  (`scope: "/prompt"` 는 접두어 매칭이라 `/promptfoo` 까지 삼킨다)

---

## 2. 자산 경로 — 어디까지 자동이고 어디부터 손인가

빌드 도구가 있으면(Vite 기준) 마운트 경로를 **빌드에 박는다.**

```ts
// vite.config.ts
export default defineConfig({ base: "/prompt/" })
```

라우터가 없는 단일 화면이면 이걸로 끝이다. 끝 슬래시 리다이렉트도, Traefik 라벨 추가도
필요 없어진다. 대가는 로컬 dev 가 `localhost:5173/prompt/` 로 열리는 것뿐.

| 대상 | base 가 자동으로 붙나 | 비고 |
| --- | --- | --- |
| `index.html` 의 `src` / `href` (루트 절대경로) | **된다** | `/icon-32.png` → `/prompt/icon-32.png` |
| import 한 자산 (`import x from "./a.png"`) | **된다** | |
| **코드 안의 평범한 문자열** | **안 된다** | 아래 참고 |
| `manifest.webmanifest` **내용** | **안 된다** | 정적 파일이라 내용은 안 건드린다 |
| `og:image` | **안 된다** | 규격상 절대 URL 이어야 한다 |

**코드 안의 문자열이 제일 잘 놓친다.** `auto-prompt` 에서 이걸로 한 번 깨졌다:

```ts
// ✗ base 가 안 붙는다. 도메인 루트를 때려서 404.
const MODEL_URL = "/models/vosk-model-small-ko.bin";

// ✓ BASE_URL 은 항상 슬래시로 끝난다
const MODEL_URL = `${import.meta.env.BASE_URL}models/vosk-model-small-ko.bin`;
```

`import.meta.env` 의 타입이 없다고 하면 `tsconfig` 의 `types` 배열에 `"vite/client"` 를 넣는다
(배열을 명시하는 순간 자동 탐색이 꺼진다).

빌드가 없는 단일 HTML 앱(`wave-sound`)은 base 개념이 없으므로 **슬러그를 손으로 박는다** —
`href="/wave-sound/manifest.webmanifest"` 처럼.

- [ ] `grep` 으로 코드 안의 `"/`로 시작하는 자산 문자열을 훑었다
- [ ] 매니페스트 안의 경로는 **상대경로**로 (매니페스트 자기 주소 기준이라 알아서 따라온다)

---

## 3. 아이콘 — 앱 안은 하우스 마크, 탭은 자기 얼굴

파비콘을 **선언하지 않으면** 브라우저가 `/favicon.ico` 로 폴백하는데, 그 요청은 홈페이지로
간다. 즉 탭에 뜨는 마크가 자기 것이 아니라 홈페이지 것을 빌려 쓰는 상태가 된다. 홈페이지가
그 파일을 옮기면 조용히 빈 아이콘이 된다.

| 자리 | 무엇을 쓰나 |
| --- | --- |
| 앱 안 헤더 마크 | **하우스 ㄱ+점** (`docs/brand/favicon-16px.svg`). `docs/DESIGN.md` §7 — 서비스마다 로고를 새로 그리지 않는다 |
| 탭 · 홈 화면 아이콘 | **서비스 고유 그림.** `wave-sound` 의 달+파도, `prompt` 의 대본 줄 |

§7 이 금지하는 건 **워드마크 앞에 붙는 마크**다. 파비콘은 별개 슬롯이고, `wave-sound` 가
이미 둘 다 하고 있다 — 헤더에는 같은 ㄱ+점 data URI, 탭에는 자기 PNG.

**16px 로 렌더해서 보기 전엔 완성이 아니다** (§7). `prompt` 의 아이콘은 가는 막대 6줄이라
16px 로 줄이면 회색 덩어리로 뭉갰다. 같은 구성을 3줄로 줄이고 굵힌 광학 보정판을 따로 만들었다
(그 레포의 `brand/icon-16.svg`). 32px 부터는 원본이 그대로 읽혀서 축소만 한다.

원본은 웹 루트가 아니라 `brand/` 같은 서빙 안 되는 폴더에 둔다. `public/` 에 두면 아무도 안
받는 1024 원본이 매 배포마다 이미지에 실린다.

- [ ] `<link rel="icon">` 을 직접 선언했다 (16 · 32)
- [ ] `<link rel="apple-touch-icon">` (180) — 아이패드 홈 화면용
- [ ] 16px 로 실제 렌더해서 눈으로 봤다
- [ ] 원본은 `public/` 밖에 있다

---

## 4. SEO — 소개 페이지와 문구가 겹치면 안 된다

같은 서비스에 문서가 둘이다. `/services/<slug>` 는 **"왜 만들었나"를 읽으러** 오는 곳이고,
`/<slug>/` 는 **"지금 쓰러"** 오는 곳이다. 같은 제목·설명을 둘이 나눠 들면 검색에서 서로를
갉아먹는다.

그래서 **앱의 canonical 을 소개 페이지로 넘기지 않는다.** 넘기는 순간 정작 도구가 색인에서
빠진다. 각자 자기 자신을 가리키고, 문구로 의도를 가른다.

앱 `index.html` 에 들어갈 것:

- [ ] `<title>` — 이름 + 실제로 검색되는 말 (예: "텔레프롬프터")
- [ ] `<meta name="description">` — 소개 페이지의 tagline 과 다른 문장
- [ ] `<link rel="canonical">` — 끝 슬래시
- [ ] `og:type` `og:site_name` `og:locale` `og:url` `og:title` `og:description` `og:image`
      (+ `width` `height` `alt`)
- [ ] `twitter:card=summary_large_image` + title · description · image
- [ ] JSON-LD (`WebApplication`) — **별점(`aggregateRating`)은 넣지 않는다.** 받은 적 없는
      평가를 적는 건 정책 위반이고 적발되면 리치 결과가 사이트 단위로 막힌다
- [ ] `<noscript>` — 클라이언트 렌더링 앱은 JS 가 꺼지면 빈 div 하나만 남는다. 화면에 있는
      것과 **같은 말**만 적을 것 (다른 말을 심으면 그게 클로킹이다)

### 공유 카드는 앱이 만들고, 홈페이지가 가리킨다

1. 앱에 `og.png` (1200×630) 를 만들어 `/<slug>/og.png` 로 서빙한다
2. **배포해서 실제로 `image/png` 가 돌아오는지 확인한다**
3. 그 다음에 `content/services/<slug>.mdx` 에 한 줄 추가한다

```yaml
ogImage: /prompt/og.png
```

순서가 중요하다. 앱보다 홈페이지를 먼저 배포하면 그 사이 카드가 빈칸이 된다.

`thumbnail` 로 겸할 수 없다 — 썸네일은 목록 격자에 들어가는 SVG 일러스트고, 카톡·슬랙·X 는
SVG 를 `og:image` 로 받지 않는다. `lib/seo.ts` 의 `shareableImage()` 가 SVG 를 걸러 기본 카드로
떨어뜨리므로, 비워두면 예전과 똑같이 동작한다.

`robots.txt` 와 `sitemap.xml` 은 **서비스 레포에서 손댈 수 없다.** 규격상 오리진 루트에만 놓을
수 있고 그 자리는 홈페이지 차지다. 앱은 사이트맵에 자동으로 실린다 (`app/sitemap.ts` 가
`status: live` 이고 `url` 이 `/` 로 시작하는 서비스를 전부 넣는다).

---

## 5. 로그인과 저장 — 이미 깔려 있는 것을 쓴다

서비스끼리 토큰을 넘기는 코드는 **필요 없다.** `kyulolong.com/*` 이 전부 같은 오리진이라
localStorage 를 공유한다. 키 이름만 맞추면 홈페이지에서 한 로그인이 그대로 따라온다.

```ts
createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "kyulolong.auth" },
})
```

- **`storageKey` 를 바꾸지 말 것.** 기본값은 프로젝트 URL 마다 달라서, 안 맞추면 같은
  오리진인데도 서비스마다 따로 로그인하게 된다.
- **반드시 같은 Supabase 프로젝트여야 한다.** 다른 프로젝트 키를 같은 storageKey 로 쓰면
  두 앱이 서로의 토큰을 덮어써서 양쪽 로그인이 다 깨진다.
- **계정은 '처음 저장할 때' 만든다.** 페이지를 열 때 익명 세션을 만들면 그냥 들렀다 가는
  사람까지 `auth.users` 에 쌓여 전부 쓰레기가 된다.
- **익명 세션은 그 브라우저에만 남는다.** 기기 간 이동은 계정이 있어야 되므로, 그 한계를
  숨기지 말고 `/login?next=/<slug>/` 로 안내한다. 홈페이지 로그인 페이지에 익명→계정
  **승격** 경로가 이미 있어서 저장해둔 것이 고아가 되지 않는다.
- **RLS 가 유일한 방어선이다.** anon 키는 정적 번들에 박혀 공개된다(정상이다). 정책을
  빼먹으면 그 순간 아무나 남의 데이터를 읽고 지운다. `using` 과 `with check` 를 둘 다 건다.
- **테이블 이름에 서비스 접두어를 붙인다** (`prompt_scripts`, `sea_mixes`). 프로젝트 하나를
  여러 서비스가 나눠 쓴다.

자체 호스팅이라 대시보드 토글이 없는 것이 있다. 익명 로그인은 auth 컨테이너의 환경변수다:

```
GOTRUE_EXTERNAL_ANONYMOUS_USERS_ENABLED=true
```

- [ ] `storageKey: "kyulolong.auth"`
- [ ] RLS 정책 4종 (select · insert · update · delete), `to authenticated`
- [ ] 익명 세션은 첫 저장 때만
- [ ] 로그인 없이도 앱의 본래 기능이 전부 된다 (로그인은 문이 아니라 덤)

---

## 6. 컨테이너 — Dockerfile 과 nginx

Coolify 빌드팩을 **Dockerfile** 로 바꾸고 포트는 **80**.

`Use Docker Build Secrets` 는 **켜지 말 것.** 켜면 빌드 변수가 `--build-arg` 가 아니라
BuildKit 시크릿으로 넘어가서 `ARG` 로 받는 값이 안 들어온다.

빌드 타임에 박히는 값(`VITE_*`)은 Coolify 환경변수에서 **`Available at Buildtime`**
(구버전 표기: `Build Variable`)을 켜야 한다. 정적 앱이라 런타임 env 는 아무도 읽지 않는다.

```dockerfile
ARG VITE_SUPABASE_URL=""
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
RUN npm run build
```

값이 비어도 앱이 죽지 않게 짤 것. `auto-prompt` 는 키가 없으면 보관함 UI 를 통째로 안 그리고,
`supabase-js` 가 죽은 코드가 되어 번들에서 사라진다 — 키를 넣기 전에 배포해도 아무것도 안 깨진다.

### nginx 의 SPA fallback 함정

`try_files $uri $uri/ /index.html` 은 **없는 파일에도 200 으로 index.html 을 준다.** 실패가
조용해진다:

- 모델·데이터 파일이 없으면 라이브러리가 HTML 을 데이터로 알고 씹는다
- `og:image` 자리에서 카톡이 HTML 을 받아 카드가 깨지는데, 응답이 200 이라 원인이 안 보인다

그래서 정적 자산은 fallback 에서 뺀다.

```nginx
location /assets/            { try_files $uri =404; }
location /models/            { try_files $uri =404; }
location ~* ^/[^/]+\.(png|svg|ico|webmanifest)$ { try_files $uri =404; }
location /                   { try_files $uri $uri/ /index.html; }
```

정규식 location 이 prefix 보다 우선하므로 `^/[^/]+` 로 **루트 한 칸에만** 걸리게 묶는다.
안 그러면 `/assets/` 안의 이미지까지 새서 캐시 헤더를 잃는다.

**`add_header` 는 상속되지 않는다.** location 이 자기 `add_header` 를 하나라도 선언하면
server 의 것이 통째로 빠진다. 헤더를 쓰는 location 마다 다시 적어야 한다.

`.webmanifest` 는 기본 mime.types 에 없는 버전이 있다. 못을 박지 않으면
`application/octet-stream` 으로 나가고 브라우저가 매니페스트를 통째로 무시한다.

```nginx
location = /manifest.webmanifest {
    types { }
    default_type application/manifest+json;
    # server 의 헤더가 필요하면 여기 다시 적을 것
}
```

`SharedArrayBuffer` 를 쓰는 앱(WASM 스레드)은 COOP/COEP 가 필요하다. supabase-js 는 CORS 모드
fetch 라 `require-corp` 와 충돌하지 않는다.

- [ ] Coolify 빌드팩 = Dockerfile, 포트 80
- [ ] `Available at Buildtime` 체크, `Use Docker Build Secrets` 해제
- [ ] 정적 자산은 SPA fallback 에서 뺐다

---

## 7. 배포 순서

1. **서비스 앱** 먼저 (og.png · 아이콘이 실제로 서빙되기 시작한다)
2. 확인 (아래 8번)
3. **홈페이지** — `ogImage` 한 줄 추가한 것을 배포

반대로 하면 그 사이 공유 카드가 빈칸이 된다.

환경변수를 바꿨으면 **재시작이 아니라 재빌드**여야 한다. 빌드 타임에 박히는 값이다.

---

## 8. 배포 후 검증 — 눈으로 말고 찔러서

`<slug>` 만 바꿔서 그대로 붙여 쓴다.

```bash
S=prompt

# 끝 슬래시 양쪽이 같은 canonical 을 가리키는가
curl -s https://kyulolong.com/$S/  | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://kyulolong.com/$S   | grep -o 'rel="canonical" href="[^"]*"'

# og.png 가 진짜 이미지인가 (text/html 이면 SPA fallback 에 먹힌 것)
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://kyulolong.com/$S/og.png

# 없는 파일이 404 로 죽는가 (200 이면 fallback 이 아직 안 막힌 것)
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://kyulolong.com/$S/nope.png

# 매니페스트 타입과 경로
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" https://kyulolong.com/$S/manifest.webmanifest

# 소개 페이지가 서비스 카드를 가리키는가
curl -s https://kyulolong.com/services/$S | grep -o '<meta property="og:image[^>]*>'

# 사이트맵에 앱이 실렸는가 (끝 슬래시 확인)
curl -s https://kyulolong.com/sitemap.xml | grep -o "<loc>[^<]*$S[^<]*</loc>"
```

카톡·페이스북은 OG 를 오래 캐싱한다. 전에 공유한 적 있는 주소면
[공유 디버거](https://developers.facebook.com/tools/debug/)에서 `Scrape Again` 을 눌러야 갱신된다.
카톡은 갱신 도구가 없어 며칠 걸린다.

---

## 참고

- 홈페이지가 지킬 것 · URL 구조 · 인증 · 검색 → `CLAUDE.md` (§2 · §11 · §12)
- 색·타이포·브랜드 마크 → `docs/DESIGN.md` (§2 형광 예산 · §7 마크)
- 메타데이터 생성 → `lib/seo.ts` (`pageMetadata` · `shareableImage`)
- 서비스 frontmatter 스키마 → `lib/content/types.ts`
- 다 해본 예시 → [`Kyulolong/auto-prompt`](https://github.com/Kyulolong/auto-prompt)
  (`vite.config.ts` · `index.html` · `nginx.conf` · `Dockerfile` · `src/lib/supabase.ts`)
