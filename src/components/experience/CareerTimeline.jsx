import React, { useMemo, useRef, useState } from "react";
import Reveal from "../Reveal";
import { EXPERIENCES, DOMAINS, tenureMonths, formatTenure, careerStartYear } from "../../data/profile";

const CareerTimeline = () => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(() => new Set([EXPERIENCES[EXPERIENCES.length - 1].id]));
  const itemRefs = useRef({});

  const items = useMemo(
    () => [...EXPERIENCES].reverse().map((e) => ({ ...e, months: tenureMonths(e) })),
    []
  );
  const totalMonths = items.reduce((s, e) => s + e.months, 0);
  const currentYear = new Date().getFullYear();
  const yearTicks = [];
  for (let y = careerStartYear; y <= currentYear; y += 3) yearTicks.push(y);

  const matches = (e) => filter === "all" || e.domains.includes(filter);

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const jumpTo = (id) => {
    setExpanded((prev) => new Set(prev).add(id));
    itemRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="container">
      {/* Proportional tenure strip */}
      <Reveal as="section" className="tenure card card-pad">
        <div className="spread" style={{ marginBottom: "var(--space-sm)", flexWrap: "wrap" }}>
          <h2 className="tenure-title">{currentYear - careerStartYear}+ years, {EXPERIENCES.length} companies</h2>
          <span className="tenure-hint">Click a segment to jump</span>
        </div>
        <div className="tenure-strip">
          {[...items].reverse().map((e) => (
            <button
              key={e.id}
              className={`tenure-seg ${matches(e) ? "" : "dim"} ${e.end ? "" : "current"}`}
              style={{ flexGrow: e.months, "--seg": e.color }}
              onClick={() => jumpTo(e.id)}
              title={`${e.company} · ${formatTenure(e.months)}`}
            >
              <span className="tenure-seg-label">{e.company.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        <div className="tenure-years" aria-hidden="true">
          {yearTicks.map((y) => (
            <span key={y} style={{ left: `${(((y - careerStartYear) * 12) / totalMonths) * 100}%` }}>{y}</span>
          ))}
        </div>
      </Reveal>

      {/* Domain filter */}
      <div className="ct-toolbar">
        <div className="segmented" role="group" aria-label="Filter by domain">
          <button aria-pressed={filter === "all"} onClick={() => setFilter("all")}>All</button>
          {DOMAINS.map((d) => (
            <button key={d.id} aria-pressed={filter === d.id} onClick={() => setFilter(d.id)}>{d.label}</button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setExpanded(expanded.size === items.length ? new Set() : new Set(items.map((i) => i.id)))}>
          {expanded.size === items.length ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Vertical timeline */}
      <ol className="ct">
        {items.map((e) => {
          const isOpen = expanded.has(e.id);
          const isMatch = matches(e);
          return (
            <li
              key={e.id}
              ref={(el) => { itemRefs.current[e.id] = el; }}
              className={`ct-item ${isMatch ? "" : "dim"} ${e.end ? "" : "current"}`}
              style={{ "--brand": e.color }}
            >
              <div className="ct-rail" aria-hidden="true">
                <span className="ct-node" />
              </div>
              <div className="ct-when">
                <span className="ct-year">{e.start.slice(0, 4)}</span>
                <span className="ct-dur">{e.end ? formatTenure(e.months) : "Now"}</span>
              </div>
              <article className="card ct-card">
                <button className="ct-head" onClick={() => toggle(e.id)} aria-expanded={isOpen} aria-controls={`ct-body-${e.id}`}>
                  <span className="company-logo-frame ct-logo"><img src={e.logo} alt="" className="company-logo" /></span>
                  <span className="ct-head-text">
                    <span className="ct-company">
                      {e.company}
                      {!e.end && <span className="badge badge-success" style={{ marginLeft: 8 }}><span className="pulse-dot" /> Current</span>}
                    </span>
                    <span className="ct-role">{e.position}</span>
                    <span className="ct-dates">{e.duration} · {e.department}</span>
                  </span>
                  <i className={`fas fa-chevron-down ct-chev ${isOpen ? "open" : ""}`} aria-hidden="true"></i>
                </button>

                <div id={`ct-body-${e.id}`} className={`ct-body ${isOpen ? "open" : ""}`}>
                  <div className="ct-body-inner">
                    <p className="ct-desc">{e.description}</p>
                    <div className="ct-cols">
                      <div>
                        <h4 className="ct-sub">Leadership &amp; impact</h4>
                        <ul className="ct-highlights">
                          {e.highlights.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="ct-sub">Stack &amp; practices</h4>
                        <div className="tag-list">
                          {e.technologies.map((t) => <span key={t} className="tag">{t}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default CareerTimeline;
