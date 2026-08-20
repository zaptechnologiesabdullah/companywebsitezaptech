import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml({
  name, email, phone, inquiryType, budget, timeline, message, projectLink, attachmentUrl,
}: Record<string, string | null | undefined>) {
  const rows: { label: string; value: string }[] = [];
  rows.push({ label: "Name", value: escapeHtml(name || "—") });
  rows.push({ label: "Email", value: `<a href="mailto:${escapeHtml(email || "")}" style="color:#2563eb;text-decoration:none;">${escapeHtml(email || "—")}</a>` });
  if (phone) rows.push({ label: "Phone", value: escapeHtml(phone) });
  if (inquiryType) rows.push({ label: "Inquiry Type", value: escapeHtml(inquiryType) });
  if (budget) rows.push({ label: "Budget", value: escapeHtml(budget) });
  if (timeline) rows.push({ label: "Timeline", value: escapeHtml(timeline) });

  const tableRows = rows
    .map(
      (r, i) =>
        `<tr>
          <td style="padding:12px 16px;font-size:13px;color:#64748b;font-weight:600;white-space:nowrap;border-bottom:1px solid #e2e8f0;background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};">
            ${r.label}
          </td>
          <td style="padding:12px 16px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;background:${i % 2 === 0 ? "#f8fafc" : "#ffffff"};">
            ${r.value}
          </td>
        </tr>`
    )
    .join("");

  const attachmentSection = attachmentUrl
    ? `<tr><td colspan="2" style="padding:16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px 16px;">
            <a href="${escapeHtml(attachmentUrl)}" style="color:#2563eb;text-decoration:none;font-size:14px;font-weight:500;">📎 View / Download Attachment</a>
          </td>
        </tr></table>
      </td></tr>`
    : "";

  const linkSection = projectLink
    ? `<tr><td colspan="2" style="padding:0 16px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 16px;">
            <a href="${escapeHtml(projectLink)}" style="color:#16a34a;text-decoration:none;font-size:14px;font-weight:500;">🔗 ${escapeHtml(projectLink.length > 60 ? projectLink.substring(0, 60) + "..." : projectLink)}</a>
          </td>
        </tr></table>
      </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;">
<tr><td align="center" style="padding:32px 16px;">
<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;">

  <!-- Header -->
  <tr>
    <td style="background-color:#1e3a8a;padding:40px 32px;text-align:center;border-radius:16px 16px 0 0;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr><td style="background-color:rgba(255,255,255,0.15);border-radius:12px;padding:10px 16px;">
          <span style="font-size:26px;font-weight:800;color:#ffffff;">⚡ ZAP</span>
        </td></tr>
      </table>
      <h1 style="margin:16px 0 0;font-size:22px;font-weight:700;color:#ffffff;">New Contact Submission</h1>
      <p style="margin:8px 0 0;font-size:14px;color:#bfdbfe;">Someone reached out via your website</p>
    </td>
  </tr>

  <!-- Inquiry Badge -->
  <tr>
    <td style="background-color:#ffffff;padding:20px 32px 8px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr><td style="background-color:#dbeafe;padding:6px 18px;border-radius:20px;font-size:12px;font-weight:700;color:#4338ca;text-transform:uppercase;letter-spacing:0.8px;">
          ${escapeHtml(inquiryType || "General Inquiry")}
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Details -->
  <tr>
    <td style="background-color:#ffffff;padding:16px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;">
        ${tableRows}
      </table>
    </td>
  </tr>

  <!-- Message -->
  <tr>
    <td style="background-color:#ffffff;padding:0 32px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:20px 24px;">
          <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;">Message</p>
          <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${escapeHtml(message || "")}</p>
        </td></tr>
        ${attachmentSection}
        ${linkSection}
      </table>
    </td>
  </tr>

  <!-- Reply Button -->
  <tr>
    <td style="background-color:#ffffff;padding:8px 32px 32px;text-align:center;">
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr><td style="background-color:#2563eb;border-radius:8px;padding:14px 40px;">
          <a href="mailto:${escapeHtml(email || "")}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">Reply to ${escapeHtml((name || "").split(" ")[0])} →</a>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:24px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">This email was sent from the <strong style="color:#475569;">Zap Technologies</strong> website</p>
      <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, inquiryType, budget, timeline, message, projectLink, attachmentUrl } =
      await req.json();

    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!GMAIL_APP_PASSWORD) {
      throw new Error("GMAIL_APP_PASSWORD is not configured");
    }

    const senderEmail = "abdullahdesigner51@gmail.com";
    const senderFrom = "Zap Technologies <abdullahdesigner51@gmail.com>";

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: senderEmail,
          password: GMAIL_APP_PASSWORD,
        },
      },
    });

    const htmlContent = buildEmailHtml({
      name, email, phone, inquiryType, budget, timeline, message, projectLink, attachmentUrl,
    });

    await client.send({
      from: senderFrom,
      to: senderEmail,
      subject: `⚡ New ${inquiryType || "Contact"}: ${name} — Zap Technologies`,
      content: `New form submission from ${name} (${email}):\n\n${message}${projectLink ? `\n\nProject Link: ${projectLink}` : ""}${attachmentUrl ? `\n\nAttachment: ${attachmentUrl}` : ""}`,
      html: htmlContent,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
