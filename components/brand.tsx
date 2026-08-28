import Image from "next/image";
import Link from "next/link";

/**
 * 브랜드 마크 — 말풍선과 스파크 (docs/DESIGN.md §7).
 *
 * 보라 말풍선 + 형광 스파크를 어두운 외곽선이 감싼 2겹 구조다. 이게 이 마크의
 * 핵심이라 색만 뽑아 쓰거나 외곽선을 빼면 안 된다 — #8FFF00 은 흰 바탕에서
 * 1.27:1 이라 외곽선이 없으면 밝은 화면에서 스파크가 통째로 사라진다.
 *
 * ⚠️ 말풍선만 떼어 쓰지 않는다. #6332EB 는 바탕(#121019) 위에서 2.86:1 이라
 * 읽히는 일은 스파크가 맡는다 — 스파크가 빠지면 어두운 화면에서 형태가 없다.
 *
 * 헤더는 24~28px 로 작게 쓰이므로 소형 보정판(mark-sm)을 쓴다. 스파크 획을
 * 굵히고 점을 키운 것이라 작은 크기에서 덜 뭉갠다.
 */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="hover:text-ink-soft inline-flex min-h-11 items-center gap-2.5 text-[1.0625rem] font-bold tracking-[-0.02em] transition-colors"
    >
      <Image
        src="/brand/mark-sm.svg"
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
