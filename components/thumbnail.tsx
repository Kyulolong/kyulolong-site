import Image from "next/image";

/**
 * 색은 '무엇인지'를 나타내지 '누구인지'를 나타내지 않는다.
 *
 * 슬러그마다 색을 배정하면 예뻐 보이지만 두 가지가 깨진다.
 *   1) 매주 서비스가 늘어날 때마다 인접한 카드끼리 같은 색이 붙는 걸 손으로 피해야 한다.
 *   2) 60개가 되면 파스텔 5색이 12번씩 반복돼서 어차피 의미가 없어진다.
 * 그래서 종류별로 한 색만 쓴다.
 *
 * ⚠️ **다크로 뒤집으면서 종류를 가르는 축이 색조에서 밝기로 바뀌었다.**
 * 일러스트는 **불 켜진 밝은 도판**, 스크린샷은 **어두운 액자**다. 파스텔 다섯 색이
 * 서로 구별되려면 눈이 미묘한 색조 차를 읽어야 했는데, 밝고 어두움은 곁눈으로도
 * 갈린다 — 목록이 60장이 됐을 때 실제로 작동하는 건 이쪽이다.
 */
const TONE = {
  /** 일러스트. multiply 가 살아야 해서 반드시 밝은 판이다 (아래 참고) */
  service: "bg-plate",
  /** /start 의 세 갈래 카드. 이것도 흰 바탕 일러스트라 같은 판을 쓴다 */
  guide: "bg-plate",
  /** 스크린샷. multiply 를 안 쓰므로 어두운 액자에 앉힌다 */
  video: "bg-iris-wash",
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
  /**
   * 영상 썸네일은 작업하던 화면의 스크린샷이라 밝기가 제각각이다 — 종이에 녹지
   * 않고, 위에 얹은 시리즈 라벨(연재물로 읽히게 하는 유일한 장치)이 어두운
   * 화면에서 통째로 사라진다. 그래서 스크린샷은 여백을 두고 액자 위에 붙여둔
   * 형태로 세우고, 라벨은 이미지가 아니라 늘 액자 위에 앉힌다.
   */
  if (tone === "video" && src) {
    return (
      <div className={`${TONE[tone]} flex aspect-[3/2] w-full flex-col rounded-inset p-3`}>
        {eyebrow ? (
          <span className="text-ink-soft px-1.5 pb-2.5 font-mono text-[11px] tracking-wide">
            {eyebrow}
          </span>
        ) : null}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-badge">
          <Image
            src={src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover"
            loading={eager ? "eager" : "lazy"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`${TONE[tone]} relative aspect-[3/2] w-full overflow-hidden rounded-inset`}>
      {eyebrow ? (
        <span className="text-on-plate/55 absolute top-3.5 left-4 z-10 font-mono text-[11px] tracking-wide">
          {eyebrow}
        </span>
      ) : null}

      {src ? (
        /**
         * 일러스트는 전부 흰 바탕에 그려져 있다. multiply 로 얹으면 흰 부분이
         * 도판에 그대로 녹아서, 이미지마다 배경색을 따로 굽지 않아도 된다.
         * (새 서비스 이미지도 흰 바탕으로만 만들면 자동으로 맞는다)
         *
         * ⚠️ **이 판을 어둡게 바꾸면 그림이 통째로 사라진다.** multiply 는 곱셈이라
         * 어두운 면 위에서는 무엇을 얹어도 더 어두워지기만 한다. `--plate` 가
         * 다크 전환에서 유일하게 살아남은 밝은 면인 이유가 이것이고, 취향이 아니라
         * 제약이다 (app/globals.css · DESIGN.md §3).
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
          <span className="text-on-plate line-clamp-2 text-[0.9375rem] font-bold">{label}</span>
        </div>
      )}
    </div>
  );
}
