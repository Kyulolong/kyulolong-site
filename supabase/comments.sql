-- 댓글 (로그인 없이 쓴다) — 지금은 글(thought) 전용
--
-- 실행: Supabase Studio → SQL Editor 에 통째로 붙여넣고 Run.
-- 한 번만 돌리면 되고, 두 번 돌려도 안전하다 (if not exists / or replace).
--
-- ─────────────────────────────────────────────────────────────
-- 구조는 likes.sql 과 같은 원리다
--
-- anon 키는 브라우저에 그대로 실려 나가므로, 이 키로 할 수 있는 일은 전부
-- "아무나 할 수 있는 일" 이다. 그래서 테이블에는 정책을 하나도 만들지 않고
-- (RLS 켬 + 정책 없음 = anon 은 못 읽고 못 쓰고 못 지운다), security definer
-- 함수 세 개만 문으로 낸다.
--
--   1. add_comment()     — 쓰기. 길이·형식 검증과 20초 쿨다운이 이 안에 있다
--   2. comments_for()    — 읽기. hidden 이 아닌 것만, 남의 visitor_id 는 안 나간다
--   3. delete_comment()  — 지우기. 쓴 브라우저(visitor uuid)의 것만 지워진다
--
-- visitor_id 는 좋아요와 같은 uuid 다 (localStorage 의 kyulolong.visitor).
-- 사람과 이어지는 정보가 아니라 "같은 브라우저" 표시일 뿐이다.
--
-- ⚠️ comments_for 가 남의 visitor_id 를 내보내면 안 되는 이유: delete_comment 의
-- 유일한 자물쇠가 그 uuid 라, 새어 나가면 아무나 남의 댓글을 지울 수 있게 된다.
-- 그래서 mine(boolean) 으로 바꿔서 내보낸다.
--
-- ─────────────────────────────────────────────────────────────
-- 운영(숨김·삭제)은 Studio 에서 한다 — 어드민 UI 는 만들지 않는다 (CLAUDE.md 10번)
--
--   숨기기:   update public.content_comments set hidden = true  where id = '<uuid>';
--   되살리기: update public.content_comments set hidden = false where id = '<uuid>';
--   지우기:   delete from public.content_comments where id = '<uuid>';
--
-- 글 하나의 댓글창을 통째로 닫는 건 DB 가 아니라 MDX 다 — 그 글 frontmatter 에
-- `comments: false` 한 줄 (lib/content/types.ts). 이미 달린 댓글은 남지만
-- 페이지가 댓글 영역 자체를 그리지 않는다.
-- ─────────────────────────────────────────────────────────────

create table if not exists public.content_comments (
  id          uuid        primary key default gen_random_uuid(),
  -- 지금은 'thought' 뿐이다. 서비스·영상은 인스타·유튜브 댓글창이 이미 있어서
  -- 여기 안 단다 — 늘릴 일이 생기면 likes.sql 의 kind 처럼 제약만 늘린다.
  kind        text        not null check (kind in ('thought')),
  slug        text        not null,
  -- 브라우저 localStorage 에 사는 임의의 uuid (좋아요와 공유)
  visitor_id  uuid        not null,
  nickname    text        not null check (char_length(nickname) between 1 and 24),
  body        text        not null check (char_length(body) between 1 and 1000),
  -- 숨긴 댓글. 지우지 않고 숨기는 이유는 지운 건 되돌릴 수 없어서다
  hidden      boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- 글 하나의 댓글을 시간순으로 읽을 때 쓴다
create index if not exists content_comments_kind_slug_idx
  on public.content_comments (kind, slug, created_at);
-- add_comment 의 쿨다운 검사("이 브라우저가 방금 썼나")가 이걸 탄다
create index if not exists content_comments_visitor_idx
  on public.content_comments (visitor_id, created_at);

-- 정책을 만들지 않는다 = anon 은 이 테이블에 손댈 수 없다 (위 주석 참고)
alter table public.content_comments enable row level security;

-- ── 쓰기 ─────────────────────────────────────────────────────
-- 반환값은 새 댓글의 id. 화면은 이 id 로 방금 쓴 줄을 그린다.
create or replace function public.add_comment(
  p_kind text, p_slug text, p_visitor uuid, p_nickname text, p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nickname text := trim(coalesce(p_nickname, ''));
  v_body     text := trim(coalesce(p_body, ''));
  v_id       uuid;
begin
  if p_kind is null or p_kind not in ('thought') then
    raise exception 'invalid kind';
  end if;

  -- 슬러그는 MDX 파일명에서 오므로 소문자·숫자·하이픈뿐이다
  if p_slug is null or p_slug !~ '^[a-z0-9-]{1,64}$' then
    raise exception 'invalid slug';
  end if;

  if p_visitor is null then
    raise exception 'invalid visitor';
  end if;

  if char_length(v_nickname) not between 1 and 24 then
    raise exception 'invalid nickname';
  end if;

  if char_length(v_body) not between 1 and 1000 then
    raise exception 'invalid body';
  end if;

  -- 스크립트가 함수를 연타해 테이블을 채우는 것만 막는다 (좋아요와 같은 태도 —
  -- 로그인 없는 댓글에서 어뷰징을 원리상 다 막을 수는 없고, 쌓이는 속도만 늦춘다.
  -- 남는 건 hidden 으로 치운다).
  if exists (
    select 1 from content_comments
     where visitor_id = p_visitor
       and created_at > now() - interval '20 seconds'
  ) then
    raise exception 'too fast';
  end if;

  insert into content_comments (kind, slug, visitor_id, nickname, body)
  values (p_kind, p_slug, p_visitor, v_nickname, v_body)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.add_comment(text, text, uuid, text, text) from public;
grant execute on function public.add_comment(text, text, uuid, text, text) to anon, authenticated;

-- ── 읽기 ─────────────────────────────────────────────────────
-- p_visitor 는 "내 댓글인가" 를 계산하는 데만 쓴다. visitor_id 자체는 안 나간다.
create or replace function public.comments_for(p_kind text, p_slug text, p_visitor uuid)
returns table (id uuid, nickname text, body text, created_at timestamptz, mine boolean)
language sql
security definer
set search_path = public
as $$
  select c.id, c.nickname, c.body, c.created_at, c.visitor_id = p_visitor as mine
  from content_comments c
  where c.kind = p_kind and c.slug = p_slug and not c.hidden
  order by c.created_at asc;
$$;

revoke all on function public.comments_for(text, text, uuid) from public;
grant execute on function public.comments_for(text, text, uuid) to anon, authenticated;

-- ── 지우기 ───────────────────────────────────────────────────
-- 자물쇠는 visitor uuid 하나다. 기기를 옮기거나 저장소를 비우면 자기 댓글도
-- 못 지우게 되는데, 그건 받아들인다 — 그때는 Studio 가 있다 (위 운영 절).
create or replace function public.delete_comment(p_id uuid, p_visitor uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from content_comments where id = p_id and visitor_id = p_visitor;
  return found;
end;
$$;

revoke all on function public.delete_comment(uuid, uuid) from public;
grant execute on function public.delete_comment(uuid, uuid) to anon, authenticated;
