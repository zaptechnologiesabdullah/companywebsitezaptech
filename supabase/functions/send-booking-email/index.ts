import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatTime12(t: string) {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function buildNewBookingHtml(data: any) {
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
    <span style="font-size:24px;font-weight:800;color:#fff;">⚡ ZAP</span>
    <h1 style="margin:12px 0 0;font-size:20px;color:#fff;">New Meeting Request</h1>
  </div>
  <div style="background:#fff;padding:24px 32px;">
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:10px;color:#64748b;font-weight:600;">👤 Client</td><td style="padding:10px;color:#1e293b;">${escapeHtml(data.clientName)}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px;color:#64748b;font-weight:600;">📧 Email</td><td style="padding:10px;"><a href="mailto:${escapeHtml(data.clientEmail)}" style="color:#2563eb;">${escapeHtml(data.clientEmail)}</a></td></tr>
      ${data.clientPhone ? `<tr><td style="padding:10px;color:#64748b;font-weight:600;">📱 Phone</td><td style="padding:10px;color:#1e293b;">${escapeHtml(data.clientPhone)}</td></tr>` : ""}
      <tr style="background:#f8fafc;"><td style="padding:10px;color:#64748b;font-weight:600;">📋 Type</td><td style="padding:10px;color:#1e293b;">${escapeHtml(data.meetingType)}</td></tr>
      <tr><td style="padding:10px;color:#64748b;font-weight:600;">📅 Date</td><td style="padding:10px;color:#1e293b;">${escapeHtml(data.bookingDate)}</td></tr>
      <tr style="background:#f8fafc;"><td style="padding:10px;color:#64748b;font-weight:600;">🕐 Time</td><td style="padding:10px;color:#1e293b;">${formatTime12(data.bookingTime)}</td></tr>
    </table>
  </div>
  <div style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:12px;color:#94a3b8;">This booking requires your approval in the admin panel.</p>
  </div>
</div>
</body></html>`;
}

function buildConfirmationHtml(data: any) {
  return `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 16px;">
  <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
    <span style="font-size:24px;font-weight:800;color:#fff;">⚡ ZAP</span>
    <h1 style="margin:12px 0 0;font-size:20px;color:#fff;">Meeting Confirmed! ✅</h1>
  </div>
  <div style="background:#fff;padding:24px 32px;">
    <p style="font-size:15px;color:#334155;line-height:1.7;">
      Hi <strong>${escapeHtml(data.clientName)}</strong>,
    </p>
    <p style="font-size:15px;color:#334155;line-height:1.7;">
      Your meeting with <strong>Zap Technologies</strong> has been confirmed!
    </p>
    <div style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:14px;"><strong>📋 Meeting:</strong> ${escapeHtml(data.meetingType)}</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>📅 Date:</strong> ${escapeHtml(data.bookingDate)}</p>
      <p style="margin:0;font-size:14px;"><strong>🕐 Time:</strong> ${formatTime12(data.bookingTime)}</p>
    </div>
    <p style="font-size:14px;color:#64748b;">We look forward to speaking with you!</p>
  </div>
  <div style="background:#f8fafc;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:12px;color:#94a3b8;">Zap Technologies — Empowering Your Business</p>
  </div>
</div>
</body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!GMAIL_APP_PASSWORD) throw new Error("GMAIL_APP_PASSWORD not configured");

    const senderEmail = "abdullahdesigner51@gmail.com";
    const senderFrom = "Zap Technologies <abdullahdesigner51@gmail.com>";
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: senderEmail, password: GMAIL_APP_PASSWORD },
      },
    });

    if (data.type === "new_booking") {
      // Notify admin
      await client.send({
        from: senderFrom,
        to: senderEmail,
        subject: `📅 New Meeting Request: ${data.clientName} — ${data.meetingType}`,
        content: `New booking from ${data.clientName} (${data.clientEmail}) for ${data.meetingType} on ${data.bookingDate} at ${data.bookingTime}`,
        html: buildNewBookingHtml(data),
      });
    } else if (data.type === "booking_confirmed") {
      // Notify client
      await client.send({
        from: senderFrom,
        to: data.clientEmail,
        subject: `✅ Meeting Confirmed — Zap Technologies`,
        content: `Your ${data.meetingType} meeting with Zap Technologies has been confirmed for ${data.bookingDate} at ${data.bookingTime}.`,
        html: buildConfirmationHtml(data),
      });
    }

    await client.close();
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Booking email error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
