import { useEffect, useState } from "react";
import { gitHubUsername } from "../editable-stuff/configurations.json";

/*
  Shared, cached GitHub fetchers. Unauthenticated GitHub API calls are limited
  to 60/hour per IP, so every consumer (home bento, projects page, stats panel,
  command palette) shares one in-flight promise per resource and the results
  are cached in sessionStorage for CACHE_TTL.
*/

const API = "https://api.github.com";
const CACHE_TTL = 15 * 60 * 1000;
const inflight = {};

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(`gh:${key}`);
    if (!raw) return null;
    const { at, data } = JSON.parse(raw);
    return Date.now() - at < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(`gh:${key}`, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage full or blocked — cache is best-effort */
  }
};

const cachedFetch = (key, url) => {
  const cached = readCache(key);
  if (cached) return Promise.resolve(cached);
  if (!inflight[key]) {
    inflight[key] = fetch(url, { headers: { Accept: "application/vnd.github+json" } })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`GitHub API error: ${res.status}`))))
      .then((data) => {
        writeCache(key, data);
        return data;
      })
      .finally(() => {
        delete inflight[key];
      });
  }
  return inflight[key];
};

export const fetchRepos = () =>
  cachedFetch("repos", `${API}/users/${gitHubUsername}/repos?per_page=100&sort=updated`).then((repos) =>
    Array.isArray(repos) ? repos.filter((r) => !r.fork) : []
  );

export const fetchProfile = () => cachedFetch("profile", `${API}/users/${gitHubUsername}`);

export const fetchEvents = () =>
  cachedFetch("events", `${API}/users/${gitHubUsername}/events/public?per_page=100`).then((e) =>
    Array.isArray(e) ? e : []
  );

/** Generic hook: `useGitHub(fetchRepos)` → { data, error, loading } */
export const useGitHub = (fetcher) => {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return state;
};

/* ---- derived stats ---- */

export const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", Java: "#b07219",
  HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051", Dockerfile: "#384d54",
  Go: "#00ADD8", PHP: "#4F5D95", Ruby: "#701516", "C++": "#f34b7d", C: "#555555",
  Swift: "#ffac45", Kotlin: "#A97BFF", Rust: "#dea584", HCL: "#844FBA", SCSS: "#c6538c",
};

export const topLanguages = (repos, limit = 6) => {
  const counts = {};
  repos.forEach((r) => {
    if (r.language) counts[r.language] = (counts[r.language] || 0) + 1;
  });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));
};

/** Buckets public events into a weeks × 7 grid (oldest week first) for the heatmap. */
export const activityGrid = (events, weeks = 13) => {
  const DAY = 86400000;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Grid ends on the Saturday of the current week so columns are calendar weeks.
  const end = new Date(today.getTime() + (6 - today.getDay()) * DAY);
  const start = new Date(end.getTime() - (weeks * 7 - 1) * DAY);

  const counts = {};
  events.forEach((e) => {
    const d = new Date(e.created_at);
    d.setHours(0, 0, 0, 0);
    const key = d.toDateString();
    const weight = e.type === "PushEvent" ? e.payload?.size || 1 : 1;
    counts[key] = (counts[key] || 0) + weight;
  });

  const grid = [];
  for (let w = 0; w < weeks; w++) {
    const col = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime() + (w * 7 + d) * DAY);
      col.push({ date, count: date > today ? null : counts[date.toDateString()] || 0 });
    }
    grid.push(col);
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return { grid, total };
};
