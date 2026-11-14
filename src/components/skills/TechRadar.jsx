import React, { useMemo, useState } from "react";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { radarData, levelLabel } from "../../data/profile";

const SIZE = 420;
const C = SIZE / 2;
const R = 150;
const RINGS = [25, 50, 75, 100];

const polar = (i, n, value) => {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  const r = (value / 100) * R;
  return [C + r * Math.cos(angle), C + r * Math.sin(angle)];
};

const TechRadar = () => {
  const data = useMemo(() => radarData(), []);
  const [active, setActive] = useState(0);
  const [ref, visible] = useIntersectionObserver({ threshold: 0.3, triggerOnce: true });
  const n = data.length;
  const current = data[active];

  const shape = data.map((d, i) => polar(i, n, d.score).join(",")).join(" ");

  return (
    <div className="radar" ref={ref}>
      <div className="radar-chart">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Skill radar: ${data.map((d) => `${d.domain} ${d.score}`).join(", ")}`}>
          <defs>
            <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="radar-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {RINGS.map((ring) => (
            <polygon
              key={ring}
              className="radar-ring"
              points={data.map((_, i) => polar(i, n, ring).join(",")).join(" ")}
            />
          ))}

          {data.map((d, i) => {
            const [x, y] = polar(i, n, 100);
            return <line key={d.domain} x1={C} y1={C} x2={x} y2={y} className={`radar-axis ${i === active ? "active" : ""}`} />;
          })}

          <g className={`radar-shape ${visible ? "in" : ""}`} style={{ transformOrigin: `${C}px ${C}px` }}>
            <polygon points={shape} fill="url(#radar-fill)" stroke="url(#radar-stroke)" strokeWidth="2.5" strokeLinejoin="round" />
            {data.map((d, i) => {
              const [x, y] = polar(i, n, d.score);
              return (
                <circle
                  key={d.domain}
                  cx={x}
                  cy={y}
                  r={i === active ? 7 : 4.5}
                  className={`radar-point ${i === active ? "active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                />
              );
            })}
          </g>

          {data.map((d, i) => {
            const [x, y] = polar(i, n, 122);
            const anchor = Math.abs(x - C) < 8 ? "middle" : x > C ? "start" : "end";
            return (
              <text
                key={d.domain}
                x={x}
                y={y}
                textAnchor={anchor}
                dominantBaseline="middle"
                className={`radar-label ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                {d.domain}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="radar-side">
        <div className="radar-domains" role="tablist" aria-label="Skill domains">
          {data.map((d, i) => (
            <button
              key={d.domain}
              role="tab"
              aria-selected={i === active}
              className={`radar-domain ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
            >
              <span>{d.domain}</span>
              <span className="radar-domain-score">{d.score}</span>
            </button>
          ))}
        </div>

        <div className="card card-pad radar-detail" role="tabpanel" key={current.domain}>
          <div className="spread" style={{ marginBottom: "var(--space-sm)" }}>
            <h3>{current.domain}</h3>
            <span className="tag tag-accent">{levelLabel(current.score)}</span>
          </div>
          <ul className="stack" style={{ "--gap": "0.85rem" }}>
            {current.skills.map((s) => (
              <li key={s.name}>
                <div className="spread" style={{ fontSize: "var(--fs-sm)", marginBottom: 6 }}>
                  <strong>{s.name}</strong>
                  <span className="radar-meta">{s.tags.slice(0, 3).join(" · ")}</span>
                </div>
                <div className="progress"><div className="progress-fill" style={{ width: visible ? `${s.level}%` : 0 }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TechRadar;
