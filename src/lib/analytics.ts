import posthog from "posthog-js";

const POSTHOG_KEY = "phc_CYS9xizYim9peDhgVCiSjJmbamsLgaUQ3xg83XtkRpHv";
const POSTHOG_HOST = "https://us.i.posthog.com";
export const CONSENT_KEY = "scp_cookie_consent";
export type Consent = "accepted" | "essential";

let initialized = false;

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Consent) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: choice not persisted; banner shows again next visit.
  }
  if (value === "accepted") {
    initAnalytics();
    if (initialized) posthog.opt_in_capturing();
  } else if (initialized) {
    posthog.opt_out_capturing();
  }
}

/** Only call after the visitor accepted analytics. Anonymous, no recordings. */
export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: "2026-05-30",
    person_profiles: "never",
    disable_session_recording: true,
    disable_surveys: true,
    enable_heatmaps: false,
    capture_dead_clicks: false,
  });
}

export const OPEN_COOKIE_SETTINGS_EVENT = "scp:open-cookie-settings";
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}
