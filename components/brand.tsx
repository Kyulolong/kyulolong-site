import Image from "next/image";
import Link from "next/link";

/**
 * 브랜드 마크 — 말풍선과 스파크 (docs/DESIGN.md §7).
 *
 * 말풍선(가운데가 뚫린 링) + 형광 스파크 세 획. 바탕마다 변형이 따로 있고
 * 여기서는 --on-dark(#edebf5)를 쓴다 — 옆의 "규로롱" 글자와 **같은 색**이라야
 * 마크와 워드마크가 한 덩어리로 읽힌다. 다른 색이면 로고 옆에 아이콘을 하나
 * 더 붙여둔 것처럼 보인다. 브랜드 색은 형광 스파크가 맡는다.
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
        src="/brand/mark-on-dark.svg"
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
