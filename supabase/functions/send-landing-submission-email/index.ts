import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeHtml(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pageTitle, pageType, formData, attachmentUrls, landingPageId } = await req.json();
    console.log("Received submission for:", pageTitle, "type:", pageType);

    const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!GMAIL_APP_PASSWORD) {
      console.error("GMAIL_APP_PASSWORD is not configured");
      throw new Error("GMAIL_APP_PASSWORD is not configured");
    }

    const senderEmail = "abdullahdesigner51@gmail.com";
    const senderFrom = "Zap Technologies <abdullahdesigner51@gmail.com>";
    const typeLabel = (pageType || "").replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    const dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const name = (formData as Record<string, string>)?.Name || (formData as Record<string, string>)?.name || "Someone";
    const userEmail = (formData as Record<string, string>)?.Email || (formData as Record<string, string>)?.email || null;

    // Build admin notification email
    const tableRows = Object.entries(formData || {})
      .map(([key, val], i) => {
        const bgColor = i % 2 === 0 ? "#f8fafc" : "#ffffff";
        const cellVal = String(val).startsWith("http")
          ? '<a href="' + escapeHtml(String(val)) + '" style="color:#2563eb;text-decoration:underline;">View File</a>'
          : escapeHtml(String(val));
        return '<tr><td style="padding:14px 20px;font-size:13px;color:#64748b;font-weight:600;white-space:nowrap;border-bottom:1px solid #e2e8f0;background:' + bgColor + ';">' + escapeHtml(key) + '</td><td style="padding:14px 20px;font-size:14px;color:#1e293b;border-bottom:1px solid #e2e8f0;background:' + bgColor + ';">' + cellVal + '</td></tr>';
      }).join("");

    const attachmentLinks = (attachmentUrls || []).length > 0
      ? '<tr><td colspan="2" style="padding:16px 20px;border-top:2px solid #e2e8f0;"><p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;">ATTACHMENTS</p>' +
        (attachmentUrls as string[]).map((url: string) =>
          '<a href="' + escapeHtml(url) + '" style="color:#2563eb;text-decoration:underline;font-size:14px;display:block;margin-bottom:6px;">' + (url.split("/").pop() || "File") + '</a>'
        ).join("") +
        '</td></tr>'
      : "";

    const adminHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;"><tr><td align="center" style="padding:40px 16px;">' +
      '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-collapse:collapse;">' +
      '<tr><td align="center" style="background-color:#1e3a8a;padding:36px 32px;border-radius:16px 16px 0 0;">' +
      '<table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="background-color:#ffffff;border-radius:10px;padding:8px 18px;">' +
      '<span style="font-size:22px;font-weight:800;color:#1e3a8a;">ZAP</span>' +
      '</td></tr></table>' +
      '<h1 style="margin:20px 0 0;font-size:20px;font-weight:700;color:#ffffff;line-height:1.4;">New ' + escapeHtml(typeLabel) + ' Submission</h1>' +
      '<p style="margin:8px 0 0;font-size:14px;color:#bfdbfe;line-height:1.4;">' + escapeHtml(pageTitle || "Landing Page") + '</p>' +
      '</td></tr>' +
      '<tr><td align="center" style="background-color:#ffffff;padding:24px 32px 8px;">' +
      '<table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="background-color:#dbeafe;padding:6px 20px;border-radius:20px;font-size:11px;font-weight:700;color:#1e40af;text-transform:uppercase;letter-spacing:1px;">' + escapeHtml(typeLabel || "Submission") + '</td></tr></table>' +
      '</td></tr>' +
      '<tr><td style="background-color:#ffffff;padding:16px 32px 32px;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:collapse;">' +
      tableRows + attachmentLinks +
      '</table></td></tr>' +
      '<tr><td align="center" style="background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:24px 32px;">' +
      '<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">This email was sent from <strong style="color:#475569;">Zap Technologies</strong></p>' +
      '<p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;">' + dateStr + '</p>' +
      '</td></tr>' +
      '</table></td></tr></table></body></html>';

    console.log("Connecting to SMTP...");
    const client = new SMTPClient({
      connection: { hostname: "smtp.gmail.com", port: 465, tls: true, auth: { username: senderEmail, password: GMAIL_APP_PASSWORD } },
    });

    // Send admin notification
    console.log("Sending admin email...");
    await client.send({
      from: senderFrom,
      to: senderEmail,
      subject: "New " + typeLabel + " Submission: " + name + " - " + pageTitle,
      content: "New submission on " + pageTitle + " from " + name,
      html: adminHtml,
    });
    console.log("Admin email sent!");

    // Send user confirmation email with resources (only for resource pages)
    if (userEmail && pageType === "resource" && landingPageId) {
      console.log("Fetching resources for user email...");
      
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: resources } = await supabase
        .from("resources")
        .select("title, description, file_url, resource_type, category")
        .eq("landing_page_id", landingPageId)
        .eq("is_active", true)
        .order("sort_order");

      let resourceRows = "";
      if (resources && resources.length > 0) {
        resourceRows = resources.map((r: any, i: number) => {
          const bgColor = i % 2 === 0 ? "#f8fafc" : "#ffffff";
          const badge = r.resource_type === "premium"
            ? '<span style="background-color:#fef3c7;color:#92400e;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">PREMIUM</span>'
            : '<span style="background-color:#dcfce7;color:#166534;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">FREE</span>';
          const downloadBtn = r.file_url
            ? '<a href="' + escapeHtml(r.file_url) + '" style="display:inline-block;background-color:#1e3a8a;color:#ffffff;padding:8px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Download</a>'
            : '<span style="color:#94a3b8;font-size:13px;">Coming Soon</span>';
          return '<tr style="background-color:' + bgColor + ';">' +
            '<td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">' +
            '<div style="margin-bottom:4px;">' + badge + (r.category ? ' <span style="color:#94a3b8;font-size:11px;margin-left:6px;">' + escapeHtml(r.category) + '</span>' : '') + '</div>' +
            '<p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1e293b;">' + escapeHtml(r.title) + '</p>' +
            (r.description ? '<p style="margin:0;font-size:13px;color:#64748b;">' + escapeHtml(r.description) + '</p>' : '') +
            '</td>' +
            '<td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;text-align:right;vertical-align:middle;">' + downloadBtn + '</td>' +
            '</tr>';
        }).join("");
      }

      const userHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;"><tr><td align="center" style="padding:40px 16px;">' +
        '<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-collapse:collapse;">' +
        
        // Header
        '<tr><td align="center" style="background-color:#1e3a8a;padding:36px 32px;border-radius:16px 16px 0 0;">' +
        '<table cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="background-color:#ffffff;border-radius:10px;padding:8px 18px;">' +
        '<span style="font-size:22px;font-weight:800;color:#1e3a8a;">ZAP</span>' +
        '</td></tr></table>' +
        '<h1 style="margin:20px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.4;">Your Free Resources Are Ready!</h1>' +
        '<p style="margin:8px 0 0;font-size:14px;color:#bfdbfe;line-height:1.4;">' + escapeHtml(pageTitle || "Resources") + '</p>' +
        '</td></tr>' +
        
        // Welcome message
        '<tr><td style="background-color:#ffffff;padding:32px 32px 16px;">' +
        '<p style="margin:0 0 8px;font-size:16px;color:#1e293b;">Hi ' + escapeHtml(name) + ',</p>' +
        '<p style="margin:0;font-size:14px;color:#64748b;line-height:1.6;">Thank you for your interest! Here are your free resources ready to download. Click the download button next to each resource to get started.</p>' +
        '</td></tr>' +
        
        // Resources table
        '<tr><td style="background-color:#ffffff;padding:8px 32px 32px;">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:collapse;">' +
        resourceRows +
        '</table></td></tr>' +
        
        // CTA
        '<tr><td align="center" style="background-color:#ffffff;padding:0 32px 32px;">' +
        '<p style="margin:0 0 16px;font-size:14px;color:#64748b;">Need help with your project? We are here to help!</p>' +
        '<a href="https://zaptechnologies.lovable.app/contact" style="display:inline-block;background-color:#1e3a8a;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Contact Us</a>' +
        '</td></tr>' +
        
        // Footer
        '<tr><td align="center" style="background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;padding:24px 32px;">' +
        '<p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">This email was sent from <strong style="color:#475569;">Zap Technologies</strong></p>' +
        '<p style="margin:6px 0 0;font-size:11px;color:#cbd5e1;">' + dateStr + '</p>' +
        '</td></tr>' +
        
        '</table></td></tr></table></body></html>';

      console.log("Sending user email to:", userEmail);
      await client.send({
        from: senderFrom,
        to: userEmail,
        subject: "Your Free Resources from Zap Technologies - " + pageTitle,
        content: "Hi " + name + ", your free resources are ready! Visit " + pageTitle + " to download them.",
        html: userHtml,
      });
      console.log("User email sent!");
    }

    await client.close();
    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
