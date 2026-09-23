/**
 * Proof 파일럿 참여 신청 — 폼(components/proof-apply-form.tsx)과 라우트(app/api/proof/apply/route.ts)와
 * SQL(supabase/proof-leads.sql)이 같은 값을 보게 하는 한 곳.
 *
 * value 는 DB 의 check 제약과 글자 그대로 같아야 한다. 보기를 더하면 SQL 의 check 도 같이 고칠 것.
 * 받는 건 팀 소개·고민·희망 시기뿐이다 (CLAUDE.md 10번) — 업무 기록이나 개인 평가 정보를 묻는 칸을
 * 여기에 더하지 않는다.
 */

export const TEAM_TYPES = [
  { value: "startup", label: "스타트업 · 작은 회사의 팀" },
  { value: "bootcamp", label: "부트캠프 · 교육기관" },
  { value: "incubator", label: "창업 지원 기관" },
  { value: "individual", label: "개인 프로젝트" },
] as const;

export const TEAM_SIZES = [
  { value: "1-4", label: "1~4명" },
  { value: "5-10", label: "5~10명" },
  { value: "11-20", label: "11~20명" },
  { value: "21+", label: "21명 이상" },
] as const;

/** /proof 의 "이런 장면에서 시작합니다" 세 장면 + 리더의 결정 + 기타 */
export const CONCERNS = [
  { value: "feedback", label: "피드백을 주고 싶은데, 결과물만으로는 근거가 없다" },
  { value: "ai-skills", label: "AI로 일은 빨라졌는데, 각자 무엇을 할 수 있게 됐는지 모르겠다" },
  { value: "next-role", label: "프로젝트가 끝나도 다음에 무엇을 맡길지 막막하다" },
  { value: "people-decision", label: "사람에 관한 결정을 미루고 있다" },
  { value: "other", label: "그 밖의 장면 (아래 메모에 적어주세요)" },
] as const;

export const TIMINGS = [
  { value: "asap", label: "가능한 빨리" },
  { value: "1-3m", label: "1~3개월 안" },
  { value: "undecided", label: "아직 정하지 않음" },
] as const;

export type TeamType = (typeof TEAM_TYPES)[number]["value"];
export type TeamSize = (typeof TEAM_SIZES)[number]["value"];
export type Concern = (typeof CONCERNS)[number]["value"];
export type Timing = (typeof TIMINGS)[number]["value"];

export function labelOf<T extends string>(options: readonly { value: T; label: string }[], value: T) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export const PROOF_APPLY_LIMITS = { name: 40, team: 60, note: 300, email: 254 } as const;
