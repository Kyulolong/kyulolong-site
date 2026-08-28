import Image from "next/image";
import Link from "next/link";

/**
 * 브랜드 마크 — 말풍선과 스파크 (docs/DESIGN.md §7).
 *
 * 보라 말풍선(가운데가 뚫린 링) + 형광 스파크 세 획. 바탕마다 변형이 따로
 * 있고 여기서는 기본판(--iris)을 쓴다 — 어두운 바탕에서 2.86:1 로
 * mark-on-dark(7.81:1)보다 조용하지만, 회색 마크를 쓰면 헤더에서 브랜드 색이
 * 하나도 안 남는다.
 *
 * ⚠️ 말풍선만 떼어 쓰지 않는다. 어두운 바탕에서 읽히는 일은 스파크가 맡는다 —
 * 스파크가 빠지면 형태가 통째로 사라진다.
 *
 * ⚠️ SVG 를 손으로 고치지 말 것. scripts/make-marks.mjs 가 생성한다.
 */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="hover:text-ink-soft inline-flex min-h-11 items-center gap-2.5 text-[1.0625rem] font-bold tracking-[-0.02em] transition-colors"
    >
      <Image
        src="/brand/mark.svg"
        alt=""
        width={26}
        height={26}
        className="shrink-0"
        loading="eager"
      />
      규로롱
    </Link>
  );
}
