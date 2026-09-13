import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

/**
 * 브랜드 마크 — 말풍선과 스파크 (docs/DESIGN.md §7).
 *
 * 말풍선(가운데가 뚫린 링) + 형광 스파크 세 획. 말풍선은 currentColor 라 옆의
 * "규로롱" 글자와 **같은 색**이다 — 그래야 마크와 워드마크가 한 덩어리로 읽힌다.
 * 다른 색이면 로고 옆에 아이콘을 하나 더 붙여둔 것처럼 보인다. 브랜드 색은
 * 형광 스파크가 맡는다.
 *
 * 예전엔 public/brand/mark-on-dark.svg 를 <Image> 로 박았다. 색이 파일에 박혀 있어
 * 라이트 테마에서 #edebf5 말풍선이 흰 바탕에 1.18:1 로 사라졌고, hover 에서 글자만
 * 옅어지고 마크는 안 따라왔다. 인라인이면 둘 다 저절로 맞고 요청도 하나 준다.
 *
 * ⚠️ 말풍선만 떼어 쓰지 않는다. 어두운 바탕에서 읽히는 일은 스파크가 맡는다 —
 * 스파크가 빠지면 형태가 통째로 사라진다.
 *
 * ⚠️ brand-mark.tsx 는 생성물이다. scripts/make-marks.mjs 가 만든다 — 손으로 고치지 말 것.
 */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="hover:text-ink-soft inline-flex min-h-11 items-center gap-2.5 text-[1.0625rem] font-bold tracking-[-0.02em] transition-colors"
    >
      <BrandMark className="shrink-0" />
      규로롱
    </Link>
  );
}
