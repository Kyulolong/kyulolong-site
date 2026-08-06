import Image from "next/image";

interface ThumbnailProps {
  src?: string;
  /** 이미지가 없을 때 블록에 대신 새길 이름 */
  label: string;
  /** 좌상단 작은 라벨 (시리즈명 등) */
  eyebrow?: string;
}

/**
 * 썸네일이 없어도 레이아웃이 깨지지 않게 하는 폴백.
 * 매주 이미지를 손으로 만들어야 하면 그 부담 때문에 등록을 미루게 된다.
 *
 * 포인트 컬러는 옅은 그라데이션과 짧은 바에만 쓴다. 블록 전체를 네온 그린으로
 * 채우면 카드가 여러 장 깔릴 때 화면이 싸 보인다.
 */
export function Thumbnail({ src, label, eyebrow }: ThumbnailProps) {
  return (
    <div className="border-line bg-surface relative aspect-[16/10] w-full overflow-hidden rounded-lg border">
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 24rem, 100vw"
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col justify-end p-4"
          style={{
            backgroundImage:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 55%)",
          }}
        >
          {eyebrow ? (
            <span className="text-muted absolute top-4 left-4 font-mono text-[11px] tracking-wide">
              {eyebrow}
            </span>
          ) : null}
          <span className="bg-accent mb-2.5 block h-[3px] w-6 rounded-full" aria-hidden="true" />
          <span className="text-ink/80 line-clamp-2 text-sm font-bold break-keep">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
