import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

/**
 * MDX 본문 렌더러.
 *
 * 전에는 여기가 40줄짜리 자체 렌더러였고 문단 / **굵게** / `코드` 세 가지만 알았다.
 * 나머지 문법은 에러 없이 별표나 대괄호가 화면에 그대로 찍혀서, 배포하고 눈으로
 * 보기 전까지 아무도 몰랐다. 이제 진짜 컴파일러가 돌아가므로 목록·소제목·링크·표가
 * 다 된다. (그래서 lib/content/validate.ts 에 있던 '못 그리는 문법' 검사도 걷어냈다)
 *
 * frontmatter 는 loader.ts 의 gray-matter 가 이미 떼어내므로 여기 source 는 본문뿐이다.
 * 파싱을 두 곳에서 하지 않는다.
 */

/**
 * 태그별 스타일. MDX 본문에는 class 를 쓸 수 없으니 여기가 본문 디자인의 유일한 정의다.
 * 값은 docs/DESIGN.md 의 토큰을 따른다.
 */
const components = {
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-ink-soft" {...props} />
  ),

  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="text-ink font-bold" {...props} />
  ),

  /**
   * 기울임을 기울이지 않는다.
   *
   * Pretendard 에는 이탤릭 자체가 없어서 브라우저가 글자를 억지로 기울인 가짜
   * 이탤릭(oblique)을 만드는데, 한글에서는 획이 뭉개져서 읽기 나빠진다.
   * DESIGN.md §5 도 강조는 굵기로 하라고 되어 있다 — strong 은 700, em 은 600.
   */
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="text-ink font-semibold not-italic" {...props} />
  ),

  a: ({ href = "", ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        // 본문 링크에 형광을 쓰지 않는다 (DESIGN.md §2) — 조용한 밑줄로 둔다.
        className="text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        {...props}
      />
    );
  },

  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="marker:text-ink-faint list-disc space-y-2 pl-5" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="marker:text-ink-faint list-decimal space-y-2 pl-5" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="text-ink-soft pl-1.5 leading-relaxed" {...props} />
  ),

  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-ink pt-6 text-xl font-bold tracking-[-0.02em]" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-ink pt-4 font-bold" {...props} />
  ),

  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="border-line-strong text-ink-soft border-l-2 pl-5" {...props} />
  ),

  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="bg-surface-2 text-ink rounded-badge px-1.5 py-0.5 font-mono text-[0.875em]"
      {...props}
    />
  ),
  /**
   * 코드 블록. 안쪽 <code> 의 인라인 배경/패딩을 지워야 블록 안에 알약이 하나 더
   * 그려지지 않는다. 긴 줄은 가로 스크롤로 가둔다 — 페이지가 옆으로 밀리면 안 된다.
   */
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-surface-2 [&_code]:text-ink overflow-x-auto rounded-note p-5 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),

  hr: () => <hr className="border-line border-t" />,

  table: (props: ComponentPropsWithoutRef<"table">) => (
    // 표는 자기 안에서 가로 스크롤한다. 본문 폭을 넘겨 페이지를 밀지 않게.
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.9375rem]" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="border-line text-ink border-b py-2.5 pr-4 font-bold" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-line text-ink-soft border-b py-2.5 pr-4" {...props} />
  ),
};

export async function Prose({ body, className = "" }: { body: string; className?: string }) {
  return (
    <div className={`max-w-[62ch] space-y-5 text-[1.0625rem] ${className}`}>
      <MDXRemote
        source={body}
        components={components}
        // 표 문법은 GFM 확장이라 플러그인 없이는 파이프가 문단에 그대로 찍힌다.
        // 위의 table/th/td 스타일은 이 플러그인이 있어야 실제로 쓰인다.
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
