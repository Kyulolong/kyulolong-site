import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  name: z.string().trim().min(1).max(40),
  email: z.string().trim().toLowerCase().email().max(254),
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
  company: z.string().max(0).optional().default(""),
});

const CONSENT_VERSION = "2026-09-22";
const GUIDE_URL = `${SITE_URL}/guides/01-goal-design-guide.pdf`;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ message: "성함과 이메일을 확인해 주세요." }, { status: 400 });
  }

  if (parsed.data.company) return Response.json({ message: "입력한 이메일로 가이드를 보냈습니다." });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.GUIDE_FROM_EMAIL;

  if (!supabaseUrl || !supabaseAnonKey || !resendApiKey || !from) {
    console.error("Guide delivery is missing Supabase or Resend configuration.");
    return Response.json({ message: "발송 준비 중입니다. 잠시 후 다시 시도해 주세요." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: shouldSend, error: leadError } = await supabase.rpc("request_guide_lead", {
    p_name: parsed.data.name,
    p_email: parsed.data.email,
    p_marketing_consent: parsed.data.marketingConsent,
    p_consent_version: CONSENT_VERSION,
  });

  if (leadError) {
    console.error("Guide lead could not be saved:", leadError.code);
    return Response.json({ message: "신청을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }

  if (shouldSend === false) {
    return Response.json({ message: "이미 발송했습니다. 메일함과 스팸함을 확인해 주세요." });
  }

  const safeName = escapeHtml(parsed.data.name);
  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [parsed.data.email],
      subject: "[규로롱] 목표 설계 가이드를 보내드립니다",
      text: `${parsed.data.name}님, 신청하신 목표 설계 가이드입니다.\n\n가이드 열기: ${GUIDE_URL}\n\n목표를 잘 쓰는 것보다, 목표가 실제 의사결정과 실행을 바꾸게 만드는 데 도움이 되길 바랍니다.\n\n규로롱`,
      html: `<div style="font-family:Arial,'Apple SD Gothic Neo',sans-serif;line-height:1.7;color:#24222a;max-width:560px;margin:auto;padding:32px 20px"><p>${safeName}님, 안녕하세요.</p><p>신청하신 <strong>목표 설계 가이드</strong>를 보내드립니다.</p><p style="margin:32px 0"><a href="${GUIDE_URL}" style="display:inline-block;background:#24222a;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">가이드 열기</a></p><p>목표를 잘 쓰는 것보다, 목표가 실제 의사결정과 실행을 바꾸게 만드는 데 도움이 되길 바랍니다.</p><p style="margin-top:32px">규로롱 드림</p></div>`,
    }),
  });

  if (!emailResponse.ok) {
    console.error("Guide email delivery failed:", emailResponse.status);
    return Response.json({ message: "메일을 보내지 못했습니다. 5분 뒤 다시 시도해 주세요." }, { status: 502 });
  }

  return Response.json({ message: "메일이 보이지 않으면 스팸함도 확인해 주세요." });
}
