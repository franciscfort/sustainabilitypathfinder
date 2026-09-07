import posthog from "posthog-js";

const POSTHOG_KEY = "phc_CYS9xizYim9peDhgVCiSjJmbamsLgaUQ3xg83XtkRpHv";
const POSTHOG_HOST = "https://us.i.posthog.com";

let initialized = false;

export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: "2026-05-30",
    person_profiles: "identified_only",
  });
}

export { posthog };
