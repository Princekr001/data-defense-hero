import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import type { ModelMessage } from "npm:ai";
import { createResponsesCall } from "../_shared/responses.ts";
import { getSafeGatewayError, parseSituation, SAFETY_COACH_INSTRUCTIONS } from "./logic.ts";

const coachCorsHeaders = {
  ...corsHeaders,
  "Access-Control-Allow-Headers": `${corsHeaders["Access-Control-Allow-Headers"]}, x-lovable-aig-run-id`,
  "Access-Control-Expose-Headers": "X-Lovable-AIG-Run-ID",
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...coachCorsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: coachCorsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Use POST to ask Safety Coach." }, 405);

  const authorization = request.headers.get("Authorization") ?? "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!token || !supabaseUrl || !supabaseAnonKey) {
    return jsonResponse({ error: "Sign in to use Safety Coach." }, 401);
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await authClient.auth.getUser(token);
  if (authError || !user) return jsonResponse({ error: "Sign in to use Safety Coach." }, 401);

  let requestBody: unknown;
  try {
    requestBody = await request.json();
  } catch {
    return jsonResponse({ error: "Tell Safety Coach what happened before sending." }, 400);
  }
  const parsed = parseSituation((requestBody as { situation?: unknown } | null)?.situation);
  if (!parsed) {
    return jsonResponse({ error: "Write at least 10 characters and no more than 2,000 characters." }, 400);
  }

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return jsonResponse({ error: "Safety Coach is not configured correctly yet. Please try again later." }, 401);

  let gateway: ReturnType<typeof createResponsesCall> | null = null;
  try {
    gateway = createResponsesCall(
      request,
      { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
      [{ role: "user", content: parsed.situation } as ModelMessage],
      SAFETY_COACH_INSTRUCTIONS,
    );
    const advice = await gateway.result.text;
    if (!advice.trim()) {
      return await gateway.withRunIdHeader(
        jsonResponse({ error: "Safety Coach returned no steps. Your message is still here—please try again." }, 502),
        gateway.runIdFetch,
      );
    }
    return await gateway.withRunIdHeader(jsonResponse({ advice }, 200), gateway.runIdFetch);
  } catch (error) {
    if (request.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
      return await gateway?.withRunIdHeader(jsonResponse({ error: "Request cancelled." }, 499), gateway.runIdFetch)
        ?? jsonResponse({ error: "Request cancelled." }, 499);
    }
    const safeError = getSafeGatewayError(error);
    const response = jsonResponse({ error: safeError.message }, safeError.status);
    return gateway ? await gateway.withRunIdHeader(response, gateway.runIdFetch) : response;
  }
});