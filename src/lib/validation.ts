/**
 * Input validation schemas and utilities for security hardening.
 * All user inputs are validated client-side (defense-in-depth) AND server-side via DB triggers.
 * Follows OWASP input validation best practices.
 */

import { z } from "zod";
import { personalityLabels, passionLabels, skillLabels } from "@/data/careerPaths";

// --- Whitelists derived from data definitions (reject unexpected values) ---
const VALID_PERSONALITY_KEYS = Object.keys(personalityLabels);
const VALID_PASSION_KEYS = Object.keys(passionLabels);
const VALID_SKILL_KEYS = Object.keys(skillLabels);

/**
 * Assessment answers schema.
 * - personality: only known trait keys, scores 1-5
 * - passions: only known passion keys, max 8
 * - skills: only known skill keys, max 9
 */
export const assessmentAnswersSchema = z.object({
  gender: z.enum(["female", "male", "non-binary", "prefer-not-to-say"]).optional(),
  personality: z
    .record(
      z.enum(VALID_PERSONALITY_KEYS as [string, ...string[]]),
      z.number().int().min(1).max(5)
    )
    .refine((obj) => Object.keys(obj).length >= 3, {
      message: "Please rate at least 3 personality traits",
    })
    .refine((obj) => Object.keys(obj).length <= VALID_PERSONALITY_KEYS.length, {
      message: "Too many personality traits",
    }),
  passions: z
    .array(z.enum(VALID_PASSION_KEYS as [string, ...string[]]))
    .min(1, "Select at least one passion area")
    .max(VALID_PASSION_KEYS.length, "Too many passion areas"),
  skills: z
    .array(z.enum(VALID_SKILL_KEYS as [string, ...string[]]))
    .min(1, "Select at least one skill")
    .max(VALID_SKILL_KEYS.length, "Too many skills"),
});

/**
 * Email validation schema (reusable).
 * - Trimmed, valid format, max 255 chars
 */
export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

/**
 * Rating validation schema.
 * - Rating 1-5, comment optional max 500 chars
 */
export const ratingSchema = z.object({
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .max(500, "Comment must be less than 500 characters")
    .nullable()
    .optional()
    .transform((v) => (v?.trim() === "" ? null : v?.trim() ?? null)),
});

/**
 * Share ID schema – must be a valid UUID format.
 */
export const shareIdSchema = z.string().uuid("Invalid share link");

// --- Client-side rate limiting (defense-in-depth) ---

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Client-side rate limiter. Returns true if the action is allowed.
 * This is a soft limit; the real enforcement is in DB RLS policies.
 *
 * @param key - Unique key for the action (e.g. "assessment", "rating")
 * @param maxRequests - Max requests within the window
 * @param windowMs - Time window in milliseconds
 */
export function checkClientRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    // Window expired or first request: start fresh
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false; // Rate limit exceeded
  }

  entry.count++;
  return true;
}

/**
 * Sanitize a plain text string by removing control characters.
 * Does NOT strip HTML (we don't render user content as HTML).
 */
export function sanitizeText(input: string): string {
  // Remove control characters except newline and tab
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}
