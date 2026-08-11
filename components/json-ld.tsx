/**
 * schema.org 구조화 데이터를 <script type="application/ld+json"> 으로 박는다.
 *
 * 내용은 lib/seo.ts 가 만든다. 여기는 문자열로 바꿔 넣는 자리일 뿐이다.
 *
 * `<` 를 이스케이프하는 이유: MDX 본문에서 온 문자열에 `</script>` 가 섞이면
 * JSON.stringify 는 그걸 그대로 내보내고, 브라우저는 거기서 스크립트 태그가
 * 끝났다고 읽는다. 그 뒤 글자가 마크업이 되는 자리라 반드시 막아둔다.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
