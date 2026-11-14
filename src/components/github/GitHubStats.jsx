import React, { useMemo, useState } from "react";
import CountUp from "../CountUp";
import { gitHubUsername } from "../../editable-stuff/configurations.json";
import {
  useGitHub, fetchRepos, fetchProfile, fetchEvents,
  topLanguages, activityGrid, LANGUAGE_COLORS,
} from "../../hooks/useGitHub";

const heatLevel = (count, max) => {
  if (count === null) return "future";
  if (count === 0) return 0;
  const r = count / Math.max(max, 1);
  return r > 0.75 ? 4 : r > 0.5 ? 3 : r > 0.25 ? 2 : 1;
};

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export const LanguageBar = ({ repos, limit = 6, showLegend = true }) => {
  const langs = useMemo(() => topLanguages(repos, limit), [repos, limit]);
  if (!langs.length) return null;
  return (
    <div className="gh-langs">
      <div className="gh-lang-bar" role="img" aria-label={`Top languages: ${langs.map((l) => `${l.name} ${l.pct}%`).join(", ")}`}>
        {langs.map((l) => (
          <span key={l.name} style={{ flexGrow: l.count, background: LANGUAGE_COLORS[l.name] || "var(--color-text-tertiary)" }} title={`${l.name} ${l.pct}%`} />
        ))}
      </div>
      {showLegend && (
        <ul className="gh-lang-legend">
          {langs.map((l) => (
            <li key={l.name}>
              <span className="gh-dot" style={{ background: LANGUAGE_COLORS[l.name] || "var(--color-text-tertiary)" }} />
              {l.name} <span className="gh-muted">{l.pct}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ActivityHeatmap = ({ events, weeks = 13 }) => {
  const [hover, setHover] = useState(null);
  const { grid, total } = useMemo(() => activityGrid(events, weeks), [events, weeks]);
  const max = useMemo(() => Math.max(0, ...grid.flat().map((c) => c.count || 0)), [grid]);

  return (
    <div className="gh-heat">
      <div className="gh-heat-grid">
        <div className="gh-heat-days" aria-hidden="true">
          {DAY_LABELS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
        {grid.map((col, w) => (
          <div key={w} className="gh-heat-col">
            {col.map((cell) => {
              const level = heatLevel(cell.count, max);
              return (
                <span
                  key={cell.date.toISOString()}
                  className={`gh-cell lvl-${level}`}
                  onMouseEnter={() => cell.count !== null && setHover(cell)}
                  onMouseLeave={() => setHover(null)}
                  aria-hidden="true"
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="gh-heat-foot">
        <span className="gh-muted">
          {hover
            ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} on ${hover.date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" })}`
            : `${total} public contributions in the last ${weeks} weeks`}
        </span>
        <span className="gh-heat-legend" aria-hidden="true">
          Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`gh-cell lvl-${l}`} />)} More
        </span>
      </div>
    </div>
  );
};

const GitHubStats = () => {
  const repos = useGitHub(fetchRepos);
  const profile = useGitHub(fetchProfile);
  const events = useGitHub(fetchEvents);

  const totals = useMemo(() => {
    if (!repos.data) return null;
    return {
      stars: repos.data.reduce((s, r) => s + r.stargazers_count, 0),
      forks: repos.data.reduce((s, r) => s + r.forks_count, 0),
    };
  }, [repos.data]);

  if (repos.error && profile.error) {
    return (
      <div className="card card-pad gh-panel gh-error">
        <i className="fab fa-github" aria-hidden="true"></i>
        <p>GitHub's API is rate-limiting right now. <a href={`https://github.com/${gitHubUsername}`} target="_blank" rel="noopener noreferrer">View my profile on GitHub →</a></p>
      </div>
    );
  }

  const stats = [
    { label: "Public repos", value: profile.data?.public_repos ?? repos.data?.length },
    totals?.stars
      ? { label: "Stars earned", value: totals.stars }
      : { label: "Languages", value: repos.data ? topLanguages(repos.data, 99).length : undefined },
    { label: "Followers", value: profile.data?.followers },
    { label: "Forks", value: totals?.forks },
  ];

  return (
    <div className="gh-panel">
      <div className="gh-panel-head">
        <span className="cluster" style={{ "--gap": "0.5rem" }}>
          <span className="pulse-dot" aria-hidden="true"></span>
          <span className="section-kicker" style={{ marginBottom: 0 }}>Live from GitHub</span>
        </span>
        <a href={`https://github.com/${gitHubUsername}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
          <i className="fab fa-github" aria-hidden="true"></i> @{gitHubUsername}
        </a>
      </div>

      <div className="gh-grid">
        <div className="card card-pad gh-stats">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat-number">
                {s.value === undefined ? <span className="skeleton" style={{ width: 48 }} /> : <CountUp end={s.value} />}
              </span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="card card-pad">
          <h3 className="gh-card-title">Top languages</h3>
          {repos.data ? <LanguageBar repos={repos.data} /> : <span className="skeleton" style={{ height: 10, width: "100%" }} />}
        </div>

        <div className="card card-pad gh-heat-card">
          <h3 className="gh-card-title">Recent activity</h3>
          {events.data ? (
            <ActivityHeatmap events={events.data} />
          ) : events.error ? (
            <p className="gh-muted">Activity is unavailable right now.</p>
          ) : (
            <span className="skeleton" style={{ height: 90, width: "100%" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;
