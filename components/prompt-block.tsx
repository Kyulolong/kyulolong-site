import Link from "next/link";
import { INTERNAL_LINKS } from "@/lib/site-links";

/**
 * 서비스 상세의 "시작점" 블록.
 *
 * 결과물만 보여주면 "역시 되는 사람은 되네"로 끝난다는 게 이 채널의 전제다.
 * 그래서 만든 것 바로 아래에 **빈 화면 대신 쓸 수 있는 프롬프트**를 놓는다.
 * 여기가 랜딩의 "0부터 시작하지 마세요"가 실물로 착지하는 자리다.
 *
 * 프롬프트를 `<pre>` 로 그대로 두는 이유: 복사 버튼은 JS 가 필요해서 이 페이지를
 * 클라이언트 컴포넌트로 만들어야 하는데, 드래그 복사로 충분한 일에 그걸 치르지 않는다.
 *
 * ⚠️ 아래 접힘 상자는 **요약만** 둔다. 설치 순서·저장할 때의 함정·에러 대처는 전부
 * /start 로 옮겼다 (app/start/page.tsx). 여기서 늘리면 안 되는 이유가 둘이다 —
 * 프롬프트를 보러 온 사람 앞에서 그게 본문보다 길어지고, 서비스가 60개가 되면
 * 같은 글이 60번 실린다. 여기는 "고를 수 있게"까지만, 그다음은 링크가 받는다.
 */
export function PromptBlock({ prompt, title }: { prompt: string; title: string }) {
  return (
    <section className="border-line mt-14 border-t pt-12">
      <h2 className="text-2xl font-bold tracking-[-0.02em]">이렇게 시켰습니다</h2>
      <p className="text-ink-soft mt-3 max-w-[46ch] text-pretty">
        {title}을 지금 다시 만든다면 AI에게 이렇게 넘기겠습니다.
        그대로 복사해서 붙여넣고, 마음에 안 드는 부분만 바꾸세요.
      </p>

      <pre className="border-line bg-surface-2 text-ink mt-6 overflow-x-auto rounded-note border px-6 py-6 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
        {prompt}
      </pre>

      {/* 걸린 시간 얘기가 여기 붙는 이유: 프롬프트만 보면 "한 방에 나왔겠네"로 읽힌다.
          MVP 와 마무리를 갈라놓지 않으면 따라 하는 사람이 첫날에 좌절한다. */}
      <p className="text-ink-faint mt-4 max-w-[52ch] text-sm text-pretty">
        여기 적힌 시간은 <strong className="text-ink-soft font-semibold">쓸 만한 게 처음 돌아가기까지</strong>입니다.
        그 뒤에 디테일을 잡는 데 보통 하루 이틀이 더 들고, 지금도 필요할 때 업데이트 하고 있습니다.
      </p>

      <details className="border-line group mt-8 rounded-note border px-6 py-5">
        <summary className="cursor-pointer list-none font-bold [&::-webkit-details-marker]:hidden">
          <span className="text-ink-faint mr-2 inline-block transition-transform group-open:rotate-90">
            ▸
          </span>
          처음이라면 — 뭘 깔고 어디에 붙여넣나
        </summary>
        <div className="text-ink-soft mt-5 space-y-5 text-[0.9375rem]">
          <p>
            저는 Claude Code를 씁니다. 하지만 위 프롬프트는 특정 도구용이 아니라서
            아무 데나 붙여넣어도 됩니다. 셋 중 편한 걸로 시작하세요.
          </p>
          <ol className="space-y-3">
            <li>
              <strong className="text-ink font-bold">1. 설치 없이 — 브라우저 챗봇</strong>
              <br />
              쓰던 챗봇에 붙여넣고 &ldquo;하나의 HTML 파일로 만들어줘&rdquo;를 덧붙이세요.
              나온 코드를 저장해 더블클릭하면 그 자리에서 돌아갑니다. 5분, 무료.
            </li>
            <li>
              <strong className="text-ink font-bold">2. 제대로 — 터미널에서 CLI</strong>
              <br />
              파일을 여러 개 만들고 스스로 고쳐가며 돌려보는 건 이쪽만 됩니다.
              여기 있는 것들은 전부 이 방식으로 만들었습니다. 30분.
            </li>
            <li>
              <strong className="text-ink font-bold">3. 남한테 맡기고 — 웹 빌더</strong>
              <br />
              v0, Bolt, Lovable 같은 데에 붙여넣으면 화면까지 알아서 띄워줍니다.
              빠른 대신 나중에 손대기가 답답해집니다.
            </li>
          </ol>
          <p>
            어느 쪽이든 <strong className="text-ink font-bold">한 번에 완성될 거라고 기대하지 마세요.</strong>{" "}
            저는 대충 돌아가는 걸 먼저 받고, 거슬리는 걸 하나씩 말해서 고칩니다.
            에러가 뜨면 읽으려 하지 말고 통째로 복사해서 그대로 붙여넣으면 됩니다.
            저도 1년 동안 그렇게만 했습니다.
          </p>
          {/* 터미널을 처음 여는 사람에게는 위 세 줄이 여전히 불친절하다.
              그 사람이 실제로 막히는 자리(창을 어떻게 여는지, 파일이 왜
              index.html.txt 로 저장되는지, 돈이 드는지)는 전부 /start 가 받는다. */}
          <p className="text-ink-faint text-sm">
            터미널을 한 번도 안 열어보셨다면{" "}
            <Link
              href={INTERNAL_LINKS.start}
              className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
            >
              설치부터 순서대로 적어둔 곳
            </Link>
            이 따로 있습니다. 맥·윈도우 명령어와 막혔을 때 할 일까지 있습니다.
          </p>
        </div>
      </details>
    </section>
  );
}
