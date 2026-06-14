// Local-storage backed saved items for the personal dashboard.
const KEY = "pathfinder:saved:v1";

type SavedKind = "careers" | "skills" | "certifications" | "resources" | "trackedSkills";

interface SavedState {
  careers: string[];
  skills: string[];
  certifications: string[];
  resources: string[];
  trackedSkills: string[];
}

const empty: SavedState = { careers: [], skills: [], certifications: [], resources: [], trackedSkills: [] };

function read(): SavedState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...empty };
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return { ...empty };
  }
}

function write(s: SavedState) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("pathfinder:saved-changed"));
}

export function getSaved(): SavedState {
  return read();
}

export function isSaved(kind: SavedKind, id: string): boolean {
  return read()[kind].includes(id);
}

export function toggleSaved(kind: SavedKind, id: string): boolean {
  const s = read();
  const exists = s[kind].includes(id);
  s[kind] = exists ? s[kind].filter((x) => x !== id) : [...s[kind], id];
  write(s);
  return !exists;
}

export function clearSaved() {
  write({ ...empty });
}

export function useSavedListener(cb: () => void) {
  // simple helper for components
  if (typeof window === "undefined") return () => {};
  window.addEventListener("pathfinder:saved-changed", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("pathfinder:saved-changed", cb);
    window.removeEventListener("storage", cb);
  };
}
