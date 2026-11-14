/**
 * Tiny fuzzy matcher (subsequence with bonuses), no dependencies.
 * Returns { score, indices } or null when `query` is not a subsequence of `text`.
 * Higher score = better. `indices` are matched character positions for highlighting.
 */
export const fuzzyMatch = (query, text) => {
  if (!query) return { score: 0, indices: [] };
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  // Fast path: contiguous substring match scores highest.
  const sub = t.indexOf(q);
  if (sub !== -1) {
    const atWordStart = sub === 0 || /[\s\-_/.]/.test(t[sub - 1]);
    return {
      score: 100 + (atWordStart ? 50 : 0) - sub + (q.length === t.length ? 50 : 0),
      indices: Array.from({ length: q.length }, (_, i) => sub + i),
    };
  }

  let score = 0;
  let ti = 0;
  let prev = -2;
  const indices = [];
  for (let qi = 0; qi < q.length; qi++) {
    const ch = q[qi];
    if (ch === " ") continue;
    const found = t.indexOf(ch, ti);
    if (found === -1) return null;
    const atWordStart = found === 0 || /[\s\-_/.]/.test(t[found - 1]);
    score += 1;
    if (found === prev + 1) score += 4;
    if (atWordStart) score += 6;
    score -= Math.min(found - ti, 5) * 0.5;
    indices.push(found);
    prev = found;
    ti = found + 1;
  }
  return { score, indices };
};

/** Scores an item against its label (highlightable) and optional keywords. */
export const scoreItem = (query, label, keywords = "") => {
  const onLabel = fuzzyMatch(query, label);
  const onKeywords = keywords ? fuzzyMatch(query, keywords) : null;
  if (!onLabel && !onKeywords) return null;
  if (onLabel && (!onKeywords || onLabel.score >= onKeywords.score * 0.8)) return onLabel;
  return { score: onKeywords.score * 0.8, indices: [] };
};
