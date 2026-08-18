import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Thumbnail } from "@/components/thumbnail";
import { pageMetadata } from "@/lib/seo";
import { INTERNAL_LINKS } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "시작하기",
  description:
    "터미널을 한 번도 안 열어봤어도 됩니다. 뭘 깔고, 어디에 붙여넣고, 막히면 어떻게 하는지 순서대로 적어뒀습니다. 세 갈래 중 두 갈래는 무료입니다.",
  path: "/start",
});

/**
 * 서비스 상세의 접힘 상자(components/prompt-block.tsx)가 원래 이 내용을 세 문단으로
 * 갖고 있었다. 그 글의 결함은 톤이 아니라 **가정**이었다 — "빈 폴더에서 실행한 뒤"는
 * 터미널을 열 줄 아는 사람에게만 성립하는 한 줄이고, 이 채널이 말을 거는 상대는
 * 정확히 거기서 멈춘다.
 *
 * 그래서 안내를 이 한 페이지로 옮겼다. 상자는 요약과 링크만 남는다.
 * 서비스가 60개가 돼도 이 글은 여기 한 곳만 고치면 된다.
 *
 * 규칙 셋:
 *   1. 클라이언트 JS 를 쓰지 않는다. OS 탭·토글을 두는 대신 맥과 윈도우를 둘 다 적는다.
 *      탭은 접힌 쪽을 검색엔진과 Ctrl+F 에서 지운다 — 이 페이지에서 그건 손해다.
 *   2. 돈이 드는 자리를 숨기지 않는다. 설치까지 따라온 사람이 로그인 화면에서
 *      막히면, 여기까지 쓴 글이 전부 무의미해진다.
 *   3. 형광(--acid)은 이 페이지에 없다. 랜딩 히어로가 이 사이트의 형광 한 점이고
 *      여기는 본문이다 (DESIGN.md §2).
 */

const ROUTES = [
  {
    id: "chatbot",
    src: "/start/chatbot.svg",
    label: "브라우저 챗봇",
    time: "5분 · 무료",
    title: "설치 없이",
    summary: "쓰던 챗봇에 붙여넣고, 나온 코드를 파일 하나로 저장해 더블클릭합니다.",
    who: "일단 뭐라도 눈앞에서 돌아가는 걸 보고 싶은 분",
  },
  {
    id: "cli",
    src: "/start/cli.svg",
    label: "터미널에서 CLI",
    time: "30분 · 유료 또는 무료",
    title: "제대로",
    summary: "파일을 여러 개 만들고 스스로 고쳐가며 돌려보는 건 이쪽만 됩니다.",
    who: "여기 있는 것들을 실제로 가져다 쓰고 싶은 분",
  },
  {
    id: "builder",
    src: "/start/builder.svg",
    label: "웹 빌더",
    time: "5분 · 부분 무료",
    title: "남한테 맡기고",
    summary: "붙여넣으면 화면도 주소도 알아서 만들어줍니다. 대신 나중에 손대기 어렵습니다.",
    who: "내일까지 누군가에게 보여줘야 하는 분",
  },
] as const;

/** 그대로 복사해 붙일 줄. 프롬프트 블록의 <pre> 와 같은 얼굴이다. */
function Cmd({ os, children }: { os?: string; children: string }) {
  return (
    <div className="mt-3">
      {os ? <p className="text-ink-faint mb-1.5 text-[13px] font-semibold">{os}</p> : null}
      <pre className="border-line bg-surface-2 text-ink overflow-x-auto rounded-[16px] border px-5 py-4 font-mono text-[0.8125rem] leading-relaxed whitespace-pre-wrap">
        {children}
      </pre>
    </div>
  );
}

/** 한 단계. 번호는 고정폭 숫자로 세운다 (CLAUDE.md 7번 — 고정폭은 숫자에만). */
function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <li>
      <h3 className="flex items-baseline gap-3 text-[1.0625rem] font-bold tracking-[-0.01em]">
        <span className="text-ink-faint w-6 shrink-0 font-mono text-sm tabular-nums">{n}</span>
        <span className="min-w-0 flex-1">{title}</span>
      </h3>
      <div className="text-ink-soft mt-2.5 space-y-3 pl-9 text-[0.9375rem]">{children}</div>
    </li>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
    >
      {children}
    </a>
  );
}

/** 섹션 제목. 앵커로 뛰어올 때 sticky 헤더(h-16)에 가리지 않게 scroll-mt 를 준다. */
function RouteHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-line scroll-mt-24 border-t pt-10" id={id}>
      {/* 고정폭·자간 벌림을 쓰지 않는다. 이 라벨은 한글이라 고정폭 스택에 글자가 없어서
          시스템 폰트로 떨어지고, 0.12em 자간까지 걸면 "설 치  없 이"처럼 벌어진다.
          대문자 라벨의 그 조판은 라틴 문자용이다 (CLAUDE.md 7번). */}
      <p className="text-ink-faint mb-3 text-[13px] font-semibold">{eyebrow}</p>
      <h2 className="text-2xl font-bold tracking-[-0.02em]">{title}</h2>
      {children ? <p className="text-ink-soft mt-3 text-pretty">{children}</p> : null}
    </header>
  );
}

export default function StartPage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 sm:px-8">
      <div className="mx-auto max-w-[46rem]">
        <PageHeader
          eyebrow="start"
          title="설치부터 첫 화면까지"
          description="터미널을 한 번도 안 열어봤어도 됩니다. 순서대로 따라오시면 오늘 만든 것이 화면에서 돌아갑니다."
        />

        {/* 준비물과 비용을 맨 위에 둔다. 이걸 뒤에 숨기면 설치까지 따라온 사람이
            로그인 화면에서 막히고, 그때는 이미 이 글을 믿지 않게 된다. */}
        <section className="bg-paper-sand rounded-[28px] px-7 py-9 sm:px-10 sm:py-11">
          <h2 className="text-xl font-bold tracking-[-0.02em]">먼저 알고 시작하세요</h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-[0.9375rem] font-bold">걸리는 시간</dt>
              <dd className="text-ink-soft mt-1 text-[0.9375rem] text-pretty">
                처음 세팅에 30분. 그다음부터는 0분입니다. 이 페이지를 두 번 볼 일은 없습니다.
              </dd>
            </div>
            <div>
              <dt className="text-[0.9375rem] font-bold">필요한 것</dt>
              <dd className="text-ink-soft mt-1 text-[0.9375rem] text-pretty">
                맥이나 윈도우 컴퓨터, 인터넷. 그게 전부입니다. 코딩 지식은 필요 없고,
                프로그램을 미리 깔아둘 것도 없습니다.
              </dd>
            </div>
            <div>
              <dt className="text-[0.9375rem] font-bold">드는 돈</dt>
              <dd className="text-ink-soft mt-1 text-[0.9375rem] text-pretty">
                아래 세 갈래 중 <strong className="text-ink font-bold">두 갈래는 무료</strong>입니다.
                제가 쓰는 Claude Code는 유료 구독(Pro, 월 20달러)이 필요하고 무료 플랜에는
                들어 있지 않습니다. 돈을 안 쓰고 같은 방식으로 하고 싶으면 무료인 Gemini CLI가 있고,
                그 방법도 아래에 적어뒀습니다.
              </dd>
            </div>
          </dl>
        </section>

        {/* ── 세 갈래 고르기 ─────────────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-[-0.02em]">셋 중 하나를 고르세요</h2>
          <p className="text-ink-soft mt-3 max-w-[42ch] text-pretty">
            프롬프트는 특정 도구용이 아닙니다. 어디에 붙여넣어도 됩니다.
            지금 상태에서 제일 부담 없는 걸 고르시면 되고, 나중에 갈아타도 됩니다.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {ROUTES.map((route) => (
              <li key={route.id}>
                <a
                  href={`#${route.id}`}
                  className="group border-line bg-canvas hover:shadow-lift block h-full rounded-[24px] border p-3 transition-[transform,box-shadow] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5"
                >
                  <Thumbnail
                    src={route.src}
                    label={route.label}
                    tone="guide"
                    sizes="(min-width: 640px) 15rem, 100vw"
                    eager
                  />
                  <div className="px-3 pt-5 pb-3">
                    <p className="text-ink-faint text-[11px] tabular-nums">{route.time}</p>
                    <h3 className="mt-1.5 text-[1.0625rem] font-bold tracking-[-0.01em]">
                      {route.title}
                      <span className="text-ink-soft font-medium"> — {route.label}</span>
                    </h3>
                    <p className="text-ink-soft mt-2 text-sm leading-relaxed text-pretty">
                      {route.summary}
                    </p>
                    <p className="text-ink-faint mt-3 text-[13px] text-pretty">{route.who}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 갈래 A ─────────────────────────────────────────────────────── */}
        <section className="mt-20">
          <RouteHeading id="chatbot" eyebrow="설치 없이 · 5분 · 무료" title="브라우저 챗봇으로">
            아무것도 깔지 않습니다. 이미 쓰고 있는 챗봇 하나면 됩니다.
          </RouteHeading>

          <ol className="mt-8 list-none space-y-8">
            <Step n="01" title="챗봇을 엽니다">
              <p>
                <ExternalLink href="https://claude.ai">claude.ai</ExternalLink>,{" "}
                <ExternalLink href="https://chatgpt.com">chatgpt.com</ExternalLink>,{" "}
                <ExternalLink href="https://gemini.google.com">gemini.google.com</ExternalLink>{" "}
                아무거나 좋습니다. 무료 계정으로 됩니다.
              </p>
            </Step>

            <Step n="02" title="프롬프트를 붙여넣습니다">
              <p>
                <Link
                  href={INTERNAL_LINKS.services}
                  className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
                >
                  서비스 하나를 골라
                </Link>{" "}
                그 페이지의 &ldquo;이렇게 시켰습니다&rdquo; 칸을 통째로 드래그해서 복사하세요.
                붙여넣은 다음, 맨 아래에 한 줄만 덧붙입니다.
              </p>
              <Cmd>{`하나의 HTML 파일로 만들어줘.`}</Cmd>
              <p>
                이 한 줄이 중요합니다. 안 붙이면 파일을 여러 개로 쪼개서 주는데,
                그건 이 갈래로는 열어볼 수가 없습니다.
              </p>
            </Step>

            <Step n="03" title="나온 코드를 복사합니다">
              <p>
                코드 상자 오른쪽 위의 복사 버튼을 누르세요. 상자 안의 내용을 읽을 필요는 없습니다.
              </p>
            </Step>

            <Step n="04" title="index.html 로 저장합니다 — 여기서 제일 많이 막힙니다">
              <p>
                <strong className="text-ink font-bold">맥</strong> — 텍스트편집을 열고,
                붙여넣기 전에 먼저 상단 메뉴에서 <strong className="text-ink font-bold">포맷 →
                일반 텍스트로 만들기</strong>(⇧⌘T)를 누르세요. 이걸 안 하면 글씨 서식이 같이
                저장돼서 브라우저가 못 읽습니다. 그다음 붙여넣고 ⌘S → 저장 위치는 바탕화면 →
                이름은 <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">index.html</code>.
                확장자를 바꾸겠냐고 물으면 <strong className="text-ink font-bold">.html 사용</strong>을 고릅니다.
              </p>
              <p>
                <strong className="text-ink font-bold">윈도우</strong> — 메모장을 열고 붙여넣은 뒤
                Ctrl+S → 저장 위치는 바탕화면 →{" "}
                <strong className="text-ink font-bold">파일 형식을 &ldquo;모든 파일&rdquo;로 바꾸고</strong>{" "}
                이름은 <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">index.html</code>.
                이걸 안 바꾸면 <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">index.html.txt</code>{" "}
                로 저장돼서 열리지 않습니다.
              </p>
            </Step>

            <Step n="05" title="더블클릭합니다">
              <p>
                바탕화면의 그 파일을 더블클릭하면 브라우저가 뜨고, 그 자리에서 돌아갑니다.
                여기까지가 5분입니다.
              </p>
            </Step>

            <Step n="06" title="고칩니다">
              <p>
                다시 챗봇으로 돌아가서 &ldquo;버튼이 너무 작아요&rdquo;처럼 거슬리는 걸 한 번에
                하나씩 말하세요. 새 코드가 나오면 3~5번을 반복하면 됩니다.
              </p>
            </Step>
          </ol>

          <p className="text-ink-faint mt-8 max-w-[52ch] text-sm text-pretty">
            이 갈래의 한계 — 파일 하나에 들어가는 것까지만 됩니다. 로그인이나 데이터 저장이
            필요한 건 여기서는 안 됩니다. 그게 필요해지면 아래 갈래로 넘어가시면 됩니다.
          </p>
        </section>

        {/* ── 갈래 B ─────────────────────────────────────────────────────── */}
        <section className="mt-20">
          <RouteHeading id="cli" eyebrow="제대로 · 30분" title="터미널에서 CLI로">
            여기 있는 것들은 전부 이 방식으로 만들었습니다. 검은 창이 무섭게 생겼을 뿐,
            실제로 하는 일은 &ldquo;한 줄 붙여넣고 Enter&rdquo; 가 전부입니다.
          </RouteHeading>

          <ol className="mt-8 list-none space-y-8">
            <Step n="00" title="터미널을 엽니다">
              <p>
                <strong className="text-ink font-bold">맥</strong> — ⌘ + Space 를 누르고{" "}
                <strong className="text-ink font-bold">터미널</strong>이라고 친 뒤 Enter.
              </p>
              <p>
                <strong className="text-ink font-bold">윈도우</strong> — 시작 버튼을 누르고{" "}
                <strong className="text-ink font-bold">powershell</strong> 이라고 친 뒤,
                뜨는 &ldquo;Windows PowerShell&rdquo; 을 엽니다.
              </p>
              <p>
                창이 하나 뜨고 글자 몇 개 뒤에 커서가 깜빡입니다. 거기가 명령어를 적는 자리입니다.
                마우스는 거의 안 씁니다. 앞으로 할 일은 아래 줄들을 하나씩 붙여넣고 Enter 를
                누르는 것뿐입니다.
              </p>
            </Step>

            <Step n="01" title="Claude Code를 깝니다 — 한 줄입니다">
              <p>운영체제에 맞는 줄을 복사해서 터미널에 붙여넣고 Enter 를 누르세요.</p>
              <Cmd os="맥">{`curl -fsSL https://claude.ai/install.sh | bash`}</Cmd>
              <Cmd os="윈도우 (PowerShell)">{`irm https://claude.ai/install.ps1 | iex`}</Cmd>
              <p>
                붙여넣기는 맥에서 ⌘V, 윈도우에서는 마우스 오른쪽 클릭(또는 Ctrl+V)입니다.
                터미널에서는 붙여넣어도 아무 표시가 안 뜰 때가 있는데 정상입니다.
              </p>
              <p>
                <strong className="text-ink font-bold">Node.js 같은 걸 미리 깔 필요는 없습니다.</strong>{" "}
                이 한 줄이 알아서 다 합니다. 설치가 끝나면 터미널 창을 완전히 닫았다가 다시 열고
                아래를 쳐서 확인하세요.
              </p>
              <Cmd>{`claude --version`}</Cmd>
              <p>
                <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">2.1.211 (Claude Code)</code>{" "}
                처럼 숫자가 나오면 된 겁니다.{" "}
                <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">command not found</code>{" "}
                가 나오면 대부분 창을 안 닫아서 그렇습니다. 창을 완전히 닫고 새로 열어보세요.
              </p>
            </Step>

            <Step n="02" title="작업할 폴더를 만듭니다">
              <p>두 줄을 차례로 붙여넣고 각각 Enter 를 누르세요.</p>
              <Cmd>{`mkdir first-app\ncd first-app`}</Cmd>
              <p>
                위는 <strong className="text-ink font-bold">폴더를 만들고</strong>, 아래는{" "}
                <strong className="text-ink font-bold">그 안으로 들어가는</strong> 명령입니다.
                폴더는 내 홈 폴더 안에 생깁니다 (맥은 <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">/Users/내이름</code>,
                윈도우는 <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">C:\Users\내이름</code>).
              </p>
              <p>
                이게 불안하면 우회로가 있습니다. Finder나 탐색기에서 폴더를 직접 만든 다음,
                터미널에 <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">cd</code> 를
                치고 한 칸 띄운 뒤 <strong className="text-ink font-bold">그 폴더를 터미널 창으로
                드래그</strong>하면 경로가 자동으로 채워집니다. 그리고 Enter.
              </p>
            </Step>

            <Step n="03" title="실행하고 로그인합니다">
              <Cmd>{`claude`}</Cmd>
              <p>
                처음 실행하면 브라우저가 열리고 로그인 화면이 나옵니다. 계정을 고르면 끝입니다.
              </p>
              <p>
                <strong className="text-ink font-bold">여기가 돈이 드는 자리입니다.</strong>{" "}
                Claude Code는 Pro(월 20달러, 연간 결제 시 17달러) 이상 구독이 필요하고 무료
                플랜에는 들어 있지 않습니다. 돈을 안 쓰고 하고 싶으면 아래 06번으로 가세요 —
                같은 방식으로 무료로 할 수 있습니다.
              </p>
            </Step>

            <Step n="04" title="프롬프트를 붙여넣습니다">
              <p>
                <Link
                  href={INTERNAL_LINKS.services}
                  className="text-ink decoration-line-strong hover:decoration-ink underline underline-offset-4 transition-colors"
                >
                  서비스 하나를 골라
                </Link>{" "}
                그 페이지의 &ldquo;이렇게 시켰습니다&rdquo; 칸을 통째로 복사해서 그대로
                붙여넣고 Enter. 여러 줄이 한 번에 안 들어가면 나눠서 붙여넣고 마지막에 Enter 를
                누르면 됩니다.
              </p>
              <p>
                중간에 파일을 만들어도 되냐고 물어보면 y 를 누르시면 됩니다.
                내 폴더 안에서만 일어나는 일이라 컴퓨터가 어떻게 되지 않습니다.
              </p>
            </Step>

            <Step n="05" title="결과를 봅니다">
              <p>다 만들었다고 하면, 읽지 말고 이렇게 물어보세요.</p>
              <Cmd>{`방금 만든 거 어떻게 실행해? 명령어 그대로 알려줘.`}</Cmd>
              <p>
                알려주는 줄을 그대로 붙여넣으면 됩니다. 보통 브라우저 주소창에{" "}
                <code className="bg-surface-2 rounded px-1.5 py-0.5 font-mono text-[0.8125rem]">localhost:3000</code>{" "}
                같은 걸 치면 화면이 뜹니다. 그다음부터는 그냥 대화입니다 — 거슬리는 걸 말하면 고쳐줍니다.
              </p>
            </Step>

            <Step n="06" title="돈을 안 쓰고 하려면 — Gemini CLI">
              <p>
                구글 계정으로 로그인하면 하루 1,000번까지 무료입니다. 대신 이쪽은{" "}
                <strong className="text-ink font-bold">Node.js를 먼저 깔아야 합니다.</strong>
              </p>
              <p>
                1. <ExternalLink href="https://nodejs.org">nodejs.org</ExternalLink> 에서
                LTS 라고 적힌 버튼을 눌러 받은 뒤, 계속 다음을 누르면 설치됩니다.
              </p>
              <p>2. 터미널을 닫았다 다시 열고 아래를 붙여넣습니다.</p>
              <Cmd>{`npm install -g @google/gemini-cli`}</Cmd>
              <p>3. 그다음 실행합니다. 로그인 방법을 물으면 구글 로그인을 고르세요.</p>
              <Cmd>{`gemini`}</Cmd>
              <p>여기서부터는 위 02·04·05번과 똑같습니다.</p>
            </Step>

            <Step n="07" title="터미널이 도저히 안 되면">
              <p>
                Claude Code는{" "}
                <ExternalLink href="https://code.claude.com/docs/en/desktop-quickstart">
                  데스크톱 앱
                </ExternalLink>
                도 있습니다. 터미널을 열지 않고 창에서 같은 일을 합니다. 명령어에서 계속
                걸리면 이쪽으로 시작하셔도 됩니다.
              </p>
            </Step>
          </ol>
        </section>

        {/* ── 갈래 C ─────────────────────────────────────────────────────── */}
        <section className="mt-20">
          <RouteHeading id="builder" eyebrow="남한테 맡기고 · 5분" title="웹 빌더에 맡기고">
            화면도 주소도 알아서 만들어줍니다. 제일 빠른 대신, 대가가 있습니다.
          </RouteHeading>

          <ol className="mt-8 list-none space-y-8">
            <Step n="01" title="아무거나 하나 엽니다">
              <p>
                <ExternalLink href="https://v0.app">v0</ExternalLink>,{" "}
                <ExternalLink href="https://bolt.new">Bolt</ExternalLink>,{" "}
                <ExternalLink href="https://lovable.dev">Lovable</ExternalLink>. 셋 다 비슷합니다.
              </p>
            </Step>
            <Step n="02" title="프롬프트를 붙여넣습니다">
              <p>
                그게 전부입니다. 화면이 옆에 바로 뜨고, 인터넷 주소도 같이 생겨서 남에게
                링크로 보여줄 수 있습니다.
              </p>
            </Step>
          </ol>

          <p className="text-ink-faint mt-8 max-w-[52ch] text-sm text-pretty">
            대가 — 만들어진 코드가 그 서비스 안에 있습니다. 나중에 마음대로 고치거나 내 서버로
            옮기려고 하면 그때부터 답답해집니다. 내일까지 뭔가를 보여줘야 할 때 쓰고,
            계속 만들 생각이면 위의 터미널 갈래가 낫습니다.
          </p>
        </section>

        {/* ── 막혔을 때 ─────────────────────────────────────────────────── */}
        <section className="mt-20">
          <div className="bg-paper-lilac rounded-[28px] px-7 py-9 sm:px-10 sm:py-11">
            <h2 className="text-2xl font-bold tracking-[-0.02em]">막혔을 때</h2>
            <p className="text-ink-soft mt-3 text-pretty">
              이 페이지에서 제일 중요한 부분입니다. 여기까지 오는 사람은 많고,
              대부분 첫 에러에서 그만둡니다.
            </p>
            <ul className="text-ink-soft mt-7 space-y-5">
              <li>
                <strong className="text-ink font-bold">에러가 뜨면 읽으려 하지 마세요.</strong>{" "}
                빨간 글씨를 통째로 드래그해서 복사한 다음 그대로 붙여넣으면 됩니다.
                저도 1년 동안 그렇게만 했습니다.
              </li>
              <li>
                <strong className="text-ink font-bold">
                  &ldquo;안 되는데요&rdquo; 한 마디로 충분합니다.
                </strong>{" "}
                뭐가 왜 안 되는지 설명하지 못해도 됩니다. 화면을 캡처해서 붙여넣어도 알아봅니다.
              </li>
              <li>
                <strong className="text-ink font-bold">한 번에 완성될 거라고 기대하지 마세요.</strong>{" "}
                저는 대충 돌아가는 걸 먼저 받고, 거슬리는 걸 하나씩 말해서 고칩니다.
                한 번에 하나씩이어야 뭐가 고쳐졌는지 알 수 있습니다.
              </li>
              <li>
                <strong className="text-ink font-bold">망가뜨렸다 싶으면 되돌리면 됩니다.</strong>{" "}
                &ldquo;방금 것 되돌려줘&rdquo; 라고 하시면 됩니다. 폴더를 통째로 지우고 처음부터
                다시 해도 됩니다 — 잃을 게 없습니다.
              </li>
              <li>
                <strong className="text-ink font-bold">30분 넘게 같은 자리면 새로 시작하세요.</strong>{" "}
                같은 프롬프트를 새 폴더에서 다시 돌리는 게 대개 더 빠릅니다.
              </li>
            </ul>
          </div>
        </section>

        {/* 형광은 쓰지 않는다 — 이 사이트의 형광 한 점은 랜딩 히어로다 (DESIGN.md §2) */}
        <section className="mt-16 pb-4">
          <h2 className="text-xl font-bold tracking-[-0.02em]">이제 프롬프트를 하나 고르세요</h2>
          <p className="text-ink-soft mt-3 max-w-[46ch] text-pretty">
            빈 화면 앞에서 시작하지 마세요. 만든 것마다 그때 쓴 프롬프트를 통째로 열어뒀습니다.
            해봄직한 걸 하나 집어다 필요한 것으로 바꾸는 게 훨씬 빠릅니다.
          </p>
          <Link
            href={INTERNAL_LINKS.services}
            className="bg-ink text-canvas mt-7 inline-flex items-center rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-opacity hover:opacity-85"
          >
            만든 것 + 프롬프트 보기
          </Link>
        </section>
      </div>
    </div>
  );
}
