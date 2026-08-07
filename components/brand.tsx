import Image from "next/image";
import Link from "next/link";

/**
 * 브랜드 마크 — 새싹을 얹은 캐릭터 (DESIGN.md §7).
 *
 * 예전엔 초록 점 하나였다. 점은 어디에도 안 걸리고 파비콘까지 공짜로 해결되는
 * 대신, 기억에 남는 게 색뿐이라 "형광 초록 쓰는 사이트" 이상이 되질 않았다.
 * 캐릭터는 그리는 비용이 들지만 얼굴이 남는다.
 *
 * 형광은 여기서도 딱 한 곳 — 머리 위 새싹이다. 몸은 중립색이라
 * 마크가 헤더에 늘 떠 있어도 형광 예산을 갉아먹지 않는다.
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
        width={28}
        height={28}
        className="shrink-0"
        priority
      />
      규로롱
    </Link>
  );
}
