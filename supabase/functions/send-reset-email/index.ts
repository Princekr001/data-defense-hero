import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const requestedRedirect = typeof body?.redirectTo === "string" ? body.redirectTo : "";

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 254 || !emailRe.test(email)) {
      return new Response(JSON.stringify({ error: "Valid email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Strict allowlist of redirect origins. Tokens are appended to redirectTo,
    // so an attacker-controlled URL would exfiltrate the recovery token.
    const ALLOWED_ORIGINS = new Set<string>([
      "https://data-defense-hero.lovable.app",
      "https://id-preview--22192269-dbe3-4dca-979d-15ad5d145374.lovable.app",
      ...(Deno.env.get("ALLOWED_REDIRECT_ORIGINS") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ]);

    const ALLOWED_HOST_SUFFIXES = [".lovable.app", ".lovableproject.com"];

    const isAllowedRedirect = (url: string): string | null => {
      try {
        const u = new URL(url);
        if (u.protocol !== "https:" && !(u.protocol === "http:" && u.hostname === "localhost")) {
          return null;
        }
        if (ALLOWED_ORIGINS.has(u.origin)) return u.origin + u.pathname;
        if (ALLOWED_HOST_SUFFIXES.some((s) => u.hostname.endsWith(s))) {
          return u.origin + u.pathname;
        }
        if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
          return u.origin + u.pathname;
        }
        return null;
      } catch {
        return null;
      }
    };

    const safeRedirect = isAllowedRedirect(requestedRedirect);
    if (!safeRedirect) {
      return new Response(JSON.stringify({ error: "Invalid redirect target" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate a password reset link
    const { data, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
        options: { redirectTo: safeRedirect },
      });

    if (linkError) {
      console.error("Generate link error:", linkError);
      // Don't reveal if user exists or not
      return new Response(
        JSON.stringify({ message: "If an account exists, a reset email has been sent." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = new URL(data.properties.action_link).searchParams.get("token") ||
      data.properties.action_link.split("token=")[1]?.split("&")[0];

    const resetLink = `${safeRedirect}#access_token=${token}&type=recovery`;

    // Send email via Resend
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Cipher City <noreply@resend.dev>",
        to: [email],
        subject: "Reset Your Cipher City Password",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #7c3aed;">Cipher City - Password Reset</h2>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetLink}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">Reset Password</a>
            <p style="color: #888; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        `,
      }),
    });

    const emailResult = await emailRes.json();

    if (!emailRes.ok) {
      console.error("Resend error:", emailResult);
      return new Response(
        JSON.stringify({ error: "Failed to send email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "If an account exists, a reset email has been sent." }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
