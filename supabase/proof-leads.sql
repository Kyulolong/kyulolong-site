-- Proof 파일럿 참여 신청(웨이팅리스트). Studio → SQL Editor 에 통째로 실행한다.
-- guide-leads.sql 과 같은 태도 — 원본은 잠그고, 검증된 함수 하나로만 받는다.
-- 받는 건 팀 소개·고민·희망 시기뿐이다 (CLAUDE.md 10번). 업무 기록·개인 평가 정보는 칸 자체가 없다.
--
-- status 는 사람이 Studio 에서 손으로 바꾸는 칸이다 (new → contacted → closed). 어드민 UI 는 만들지 않는다.
-- 명단을 볼 때:  select created_at, name, email, team, team_type, team_size, concerns, timing, note, status
--                  from proof_leads order by created_at desc;

create table if not exists public.proof_leads (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null check (char_length(name) between 1 and 40),
  email             text        not null,
  team              text        check (team is null or char_length(team) <= 60),
  team_type         text        not null check (team_type in ('startup', 'bootcamp', 'incubator', 'individual')),
  team_size         text        not null check (team_size in ('1-4', '5-10', '11-20', '21+')),
  concerns          text[]      not null check (cardinality(concerns) between 1 and 5),
  timing            text        not null check (timing in ('asap', '1-3m', 'undecided')),
  note              text        check (note is null or char_length(note) <= 300),
  consent_version   text        not null,
  status            text        not null default 'new' check (status in ('new', 'contacted', 'closed')),
  last_requested_at timestamptz not null default now(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (email)
);

alter table public.proof_leads enable row level security;
revoke all on table public.proof_leads from anon, authenticated;

-- 반환값: 메일을 보낼지. 같은 이메일이 5분 안에 다시 신청하면 false (답은 최신 것으로 갱신된다).
create or replace function public.request_proof_lead(
  p_name text,
  p_email text,
  p_team text,
  p_team_type text,
  p_team_size text,
  p_concerns text[],
  p_timing text,
  p_note text,
  p_consent_version text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := trim(coalesce(p_name, ''));
  v_email text := lower(trim(coalesce(p_email, '')));
  v_team text := nullif(trim(coalesce(p_team, '')), '');
  v_note text := nullif(trim(coalesce(p_note, '')), '');
  v_should_send boolean := true;
begin
  if char_length(v_name) not between 1 and 40 then raise exception 'invalid name'; end if;
  if char_length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid email';
  end if;
  if v_team is not null and char_length(v_team) > 60 then raise exception 'invalid team'; end if;
  if p_team_type not in ('startup', 'bootcamp', 'incubator', 'individual') then raise exception 'invalid team type'; end if;
  if p_team_size not in ('1-4', '5-10', '11-20', '21+') then raise exception 'invalid team size'; end if;
  if p_concerns is null or cardinality(p_concerns) not between 1 and 5 then raise exception 'invalid concerns'; end if;
  if exists (select 1 from unnest(p_concerns) c where c not in ('feedback', 'ai-skills', 'next-role', 'people-decision', 'other')) then
    raise exception 'invalid concerns';
  end if;
  if p_timing not in ('asap', '1-3m', 'undecided') then raise exception 'invalid timing'; end if;
  if v_note is not null and char_length(v_note) > 300 then raise exception 'invalid note'; end if;
  if p_consent_version is null or char_length(p_consent_version) > 32 then raise exception 'invalid consent'; end if;

  select last_requested_at < now() - interval '5 minutes'
    into v_should_send
    from proof_leads
   where email = v_email;

  insert into proof_leads (
    name, email, team, team_type, team_size, concerns, timing, note, consent_version,
    last_requested_at, updated_at
  ) values (
    v_name, v_email, v_team, p_team_type, p_team_size, p_concerns, p_timing, v_note, p_consent_version,
    now(), now()
  )
  on conflict (email) do update set
    name = excluded.name,
    team = excluded.team,
    team_type = excluded.team_type,
    team_size = excluded.team_size,
    concerns = excluded.concerns,
    timing = excluded.timing,
    note = excluded.note,
    consent_version = excluded.consent_version,
    last_requested_at = now(),
    updated_at = now();

  return coalesce(v_should_send, true);
end;
$$;

revoke all on function public.request_proof_lead(text, text, text, text, text, text[], text, text, text) from public;
grant execute on function public.request_proof_lead(text, text, text, text, text, text[], text, text, text) to anon, authenticated;
