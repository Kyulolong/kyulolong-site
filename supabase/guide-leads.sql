-- 목표 설계 가이드 신청자. Studio → SQL Editor 에 통째로 실행한다.
-- 원본 개인정보는 공개하지 않고, 검증된 함수 하나로만 신청을 받는다.

create table if not exists public.guide_leads (
  id                  uuid        primary key default gen_random_uuid(),
  guide_slug          text        not null default 'goal-design-01',
  name                text        not null check (char_length(name) between 1 and 40),
  email               text        not null,
  marketing_consent   boolean     not null default false,
  consent_version     text        not null,
  marketing_consent_at timestamptz,
  last_requested_at   timestamptz not null default now(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (guide_slug, email)
);

alter table public.guide_leads enable row level security;
revoke all on table public.guide_leads from anon, authenticated;

create or replace function public.request_guide_lead(
  p_name text,
  p_email text,
  p_marketing_consent boolean,
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
  v_should_send boolean := true;
begin
  if char_length(v_name) not between 1 and 40 then raise exception 'invalid name'; end if;
  if char_length(v_email) > 254 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid email';
  end if;
  if p_consent_version is null or char_length(p_consent_version) > 32 then raise exception 'invalid consent'; end if;

  select last_requested_at < now() - interval '5 minutes'
    into v_should_send
    from guide_leads
   where guide_slug = 'goal-design-01' and email = v_email;

  insert into guide_leads (
    guide_slug, name, email, marketing_consent, consent_version,
    marketing_consent_at, last_requested_at, updated_at
  ) values (
    'goal-design-01', v_name, v_email, coalesce(p_marketing_consent, false), p_consent_version,
    case when p_marketing_consent then now() else null end, now(), now()
  )
  on conflict (guide_slug, email) do update set
    name = excluded.name,
    marketing_consent = excluded.marketing_consent,
    consent_version = excluded.consent_version,
    marketing_consent_at = case
      when excluded.marketing_consent and not guide_leads.marketing_consent then now()
      when excluded.marketing_consent then guide_leads.marketing_consent_at
      else null
    end,
    last_requested_at = now(),
    updated_at = now();

  return coalesce(v_should_send, true);
end;
$$;

revoke all on function public.request_guide_lead(text, text, boolean, text) from public;
grant execute on function public.request_guide_lead(text, text, boolean, text) to anon, authenticated;
