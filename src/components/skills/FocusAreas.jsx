import React from "react";
import { FOCUS_AREAS } from "../../data/profile";

/** Ordered core-focus strip: Cloud (AWS → GCP → Azure) → Platform → DevOps → DevSecOps. */
const FocusAreas = ({ compact = false }) => (
  <ol className={`focus ${compact ? "focus-compact" : ""}`} aria-label="Core focus areas, in priority order">
    {FOCUS_AREAS.map((area, i) => (
      <li key={area.id} className={`focus-item ${i === 0 ? "focus-primary" : ""}`}>
        <span className="focus-rank">0{i + 1}</span>
        <span className="focus-icon"><i className={area.icon} aria-hidden="true"></i></span>
        <span className="focus-body">
          <strong>{area.label}</strong>
          <span className="focus-items">
            {area.items.map((item, j) => (
              <span key={item} className={i === 0 && j === 0 ? "focus-chip focus-chip-lead" : "focus-chip"}>{item}</span>
            ))}
          </span>
        </span>
      </li>
    ))}
  </ol>
);

export default FocusAreas;
