import React from "react";
import { Link } from "react-router-dom";
import InteractiveTerminal from "./InteractiveTerminal";
import { FirstName, LastName, icons } from "../../editable-stuff/configurations.json";
import { CURRENT_ROLE, ALL_SKILLS, FOCUS_AREAS } from "../../data/profile";

// Focus items lead (AWS → GCP → Azure → platform → DevOps → DevSecOps), then the rest of the toolkit.
const MARQUEE = Array.from(new Set([...FOCUS_AREAS.flatMap((f) => f.items), ...ALL_SKILLS.map((s) => s.name)]));

const MainBody = () => (
  <section className="hero">
    <div className="container">
      <div className="hero-grid">
        <div className="hero-inner">
          <span className="hero-eyebrow">
            <span className="pulse-dot" aria-hidden="true"></span>
            Currently at {CURRENT_ROLE.company}
          </span>

          <h1 className="hero-title">
            <span className="hero-title-line">{FirstName}</span>
            <span className="hero-title-line gradient-text">{LastName}.</span>
          </h1>

          <p className="hero-lede">
            I design, automate and secure <strong>enterprise cloud platforms</strong> on AWS, GCP and Azure, with Kubernetes, Terraform and DevSecOps built in.
          </p>

          <ul className="hero-focus" aria-label="Core focus">
            {FOCUS_AREAS.map((f) => (
              <li key={f.id}><i className={f.icon} aria-hidden="true"></i> {f.label}</li>
            ))}
          </ul>

          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              See my work <i className="fas fa-arrow-right" aria-hidden="true"></i>
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              <i className="fas fa-paper-plane" aria-hidden="true"></i> Get in touch
            </Link>
            <span className="hero-social">
              {icons.map((icon) => (
                <a key={icon.id} href={icon.url} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={icon.image.split("-")[1]}>
                  <i className={`fab ${icon.image}`} aria-hidden="true"></i>
                </a>
              ))}
            </span>
          </div>
        </div>

        <div className="hero-terminal-wrap">
          <InteractiveTerminal />
        </div>
      </div>
    </div>

    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...MARQUEE, ...MARQUEE].map((name, i) => (
          <span key={`${name}-${i}`} className="marquee-item">{name}<span className="marquee-sep">✦</span></span>
        ))}
      </div>
    </div>
  </section>
);

export default MainBody;
