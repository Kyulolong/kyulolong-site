import Image from "next/image";

/**
 * 색은 '무엇인지'를 나타내지 '누구인지'를 나타내지 않는다.
 *
 * 슬러그마다 색을 배정하면 예뻐 보이지만 두 가지가 깨진다.
 *   1) 매주 서비스가 늘어날 때마다 인접한 카드끼리 같은 색이 붙는 걸 손으로 피해야 한다.
 *   2) 60개가 되면 파스텔 5색이 12번씩 반복돼서 어차피 의미가 없어진다.
 * 그래서 종류별로 한 색만 쓴다. 색깔은 일러스트 안의 형광 한 점이 담당한다.
 */
const TONE = {
  service: "bg-paper-lime",
  video: "bg-paper-sky",
} as const;

interface ThumbnailProps {
  src?: string;
  /** 이미지가 없을 때 패널에 대신 새길 이름 */
  label: string;
  /** 좌상단 작은 라벨 (시리즈명 등) */
  eyebrow?: string;
  tone?: keyof typeof TONE;
  sizes?: string;
  /**
   * 첫 화면에 들어가는 카드만 켠다 (목록 첫 행). next/image 기본값이 lazy 라
   * 켜지 않으면 LCP 가 되는 이미지를 브라우저가 늦게 받는다.
   *
   * 목록 전체에 켜면 안 된다 — 60개짜리 목록이 한꺼번에 요청을 날려서
   * 정작 첫 화면 이미지의 대역폭을 뺏는다. 지금보다 나빠지는 종류의 최적화다.
   * preload 를 쓰지 않는 것도 같은 이유다: 그리드가 1~3열로 바뀌므로
   * 뷰포트마다 LCP 후보가 달라서 head 에 못 박을 이미지가 하나로 정해지지 않는다.
   */
  eager?: boolean;
}

/**
 * 썸네일이 없어도 레이아웃이 깨지지 않게 하는 폴백 (스펙 5번).
 * 매주 이미지를 손으로 만들어야 하면 그 부담 때문에 등록을 미루게 된다.
 */
export function Thumbnail({
  src,
  label,
  eyebrow,
  tone = "service",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  eager = false,
}: ThumbnailProps) {
  return (
    <div
      className={`${TONE[tone]} relative aspect-[3/2] w-full overflow-hidden rounded-[12px]`}
    >
      {eyebrow ? (
        <span className="text-ink-faint absolute top-3.5 left-4 z-10 font-mono text-[11px] tracking-wide">
          {eyebrow}
        </span>
      ) : null}

      {src ? (
        /**
         * 일러스트는 전부 흰 바탕에 그려져 있다. multiply 로 얹으면 흰 부분이
         * 파스텔 종이에 그대로 녹아서, 이미지마다 배경색을 따로 굽지 않아도 된다.
         * (새 서비스 이미지도 흰 바탕으로만 만들면 자동으로 맞는다)
         */
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover mix-blend-multiply"
          loading={eager ? "eager" : "lazy"}
        />
      ) : (
        <div className="flex h-full w-full items-end p-5">
          <span className="line-clamp-2 text-[0.9375rem] font-bold">{label}</span>
        </div>
      )}
    </div>
  );
}
