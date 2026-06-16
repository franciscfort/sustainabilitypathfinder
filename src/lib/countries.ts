/**
 * ISO 3166-1 alpha-2 country code -> { name, flag emoji }
 * Flag emojis are derived from the regional indicator letters.
 */
export function codeToFlag(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "🏳️";
  const A = 0x1f1e6;
  const a = "A".charCodeAt(0);
  return String.fromCodePoint(A + (code.charCodeAt(0) - a), A + (code.charCodeAt(1) - a));
}

// Use Intl.DisplayNames where available for localized names.
const displayNames = typeof Intl !== "undefined" && "DisplayNames" in Intl
  ? new Intl.DisplayNames(["en"], { type: "region" })
  : null;

export function codeToName(code: string): string {
  if (code === "UNKNOWN") return "Worldwide";
  try {
    return displayNames?.of(code) ?? code;
  } catch {
    return code;
  }
}
