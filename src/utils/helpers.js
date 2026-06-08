// ─────────────────────────────────────────
// Utility: Smart Pagination Numbers
// ─────────────────────────────────────────
export function getPageNumbers(current, total) {
  const delta = 2;
  const pages = new Set([1, total]);
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    pages.add(i);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("...");
    result.push(sorted[i]);
  }
  return result;
}

// ─────────────────────────────────────────
// Daily Picks Helpers
// ─────────────────────────────────────────

// Mulberry32 — fast seeded pseudo-random number generator
export function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 0x100000000;
  };
}

// Returns today's date in PHT (UTC+8) as a number, e.g. 20260606
// This is the seed — same for everyone on the same PH day
export function getPHTSeed() {
  const pht = new Date(Date.now() + 8 * 3600 * 1000);
  return pht.getUTCFullYear() * 10000
    + (pht.getUTCMonth() + 1) * 100
    + pht.getUTCDate();
}

// Fisher-Yates shuffle using seeded RNG, returns n items
export function seededSample(arr, n, seed) {
  const rng  = seededRng(seed);
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// Returns { hours, minutes, seconds } until next 12AM PHT
export function timeUntilMidnightPHT() {
  const nowPHT       = new Date(Date.now() + 8 * 3600 * 1000);
  const nextMidnight = new Date(nowPHT);
  nextMidnight.setUTCHours(0, 0, 0, 0);
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
  const ms = nextMidnight - nowPHT;
  return {
    hours:   Math.floor(ms / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  };
}

// ─────────────────────────────────────────
// Deep Linking — Read state from URL
// ─────────────────────────────────────────
export function readUrl() {
  const p = new URLSearchParams(window.location.search);
  return {
    view:         p.get("view")           || "dashboard",
    page:         parseInt(p.get("page")) || 1,
    minRating:    p.get("rating")         || "",
    maxRating:    p.get("maxrating")      || "",
    fromYear:     p.get("from")           || "",
    toYear:       p.get("to")             || "",
    sortBy:       p.get("sort")           || "download_count",
    genre:        p.get("genre")          || "Overall",
    activeSearch: p.get("search")         || "",
    selectedId:   p.get("movie") ? parseInt(p.get("movie")) : null,
  };
}
