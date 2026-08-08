import Image from "next/image";
import Link from "next/link";

/**
 * 브랜드 마크 — ㄱ 과 점 (docs/DESIGN.md §7).
 *
 * 마크는 형광 도형을 어두운 외곽선이 감싼 2겹 구조다. 이게 이 마크의 핵심이라
 * 색만 뽑아 쓰거나 외곽선을 빼면 안 된다 — #8FFF00 은 흰 바탕에서 1.27:1 이라
 * 외곽선이 없으면 밝은 화면에서 통째로 사라진다.
 *
 * 헤더는 24~28px 로 작게 쓰이므로 소형 전용 버전(favicon-16px 계열)을 쓴다.
 * 획과 점을 굵혀둔 것이라 작은 크기에서 덜 뭉갠다.
 */
export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="hover:text-ink-soft inline-flex items-center gap-2.5 text-[1.0625rem] font-bold tracking-[-0.02em] transition-colors"
    >
      <Image
        src="/brand/mark.svg"
        alt=""
        width={26}
        height={26}
        className="shrink-0"
        priority
      />
      규로롱
    </Link>
  );
}
