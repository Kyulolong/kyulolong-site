import Link from "next/link";

/**
 * 브랜드 마크 — 초록 점 하나 (DESIGN.md §7).
 *
 * 서비스마다 로고를 새로 그리지 않는다. 워드마크 앞에 찍은 점 하나가
 * 모든 서비스의 공통 마크다. 점은 acid 가 아니라 acid-deep 을 쓴다 —
 * 흰 바탕에서 #8FFF00 은 1.27:1 이라, 글자보다 면적이 작은 도형은 더 잘 사라진다.
 */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="hover:text-ink-soft inline-flex items-center gap-2.5 text-[1.0625rem] font-bold tracking-[-0.02em] transition-colors"
    >
      <span className="bg-acid-deep size-3 shrink-0 rounded-full" aria-hidden="true" />
      규로롱
    </Link>
  );
}
