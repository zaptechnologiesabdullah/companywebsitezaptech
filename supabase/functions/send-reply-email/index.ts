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

function buildReplyHtml({
  recipientName,
  subject,
  body,
}: {
  recipientName: string;
  subject: string;
  body: string;
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:32px 16px;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a8a 0%,#2563eb 50%,#3b82f6 100%);border-radius:16px 16px 0 0;padding:40px 32px;text-align:center;">
      <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;margin-bottom:16px;">
        <span style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">⚡ ZAP</span>
      </div>
      <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">
        ${escapeHtml(subject)}
      </h1>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#334155;">
        Hi ${escapeHtml(recipientName.split(" ")[0])},
      </p>
      <div style="font-size:14px;color:#334155;line-height:1.8;white-space:pre-wrap;">${escapeHtml(body)}</div>
    </div>

    <!-- CTA -->
    <div style="background:#ffffff;padding:0 32px 32px;text-align:center;">
      <a href="mailto:abdullahdesigner51@gmail.com" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;padding:14px 40px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
        Reply to Us →
      </a>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-radius:0 0 16px 16px;border-top:1px solid #e2e8f0;padding:24px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">
        This email was sent by<br/>
        <strong style="color:#475569;">Zap Technologies</strong>
      </p>
      <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;">
        ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>

  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, recipientName, subject, body } = await req.json();

    if (!recipientEmail || !subject || !body) {
      throw new Error("recipientEmail, subject, and body are required");
    }

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

    const htmlContent = buildReplyHtml({
      recipientName: recipientName || "there",
      subject,
      body,
    });

    await client.send({
      from: senderFrom,
      to: recipientEmail,
      subject: `${subject} — Zap Technologies`,
      content: body,
      html: htmlContent,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Reply email error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
