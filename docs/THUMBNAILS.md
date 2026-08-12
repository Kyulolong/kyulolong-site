# 서비스 썸네일 — 무엇으로, 어떻게 뽑는가

`public/services/<slug>.svg` 를 만드는 방법이다. 카드가 이걸 `mix-blend-multiply` 로
파스텔 종이 위에 얹으므로(`components/thumbnail.tsx`) **바탕은 반드시 순백**이어야 한다.

## 출처

전부 **Recraft V4.1** 로 뽑았다. 처음 여섯 장은 Recraft 를 직접 썼고(파일 안의 C2PA
매니페스트에 `recraft.ai` 서명이 남아 있다), `kyulolong-site` · `trick` · `perplz`
세 장은 힉스필드 MCP 가 물고 있는 같은 모델(`recraft_v4_1`)로 다시 뽑았다.

Recraft 를 쓰는 이유는 **SVG 를 네이티브로 뱉기 때문**이다. 래스터 모델로 뽑으면
PNG 가 나오고, 그러면 벡터로 따는 공정이 하나 더 붙는다.

> ⚠️ 힉스필드 구독은 해지 예정이다. 해지 후에는 아래 "힉스필드 없이" 절을 볼 것.

## 파라미터

```jsonc
{
  "model": "recraft_v4_1",
  "model_type": "vector",        // ← 이게 SVG 를 만든다. standard 는 래스터풍
  "aspect_ratio": "3:2",         // 카드가 aspect-[3/2]
  "resolution": "2k",
  "background_color": "#FFFFFF",
  "colors": ["#1A1A17", "#8FFF00", "#FAF3E0", "#FFFFFF", "#D9D7CC"]
}
```

`colors` 는 **구속이 아니라 힌트**다. 넣어도 색이 새는 일이 있다 (아래 함정 참고).

## 프롬프트

`{주제}` 한 문장 뒤에 아래 스타일 꼬리를 그대로 붙인다.

```
{주제 한두 문장. 무엇이 그려지고, 그중 무엇 하나가 형광 초록인지.}

Flat vector illustration, thin clean near-black outlines, no drop shadow,
no gradients, no shading, no text or letters or numbers anywhere.
Only these colors: near-black #1A1A17, warm cream #FAF3E0, pure white,
light warm gray #D9D7CC, and one acid green #8FFF00 accent
— not olive, not yellow, not lime.
Pure white background, centered composition.
Minimal editorial tech-brand illustration.
```

실제로 쓴 주제문 셋:

| 슬러그 | 주제문 |
|---|---|
| `kyulolong-site` | A browser window seen straight on, rounded corners, three small dots at the left of its title bar and a long pill-shaped address bar beside them. Inside the window sits a neat grid of four content cards; the top-left card is filled solid acid green, the other three each show a small placeholder image block and two short rounded text bars. |
| `trick` | Five playing cards fanned out in a wide symmetrical arc, pinched together at the bottom center, the fan filling most of the frame. The card in the middle faces forward and is filled solid acid green #8FFF00, with one clear dark concentric circle target symbol drawn in its center; the four cards behind it are plain cream and white card backs. Three four-pointed sparkle stars float around the fan. |
| `perplz` | Two big overlapping outlined circles forming a Venn diagram that spans nearly the whole frame, one filled warm cream and one filled pure white, with the almond-shaped intersection filled solid bright acid green #8FFF00. |

## 함정 셋 — 전부 한 번씩 밟았다

**1. 형광색을 "yellow-green" 이라고 부르면 노랑이 나온다.**
`#8FFF00` 을 숫자로 적어도 소용없다. `vivid pure yellow-green` 이라고 쓴 판은
네 번 중 네 번 다 `#FAF514` 같은 순노랑으로 나왔다. `acid green #8FFF00 — not
olive, not yellow, not lime` 로 적을 것. 그래도 새면 fill 값 하나를
`rgb(143,255,0)` 로 치환한다 (지금 `trick.svg` 가 그렇게 고친 것이다).

**2. 뽑은 걸 손대면 C2PA 서명이 무효가 된다.**
색을 치환하거나 도형을 지웠으면 `<metadata>` 의 매니페스트를 **떼어낼 것**.
검증에 실패하는 서명을 달고 다니는 게 서명이 없는 것보다 나쁘다.
지금 `trick.svg` · `perplz.svg` 에 매니페스트가 없는 이유가 이거다.

**3. 프레임 가장자리에 부스러기가 남는다.**
잘린 도형 조각이 아래쪽에 남는 일이 있다. 카드는 `object-cover` 라 가장자리를
조금 잘라내지만 전부 가려주지는 않는다. 뽑은 뒤 도형 목록을 한 번 훑을 것.

## 확인하는 법

로컬에 SVG 래스터라이저가 없어도 macOS 의 `qlmanage` 로 볼 수 있다.
정사각으로 잘라 미리보므로, 3:2 를 다 보려면 viewBox 를 정사각으로 늘려서 본다.

```bash
python3 - <<'EOF'
s = open("x.svg").read()
s = s.replace('viewBox="0 0 2560 1664"', 'viewBox="0 -448 2560 2560"')
s = s.replace('width="2560" height="1664"', 'width="2560" height="2560"')
open("sq.svg","w").write(s)
EOF
qlmanage -t -s 1000 -o . sq.svg   # → sq.svg.png
```

## 힉스필드 없이 — 손으로 그릴 때 지킬 것

구독을 끊으면 이 그림들은 **SVG 를 직접 써서** 만든다. 그때 원본 아홉 장과
붙여 놓아도 티가 안 나게 하려면 아래가 전부다.

**선 두께가 유일한 관건이다.** 처음에 손으로 그린 세 장이 눈에 띈 이유가 이거였다 —
`stroke-width="16"`(2048 기준)으로 **일정하게** 그었는데, Recraft 판은 선이 아니라
윤곽을 채운 면이라 자리마다 **6~18 사이로 흔들린다.** 굵기 자체보다 그 흔들림이 없는 게
"일러스트가 아니라 UI 아이콘"으로 읽히게 만든다.

- `stroke-width` 는 **6~10** (2048×1331 viewBox 기준). 16 은 너무 굵다
- 큰 윤곽은 굵게, 안쪽 디테일은 절반으로. 한 파일에 굵기가 **두세 종류**는 있어야 한다
- `stroke-linejoin="round"` 를 걸 것. 기본 miter 의 뾰족한 모서리가 기계로 그린 티를 낸다
- 색은 다섯 개까지: `#1A1A17` `#FAF3E0` `#FFFFFF` `#D9D7CC` `#8FFF00`
- 형광 `#8FFF00` 은 **한 덩어리만**. 그림에서 제일 중요한 하나에만 (DESIGN.md)
- 바탕은 순백 전면 `<rect>`. 카드가 multiply 로 녹인다
- 글자·숫자는 넣지 않는다. 카드 밑에 제목이 이미 있다
- 그림자·그라데이션 없음
