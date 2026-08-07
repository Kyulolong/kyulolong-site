import Link from "next/link";

/**
 * 404 도 다그치지 않는다 (DESIGN.md §9). 사용자가 주소를 잘못 친 게 아니라
 * 우리가 페이지를 못 찾은 것으로 쓴다.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center px-6 py-32 text-center sm:px-8">
      <p className="text-ink-faint font-mono text-xs tracking-[0.12em] uppercase">404</p>
      <h1 className="mt-5 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.03em]">
        이 주소에서는 아무것도 못 찾았어요
      </h1>
      <p className="text-ink-soft mt-4 max-w-[36ch] text-pretty">
        주소가 바뀌었거나, 아직 안 만든 페이지일 수 있어요. 만든 것들은 아래에 다 있습니다.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/services"
          className="bg-acid text-on-acid hover:bg-acid-press inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-bold transition-colors"
        >
          만든 서비스 보기
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/"
          className="border-line-strong text-ink hover:bg-surface-2 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[0.9375rem] font-medium transition-colors"
        >
          첫 화면으로
        </Link>
      </div>
    </div>
  );
}
