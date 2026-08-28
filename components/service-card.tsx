import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import { Thumbnail } from "@/components/thumbnail";
import { isAppStoreApp, type Service } from "@/lib/content";

/**
 * 카드는 소개 페이지(/services/<slug>)로 보낸다.
 * 실제 서비스(kyulolong.com/<slug>)로는 소개 페이지의 CTA 가 보낸다 — 스펙 3번.
 *
 * featured 를 초록 점으로 표시하지 않는다. 대표작이 서너 개면 그 점들이
 * 그리드 전체에 흩어지는데, DESIGN.md §2 가 세는 건 개수가 아니라 흩어짐이다.
 * featured 는 이미 '목록 맨 앞'이라는 형태로 드러나 있다.
 *
 * ⚠️ 카드 전체가 <Link> 였는데 마지막 줄만 밖으로 뺐다. 좋아요 버튼 때문이다 —
 * <a> 안의 <button> 은 HTML 규격 위반이고, 누르면 링크까지 같이 눌린다.
 * preventDefault 로 막을 수도 있지만 그건 마크업이 틀린 걸 스크립트로 가리는 것이라,
 * 키보드·스크린리더에서는 여전히 링크 안의 버튼으로 읽힌다.
 */
export function ServiceCard({
  service,
  eager = false,
  likes,
}: {
  service: Service;
  /** 목록 첫 행에서만 켠다 — Thumbnail 의 eager 주석 참고 */
  eager?: boolean;
  /** 서버가 이미 아는 좋아요 수 (랜딩). 없으면 버튼이 스스로 받아온다. */
  likes?: number;
}) {
  return (
    <div className="group border-line bg-surface hover:border-line-strong hover:bg-surface-2 rounded-card border p-3 transition-[transform,background-color,border-color] duration-200 ease-[var(--ease-calm)] hover:-translate-y-0.5">
      <Link href={`/services/${service.slug}`} className="block">
        <Thumbnail
          src={service.thumbnail}
          label={service.title}
          tone="service"
          eager={eager}
        />

        {/*
          작업 번호를 제목 왼쪽에 큰 고정폭으로 세운다.

          인스타 썸네일에 박는 `#5` 와 같은 번호다. 회색 11px 로 두면 그냥
          부가정보인데, 이 크기로 세우면 목록이 카드 모음이 아니라 **번호가
          붙어 쌓여가는 연재물**로 읽힌다. 60개가 됐을 때 남는 건 개별 카드가
          아니라 이 번호들이 만드는 세로줄이다.

          두 자리로 채우는 이유(`07`)는 그래야 열이 흔들리지 않아서다 —
          한 자리와 두 자리가 섞이면 제목의 왼쪽 끝이 카드마다 어긋난다.
          items-baseline 이라 큰 숫자와 제목이 같은 선 위에 앉는다.
        */}
        <div className="flex items-baseline gap-3 px-3 pt-5">
          {service.seq ? (
            <span
              className="text-ink-soft w-8 shrink-0 font-mono text-[1.5rem] leading-none font-medium tabular-nums"
              aria-label={`작업 ${service.seq}번`}
            >
              {String(service.seq).padStart(2, "0")}
            </span>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-[1.0625rem] font-bold tracking-[-0.01em]">
                {service.title}
              </h3>
              {/* 상태 뱃지는 액션이 아니라서 알약을 쓰지 않는다 (DESIGN.md §6) */}
              {service.status === "soon" ? (
                <span className="bg-surface-2 text-ink-faint shrink-0 rounded-badge px-1.5 py-0.5 text-[11px] font-medium">
                  준비 중
                </span>
              ) : null}
              {service.team ? (
                <span className="bg-iris text-on-iris shrink-0 rounded-badge px-1.5 py-0.5 text-[11px] font-medium">
                  팀
                </span>
              ) : null}
              {/* 히어로의 "앱스토어까지"를 그리드에서 받아주는 자리 (isAppStoreApp).
                  뱃지가 세 종류가 됐지만 알갱이가 되지 않는 건 셋이 서로 배타적에
                  가깝고 대부분의 카드에 하나도 안 붙기 때문이다 — 지금 아홉 장 중
                  뱃지가 붙는 건 세 장이다. 여기에 featured 나 태그까지 뱃지로
                  올리기 시작하면 그때는 진짜로 뒤덮인다 (DESIGN.md §6). */}
              {isAppStoreApp(service.url) ? (
                <span className="bg-surface-2 text-ink-soft shrink-0 rounded-badge px-1.5 py-0.5 text-[11px] font-medium">
                  앱스토어
                </span>
              ) : null}
            </div>

            <p className="text-ink-soft mt-2 line-clamp-2 text-sm leading-relaxed">
              {service.tagline}
            </p>
          </div>
        </div>
      </Link>

      {/* 태그 줄과 좋아요를 한 줄에 둔다. 좋아요를 위해 줄을 하나 더 만들면
          카드가 60장일 때 목록 전체가 그만큼 길어진다.

          태그에 칩을 씌우지 않는다 (DESIGN.md §6) — 카드 하나에 상자가 서너 개면
          그리드 전체가 알갱이로 뒤덮이고, 정작 못 누르는 라벨이라 눌러보게 된다.
          걸린 시간을 맨 앞에 세우는 건 그대로다: 목록에서 "나도 해볼 만한가"를
          판단하게 만드는 건 태그가 아니라 이 숫자다. */}
      <div className="flex items-center justify-between gap-3 px-3 pt-4 pb-2">
        <p className="text-ink-faint flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
          {service.buildTime ? (
            <span className="text-ink-soft font-mono tracking-[0.02em] tabular-nums">
              {service.buildTime}
            </span>
          ) : null}
          {service.tags.map((tag, i) => (
            <span key={tag} className="flex items-center gap-x-2">
              {i > 0 || service.buildTime ? (
                <span aria-hidden="true" className="text-line-strong">
                  ·
                </span>
              ) : null}
              {tag}
            </span>
          ))}
        </p>

        <LikeButton kind="service" slug={service.slug} initialCount={likes} className="-mr-1" />
      </div>
    </div>
  );
}
