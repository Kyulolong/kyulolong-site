-- 좋아요 (로그인 없이 누른다) — 서비스와 영상 공용
--
-- 실행: Supabase Studio → SQL Editor 에 통째로 붙여넣고 Run.
-- 한 번만 돌리면 되고, 두 번 돌려도 안전하다 (if not exists / or replace).
--
-- ─────────────────────────────────────────────────────────────
-- 왜 테이블 하나에 kind 로 나누는가
--
-- 서비스와 영상은 같은 것을 센다 — "이 카드 좋다". 테이블을 둘로 나누면 함수도
-- 뷰도 API 도 두 벌이 되고, 나중에 셋째(글·프롬프트)가 생기면 세 벌이 된다.
-- 슬러그는 services/videos 사이에서 겹칠 수 있으므로 kind 를 키에 넣는다.
--
-- 왜 테이블을 직접 열지 않고 함수 두 개만 여는가
--
-- 이 사이트의 Supabase 키는 anon 키 하나뿐이고, 그건 브라우저에 그대로
-- 실려 나간다 (NEXT_PUBLIC_*). 즉 이 키로 할 수 있는 일은 전부
-- "아무나 할 수 있는 일" 이다.
--
-- 그래서 테이블에는 정책을 하나도 만들지 않는다. RLS 를 켜고 정책이 없으면
-- anon 은 이 테이블을 읽지도 쓰지도 지우지도 못한다. 특히 delete 를 열어두면
-- 안 되는데, 인증이 없어서 "자기 줄만 지우게" 하는 조건을 쓸 수가 없기 때문이다
-- (`using (true)` 로 열면 누구나 REST 로 테이블을 통째로 비울 수 있다).
--
-- 대신 문을 세 개만 낸다.
--   1. toggle_like()        — security definer 함수. 누르기/취소가 이 안에서 끝난다
--   2. my_likes()           — 이 브라우저가 누른 목록 (하트 상태 맞추기)
--   3. content_like_counts  — 집계만 보여주는 뷰. 누가 눌렀는지는 안 나간다
--
-- 남는 구멍: 스크립트로 uuid 를 계속 새로 만들어 함수를 두드리면 숫자를 부풀릴 수
-- 있다. 로그인 없는 좋아요에서는 원리상 못 막는다. 개인 사이트의 응원 카운터라
-- 그 정도는 받아들이고, 대신 아래 검증으로 쓰레기 행이 쌓이는 것만 막는다.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.content_likes (
  -- 'service' = content/services/<slug>.mdx, 'video' = content/videos/<slug>.mdx
  kind        text        not null check (kind in ('service', 'video')),
  -- MDX 파일명에서 온 슬러그. 홈페이지가 MDX 로 도니까 외래키는 없다.
  slug        text        not null,
  -- 브라우저 localStorage 에 사는 임의의 uuid. 사람과 이어지는 정보가 아니다.
  visitor_id  uuid        not null,
  created_at  timestamptz not null default now(),
  primary key (kind, slug, visitor_id)
);

-- 목록에서 "이 카드 좋아요 몇 개" 를 셀 때 쓴다
create index if not exists content_likes_kind_slug_idx on public.content_likes (kind, slug);

-- 정책을 만들지 않는다 = anon 은 이 테이블에 손댈 수 없다 (위 주석 참고)
alter table public.content_likes enable row level security;

-- ── 집계 뷰: 숫자만 나간다 ───────────────────────────────────
-- security_invoker 를 켜지 않는다. 켜면 뷰도 호출자(anon)의 RLS 를 따라가서
-- 정책이 없는 이 테이블에서는 늘 0 개가 나온다. 여기서는 뷰가 소유자 권한으로
-- 세는 게 맞다 — 내보내는 건 kind·slug·개수뿐이고 방문자 id 는 나가지 않는다.
create or replace view public.content_like_counts as
  select kind, slug, count(*)::int as likes
  from public.content_likes
  group by kind, slug;

grant select on public.content_like_counts to anon, authenticated;

-- ── 누르기 / 취소 ────────────────────────────────────────────
-- 같은 (kind, slug, visitor) 로 다시 부르면 취소된다. 반환값은 그 카드의 최신 개수.
create or replace function public.toggle_like(p_kind text, p_slug text, p_visitor uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  total int;
begin
  if p_kind is null or p_kind not in ('service', 'video') then
    raise exception 'invalid kind';
  end if;

  -- 슬러그는 파일명에서 오므로 소문자·숫자·하이픈뿐이다. 그 밖은 받지 않는다.
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,64}$' then
    raise exception 'invalid slug';
  end if;

  delete from content_likes
   where kind = p_kind and slug = p_slug and visitor_id = p_visitor;

  if not found then
    insert into content_likes (kind, slug, visitor_id) values (p_kind, p_slug, p_visitor);
  end if;

  select count(*) into total from content_likes where kind = p_kind and slug = p_slug;
  return total;
end;
$$;

revoke all on function public.toggle_like(text, text, uuid) from public;
grant execute on function public.toggle_like(text, text, uuid) to anon, authenticated;

-- ── 내가 누른 것 ─────────────────────────────────────────────
-- 브라우저는 localStorage 로도 알 수 있지만, 기기를 옮기거나 저장소가 비워지면
-- 어긋난다. 화면을 열 때 서버에 한 번 물어서 하트 상태를 맞춘다.
create or replace function public.my_likes(p_visitor uuid)
returns table (kind text, slug text)
language sql
security definer
set search_path = public
as $$
  select kind, slug from content_likes where visitor_id = p_visitor;
$$;

revoke all on function public.my_likes(uuid) from public;
grant execute on function public.my_likes(uuid) to anon, authenticated;

-- ── 이전 버전 정리 ───────────────────────────────────────────
-- 서비스 전용이던 첫 판(service_likes)을 이미 실행했다면 그 함수·뷰를 걷어낸다.
-- 실행한 적이 없으면 아무 일도 일어나지 않는다.
drop function if exists public.toggle_service_like(text, uuid);
drop function if exists public.my_service_likes(uuid);
drop view if exists public.service_like_counts;
-- 테이블은 자동으로 지우지 않는다 (데이터가 들어 있을 수 있다).
-- 눌린 게 없으면 이 줄의 주석을 풀고 한 번 돌려도 된다:
-- drop table if exists public.service_likes;
