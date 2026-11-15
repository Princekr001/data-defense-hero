import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  MAX_SITUATION_LENGTH,
  SAFETY_COACH_INSTRUCTIONS,
  getSafeGatewayError,
  parseSituation,
} from "./logic.ts";

Deno.test("accepts a useful situation and trims surrounding whitespace", () => {
  assertEquals(parseSituation("  A stranger sent me a suspicious link.  "), {
    situation: "A stranger sent me a suspicious link.",
  });
});

Deno.test("rejects empty, too-short, non-text, and overlong situations", () => {
  assertEquals(parseSituation("   "), null);
  assertEquals(parseSituation("help"), null);
  assertEquals(parseSituation(42), null);
  assertEquals(parseSituation("x".repeat(MAX_SITUATION_LENGTH + 1)), null);
});

Deno.test("coach instructions prioritize trusted-adult help and forbid retaliation", () => {
  assertEquals(SAFETY_COACH_INSTRUCTIONS.includes("tell a trusted adult right away"), true);
  assertEquals(SAFETY_COACH_INSTRUCTIONS.includes("Do not provide steps to break into accounts"), true);
});

Deno.test("preserves safe upstream status and message", () => {
  assertEquals(getSafeGatewayError({ statusCode: 402, message: "AI credits are low" }), {
    status: 402,
    message: "AI credits are low",
  });
});