import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { CONCERNS, labelOf, PROOF_APPLY_LIMITS, TEAM_SIZES, TEAM_TYPES, TIMINGS } from "@/lib/proof-apply";
import { SITE_URL } from "@/lib/seo";
import { GOAL_GUIDE, PROOF_INBOX_EMAIL } from "@/lib/site-links";

/**
 * Proof 파일럿 참여 신청 (웨이팅리스트). app/api/guides/goal-design/route.ts 와 같은 구조 —
 * 페이지는 정적이고 이 라우트만 동적이라, Supabase 가 죽은 날에도 /proof 본문은 멀쩡히 나간다.
 *
 * 순서: 검증 → 허니팟 → RPC 로 저장 (5분 안 재신청은 false) → 메일 두 통.
 *   1. 알림 → PROOF_INBOX_EMAIL. 이게 핵심이라 실패하면 502 (DB 에는 이미 남았으니 로그에 남긴다).
 *   2. 접수 확인 → 신청자. 실패해도 200 — 알림은 갔다.
 * 로그에는 코드·상태만 남긴다. 이름·이메일·메모는 남기지 않는다.
 */
export const dynamic = "force-dynamic";

const values = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];

const requestSchema = z.object({
  name: z.string().trim().min(1).max(PROOF_APPLY_LIMITS.name),
  email: z.string().trim().toLowerCase().email().max(PROOF_APPLY_LIMITS.email),
  team: z.string().trim().max(PROOF_APPLY_LIMITS.team).optional().default(""),
  teamType: z.enum(values(TEAM_TYPES)),
  teamSize: z.enum(values(TEAM_SIZES)),
  concerns: z.array(z.enum(values(CONCERNS))).min(1).max(CONCERNS.length),
  timing: z.enum(values(TIMINGS)),
  note: z.string().trim().max(PROOF_APPLY_LIMITS.note).optional().default(""),
  privacyConsent: z.literal(true),
  // 허니팟. 채워져도 400 이 아니라 조용히 성공을 내야 봇이 거절을 못 알아챈다 — 그래서 길이 제한이 없다.
  company: z.string().optional().default(""),
});

/** 동의 문구를 바꾸면 날짜를 올린다 (app/privacy/page.tsx 의 시행일과 같이). */
const CONSENT_VERSION = "2026-09-23";
/** 접수 확인 메일에 목표 설계 가이드를 같이 넣는다 — 신청자가 자료실에서 이메일을 한 번 더 남기게 하지 않는다 (2026-09-23). */
const GUIDE_URL = `${SITE_URL}${GOAL_GUIDE.href}`;
const GUIDE_TITLE = `${GOAL_GUIDE.series} ${GOAL_GUIDE.volume} · 목표 설계 가이드`;
const RECEIVED_MESSAGE = "접수했습니다. 확인 메일을 보냈으니 메일함을 확인해 주세요.";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ message: "입력한 내용을 확인해 주세요. 필수 항목이 비어 있거나 형식이 다릅니다." }, { status: 400 });
  }

  const lead = parsed.data;
  if (lead.company) return Response.json({ message: RECEIVED_MESSAGE });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.GUIDE_FROM_EMAIL;

  if (!supabaseUrl || !supabaseAnonKey || !resendApiKey || !from) {
    console.error("Proof apply is missing Supabase or Resend configuration.");
    return Response.json({ message: "접수 준비 중입니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: shouldSend, error: leadError } = await supabase.rpc("request_proof_lead", {
    p_name: lead.name,
    p_email: lead.email,
    p_team: lead.team || null,
    p_team_type: lead.teamType,
    p_team_size: lead.teamSize,
    p_concerns: lead.concerns,
    p_timing: lead.timing,
    p_note: lead.note || null,
    p_consent_version: CONSENT_VERSION,
  });

  if (leadError) {
    console.error("Proof lead could not be saved:", leadError.code);
    return Response.json({ message: "신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }

  if (shouldSend === false) {
    return Response.json({ message: "이미 접수한 이메일입니다. 답을 고쳐 보냈다면 그대로 반영됐습니다." });
  }

  const teamType = labelOf(TEAM_TYPES, lead.teamType);
  const teamSize = labelOf(TEAM_SIZES, lead.teamSize);
  const timing = labelOf(TIMINGS, lead.timing);
  const concerns = lead.concerns.map((concern) => labelOf(CONCERNS, concern));

  const rows: [string, string][] = [
    ["이름", lead.name],
    ["이메일", lead.email],
    ["팀 · 기관", lead.team || "(비움)"],
    ["팀 유형", teamType],
    ["인원", teamSize],
    ["막힌 장면", concerns.join(" / ")],
    ["희망 시기", timing],
    ["메모", lead.note || "(비움)"],
  ];

  const notice = await sendEmail(resendApiKey, {
    from,
    to: [PROOF_INBOX_EMAIL],
    reply_to: lead.email,
    subject: `[Proof 신청] ${teamType} · ${teamSize} · ${lead.name}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join("\n") + `\n\n동의 버전: ${CONSENT_VERSION}`,
    html: `<div style="font-family:Arial,'Apple SD Gothic Neo',sans-serif;line-height:1.7;color:#24222a;max-width:560px;margin:auto;padding:32px 20px"><p><strong>Proof 파일럿 참여 신청</strong></p><table style="border-collapse:collapse;width:100%">${rows
      .map(([label, value]) => `<tr><td style="padding:8px 12px 8px 0;color:#6f6a80;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:8px 0;border-bottom:1px solid #e8e5f0">${escapeHtml(value)}</td></tr>`)
      .join("")}</table><p style="margin-top:24px;color:#6f6a80;font-size:13px">동의 버전 ${CONSENT_VERSION} · 이 메일에 답장하면 신청자에게 갑니다.</p></div>`,
  });

  if (!notice.ok) {
    console.error("Proof lead notice failed:", notice.status);
    return Response.json({ message: "접수를 전달하지 못했습니다. 5분 뒤 다시 시도해 주세요." }, { status: 502 });
  }

  const safeName = escapeHtml(lead.name);
  const receipt = await sendEmail(resendApiKey, {
    from,
    to: [lead.email],
    subject: "[규로롱] Proof 파일럿 참여 신청을 접수했습니다",
    text: `${lead.name}님, Proof 파일럿 참여 신청을 접수했습니다.\n\n남겨주신 팀 상황을 읽고 며칠 안에 이메일로 연락드립니다. 신청만으로 참여나 비용이 확정되지는 않습니다.\n\n그동안 팀에서 먼저 써볼 자료를 함께 보냅니다.\n${GUIDE_TITLE} (PDF ${GOAL_GUIDE.pages}장): ${GUIDE_URL}\n\n규로롱`,
    html: `<div style="font-family:Arial,'Apple SD Gothic Neo',sans-serif;line-height:1.7;color:#24222a;max-width:560px;margin:auto;padding:32px 20px"><p>${safeName}님, 안녕하세요.</p><p><strong>Proof 파일럿 참여 신청</strong>을 접수했습니다.</p><p>남겨주신 팀 상황을 읽고 며칠 안에 이메일로 연락드립니다. 신청만으로 참여나 비용이 확정되지는 않습니다.</p><p>그동안 팀에서 먼저 써볼 자료를 함께 보냅니다. <strong>${GUIDE_TITLE}</strong> (PDF ${GOAL_GUIDE.pages}장)</p><p style="margin:24px 0"><a href="${GUIDE_URL}" style="display:inline-block;background:#24222a;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">가이드 열기</a></p><p style="margin-top:32px">규로롱 드림</p></div>`,
  });

  if (!receipt.ok) {
    console.error("Proof receipt email failed:", receipt.status);
    return Response.json({ message: "접수했습니다. 확인 메일은 보내지 못했지만 신청은 남았습니다." });
  }

  return Response.json({ message: RECEIVED_MESSAGE });
}
