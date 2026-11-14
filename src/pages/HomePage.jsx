import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";
import MainBody from "../components/home/MainBody";
import { LanguageBar } from "../components/github/GitHubStats";
import FocusAreas from "../components/skills/FocusAreas";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useGitHub, fetchRepos } from "../hooks/useGitHub";
import {
  CURRENT_ROLE, EXPERIENCES, CERTIFICATIONS, LOCATION,
  yearsOfExperience, tenureMonths, formatTenure,
} from "../data/profile";

const formatRelative = (dateString) => {
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const useLocalClock = (timeZone) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-AU", { timeZone, hour: "numeric", minute: "2-digit" });
  const hour = Number(now.toLocaleString("en-AU", { timeZone, hour: "numeric", hourCycle: "h23" }));
  const day = now.toLocaleDateString("en-AU", { timeZone, weekday: "long" });
  const isWeekend = day === "Saturday" || day === "Sunday";
  const status = hour >= 9 && hour < 18 && !isWeekend ? "working" : hour >= 7 && hour < 23 ? "around" : "asleep";
  return { time, day, status };
};

const STATUS_COPY = {
  working: { label: "Working hours", tone: "ok" },
  around: { label: "Probably around", tone: "warn" },
  asleep: { label: "Likely asleep", tone: "muted" },
};

const HomePage = () => {
  useDocumentTitle("Cloud, Platform Engineering & DevSecOps", "Anurag Vaidhya — AWS-first cloud, platform engineering, DevOps and DevSecOps.");
  const { data: repos, error: reposError } = useGitHub(fetchRepos);
  const clock = useLocalClock(LOCATION.timeZone);

  const recentRepos = useMemo(
    () => (repos ? [...repos].sort((a, b) => new Date(b.pushed_at || b.updated_at) - new Date(a.pushed_at || a.updated_at)).slice(0, 3) : null),
    [repos]
  );
  const stars = repos ? repos.reduce((s, r) => s + r.stargazers_count, 0) : 0;
  const activeCerts = CERTIFICATIONS.filter((c) => c.status === "Active").length;

  return (
    <div>
      <MainBody />

      <section className="section container">
        <div className="section-header">
          <span className="section-kicker">{"// at a glance"}</span>
          <h2 className="section-title">The short version.</h2>
        </div>

        <Reveal className="bento" stagger>
          {/* Intro */}
          <Link to="/about" className="card card-hover bento-tile bento-intro">
            <img src="/profile.webp" alt="Anurag Vaidhya" className="bento-avatar" width={88} height={88} loading="lazy" decoding="async" />
            <div>
              <h3 className="bento-intro-title">I build the cloud platforms <span className="gradient-text">other teams build on.</span></h3>
              <p className="bento-muted">
                {yearsOfExperience()}+ years designing, automating and securing enterprise-scale platforms: landing
                zones and SCPs on AWS, Kubernetes and OpenShift, Terraform at scale, and DevSecOps in every pipeline.
              </p>
            </div>
            <span className="bento-link">More about me <i className="fas fa-arrow-right" aria-hidden="true"></i></span>
          </Link>

          {/* Current role */}
          <Link to="/experience" className="card card-hover bento-tile bento-role">
            <span className="bento-label">Currently</span>
            <span className="company-logo-frame"><img src={CURRENT_ROLE.logo} alt="" className="company-logo" /></span>
            <div>
              <strong className="bento-strong">{CURRENT_ROLE.company}</strong>
              <p className="bento-muted bento-small">{CURRENT_ROLE.position}</p>
              <p className="bento-muted bento-small">for {formatTenure(tenureMonths(CURRENT_ROLE))}</p>
            </div>
          </Link>

          {/* Local time */}
          <div className="card bento-tile bento-clock">
            <span className="bento-label"><i className="fas fa-location-dot" aria-hidden="true"></i> {LOCATION.city}</span>
            <span className="bento-clock-time">{clock.time}</span>
            <span className="bento-muted bento-small">{clock.day}</span>
            <span className={`bento-status ${STATUS_COPY[clock.status].tone}`}>
              <span className="bento-status-dot" /> {STATUS_COPY[clock.status].label}
            </span>
          </div>

          {/* Numbers */}
          <div className="card bento-tile bento-stats">
            <div className="stat"><span className="stat-number gradient-text"><CountUp end={yearsOfExperience()} suffix="+" /></span><span className="stat-label">Years in tech</span></div>
            <div className="stat"><span className="stat-number gradient-text"><CountUp end={EXPERIENCES.length} /></span><span className="stat-label">Companies</span></div>
            <div className="stat"><span className="stat-number gradient-text"><CountUp end={50} suffix="+" /></span><span className="stat-label">Workloads assessed</span></div>
            <div className="stat"><span className="stat-number gradient-text"><CountUp end={activeCerts} /></span><span className="stat-label">Active certs</span></div>
          </div>

          {/* GitHub */}
          <Link to="/projects" className="card card-hover bento-tile bento-gh">
            <div className="spread">
              <span className="bento-label"><i className="fab fa-github" aria-hidden="true"></i> GitHub, live</span>
              {repos && <span className="bento-muted bento-small">{repos.length} repos{stars > 0 ? ` · ★ ${stars}` : ""}</span>}
            </div>
            {repos ? (
              <LanguageBar repos={repos} limit={5} />
            ) : reposError ? (
              <p className="bento-muted bento-small">GitHub is rate-limiting right now — see the projects page.</p>
            ) : (
              <span className="skeleton" style={{ height: 10, width: "100%" }} />
            )}
          </Link>

          {/* Core focus — ordered */}
          <Link to="/skills" className="card card-hover bento-tile bento-skills">
            <span className="bento-label">Core focus, in order</span>
            <FocusAreas compact />
            <span className="bento-link">Explore all skills <i className="fas fa-arrow-right" aria-hidden="true"></i></span>
          </Link>

          {/* Recent repos */}
          <div className="card bento-tile bento-repos">
            <div className="spread">
              <span className="bento-label"><span className="pulse-dot" aria-hidden="true"></span> Recently shipped</span>
              <Link to="/projects" className="bento-link">All projects <i className="fas fa-arrow-right" aria-hidden="true"></i></Link>
            </div>
            <ul className="bento-repo-list">
              {recentRepos
                ? recentRepos.map((r) => (
                    <li key={r.id}>
                      <a href={r.html_url} target="_blank" rel="noopener noreferrer">
                        <span className="bento-repo-name">{r.name}</span>
                        <span className="bento-muted bento-small bento-repo-desc">{r.description || `${r.language || "Software"} project`}</span>
                        <span className="bento-repo-meta">{r.language && <span className="tag">{r.language}</span>}<span className="bento-muted bento-small">{formatRelative(r.pushed_at || r.updated_at)}</span></span>
                      </a>
                    </li>
                  ))
                : [0, 1, 2].map((i) => <li key={i}><span className="skeleton" style={{ height: 44, width: "100%" }} /></li>)}
            </ul>
          </div>

          {/* CTA */}
          <Link to="/contact" className="bento-tile bento-cta">
            <span className="bento-cta-kicker">Open to conversations</span>
            <strong>Have a platform problem worth solving?</strong>
            <span className="bento-cta-arrow"><i className="fas fa-arrow-right" aria-hidden="true"></i></span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default HomePage;
