/**
 * Best-effort visitor country detection via free IP geolocation.
 * Returns a 2-letter ISO country code (uppercase) or null.
 */
export async function detectCountry(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const code = typeof data?.country_code === "string" ? data.country_code.toUpperCase() : null;
    if (code && /^[A-Z]{2}$/.test(code)) return code;
    return null;
  } catch {
    return null;
  }
}
