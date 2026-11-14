import React, { useState } from "react";
import Reveal from "../Reveal";
import CountUp from "../CountUp";
import TechRadar from "../skills/TechRadar";
import FocusAreas from "../skills/FocusAreas";
import { SKILL_CATEGORIES, CERTIFICATIONS, levelLabel, yearsOfExperience } from "../../data/profile";

const RESPONSIBILITY_CATEGORIES = [
  {
    category: "Cloud Platforms & Governance", icon: "fas fa-cloud",
    items: [
      "Designing multi-account AWS and GCP landing zones with centralised IAM, network segmentation, and audit logging",
      "Enforcing organisation-wide guardrails with allow-list Service Control Policies and AWS Service Catalog",
      "Defining multi-cloud and hybrid governance: policies, guardrails, and architectural standards",
      "Leading cloud migration and modernisation — rehost, replatform, and refactor",
    ],
  },
  {
    category: "Platform Engineering", icon: "fas fa-layer-group",
    items: [
      "Engineering secure OpenShift, EKS, and GKE platforms with Istio, RBAC, and network policies",
      "Building modular Terraform / Terraform Cloud frameworks with policy-as-code enforcement",
      "Delivering developer self-service for infrastructure, secrets, networking, and deployments",
      "Designing enterprise backup and recovery with tag-based AWS Backup plans",
    ],
  },
  {
    category: "DevOps & Automation", icon: "fas fa-infinity",
    items: [
      "Building end-to-end CI/CD with GitHub Actions, GitLab CI, Jenkins, CircleCI, and ArgoCD",
      "Pre-deployment validation, cost estimation, post-deployment health tests, and guarded destroy workflows",
      "Automating provisioning, deployment, and operations to optimise cost, availability, and performance",
      "Full-stack observability with Prometheus, Grafana, ELK, Dynatrace, Splunk, and OpenTelemetry",
    ],
  },
  {
    category: "DevSecOps & Compliance", icon: "fas fa-shield-halved",
    items: [
      "Securing the software supply chain with SAST, DAST, SCA, SBOM generation, and image signing",
      "Policy as code with OPA Gatekeeper, Checkov, and Sentinel",
      "Zero-trust security models: least-privilege IAM, ABAC/RBAC, OAuth2/OIDC",
      "Continuous CSPM and compliance against CIS, ISO 27001, SOC2, NIST, PCI-DSS, and GDPR",
    ],
  },
  {
    category: "AI Platforms", icon: "fas fa-robot",
    items: [
      "Secure reference architectures for agentic AI on AWS Bedrock AgentCore",
      "AI security controls: Bedrock Guardrails, WAF, and multi-provider authorisers",
      "Retrieval-augmented generation with Bedrock Knowledge Bases and OpenSearch Serverless",
      "Rapid GenAI proofs of concept, such as a Groq-powered chatbot",
    ],
  },
  {
    category: "Leadership & Strategy", icon: "fas fa-users",
    items: [
      "Building, hiring, and scaling Platform Engineering and DevSecOps teams",
      "Mentoring engineers through workshops and design reviews",
      "Translating strategic goals into executable platform roadmaps",
      "Aligning platform strategy with C-suite, security, and compliance stakeholders",
    ],
  },
];

const RESPONSIBILITY_IMPACT = [
  { end: yearsOfExperience(), suffix: "+", label: "Years in Engineering" },
  { end: 50, suffix: "+", label: "Workloads Assessed for Migration" },
  { end: 3, suffix: "", label: "Clouds: AWS, GCP, Azure" },
  { end: CERTIFICATIONS.length, suffix: "", label: "Certifications Earned" },
];

const SOFT_SKILLS = [
  { name: "Leadership & Management", icon: "fas fa-users", rating: 5, description: "Leading cross-functional teams and driving organizational transformation", achievements: ["Led 15+ person teams", "Managed $2M+ budgets", "Reduced delivery time by 40%"] },
  { name: "Communication & Presentation", icon: "fas fa-comments", rating: 5, description: "Effective stakeholder engagement and technical communication", achievements: ["100+ technical presentations", "C-level stakeholder management", "Cross-cultural teams"] },
  { name: "Problem Solving & Innovation", icon: "fas fa-lightbulb", rating: 5, description: "Analytical thinking and creative solution development", achievements: ["50+ complex problems solved", "15+ process improvements", "3 patents filed"] },
  { name: "Collaboration & Teamwork", icon: "fas fa-handshake", rating: 5, description: "Building strong partnerships across diverse teams", achievements: ["Cross-functional collaboration", "Remote team leadership", "Conflict resolution"] },
  { name: "Mentoring & Development", icon: "fas fa-chalkboard-teacher", rating: 4, description: "Developing talent and fostering continuous learning", achievements: ["Mentored 25+ engineers", "Training program development", "Knowledge transfer"] },
  { name: "Strategic & Systems Thinking", icon: "fas fa-chess", rating: 5, description: "Long-term planning and architectural decision making", achievements: ["Enterprise architecture", "Technology roadmaps", "Digital transformation"] },
];

const TABS = [
  { id: "technical", icon: "fas fa-code", label: "Technical Skills" },
  { id: "radar", icon: "fas fa-bullseye", label: "Tech Radar" },
  { id: "responsibilities", icon: "fas fa-star", label: "Responsibilities" },
  { id: "soft", icon: "fas fa-users", label: "Leadership" },
  { id: "certifications", icon: "fas fa-certificate", label: "Certifications" },
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [search, setSearch] = useState("");
  const [activeRespCategory, setActiveRespCategory] = useState(0);
  const respCategory = RESPONSIBILITY_CATEGORIES[activeRespCategory];

  const filteredCategories = SKILL_CATEGORIES.map((cat) => ({
    ...cat,
    skills: cat.skills.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    ),
  })).filter((cat) => cat.skills.length > 0);

  return (
    <div className="container">
      <Reveal as="section" style={{ marginBottom: "var(--space-xl)" }}>
        <FocusAreas />
      </Reveal>

      <Reveal as="section" className="section" style={{ paddingTop: 0 }}>
        <div className="project-toolbar" style={{ marginBottom: 0 }}>
          <div className="tabs" style={{ marginBottom: 0, borderBottom: "none" }} role="tablist">
            {TABS.map((tab) => (
              <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                <i className={tab.icon} aria-hidden="true"></i> {tab.label}
              </button>
            ))}
          </div>
          {activeTab === "technical" && (
            <div className="project-search">
              <i className="fas fa-search" aria-hidden="true"></i>
              <input type="text" placeholder="Search skills or tags..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          )}
        </div>
        <div style={{ borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-lg)" }}></div>

        {activeTab === "radar" && <TechRadar />}

        {activeTab === "technical" && (
          <div className="stack" style={{ '--gap': 'var(--space-xl)' }}>
            {(search ? filteredCategories : SKILL_CATEGORIES).map((cat) => (
              <div key={cat.id}>
                <h3 className="cluster" style={{ '--gap': 'var(--space-2xs)', fontSize: "var(--fs-md)", marginBottom: "var(--space-sm)" }}>
                  <i className={cat.icon} style={{ color: "var(--color-accent)" }} aria-hidden="true"></i> {cat.title}
                </h3>
                <div className="grid grid-auto-lg">
                  {cat.skills.map((skill) => (
                    <div key={skill.name} className={`card card-pad card-hover ${skill.featured ? "skill-featured" : ""}`}>
                      <div className="spread">
                        <h4 style={{ fontSize: "var(--fs-md)" }}>{skill.name}</h4>
                        <span className={`tag ${skill.featured ? "tag-accent" : ""}`}>{skill.featured ? "Core · " : ""}{levelLabel(skill.level)}</span>
                      </div>
                      {skill.experience && (
                        <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-tertiary)", margin: "var(--space-2xs) 0" }}>
                          {skill.experience}
                        </p>
                      )}
                      <div className="progress" style={{ margin: "var(--space-2xs) 0 var(--space-sm)" }}>
                        <div className="progress-fill" style={{ width: `${skill.level}%` }}></div>
                      </div>
                      <div className="tag-list">
                        {skill.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "responsibilities" && (
          <>
            <div className="tabs" role="tablist">
              {RESPONSIBILITY_CATEGORIES.map((c, i) => (
                <button key={c.category} role="tab" aria-selected={activeRespCategory === i} className={`tab-btn ${activeRespCategory === i ? "active" : ""}`} onClick={() => setActiveRespCategory(i)}>
                  <i className={c.icon} aria-hidden="true"></i> {c.category}
                </button>
              ))}
            </div>
            <div className="grid grid-2" style={{ '--gap': 'var(--space-sm)' }}>
              {respCategory.items.map((item) => (
                <div key={item} className="card card-pad cluster" style={{ '--gap': 'var(--space-xs)', alignItems: 'flex-start', flexWrap: 'nowrap' }}>
                  <span className="icon-tile" style={{ width: 32, height: 32, fontSize: '0.85rem' }}><i className="fas fa-check"></i></span>
                  <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-secondary)' }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="stat-grid" style={{ marginTop: "var(--space-lg)" }}>
              {RESPONSIBILITY_IMPACT.map((m) => (
                <div key={m.label} className="stat">
                  <span className="stat-number"><CountUp end={m.end} suffix={m.suffix} /></span>
                  <span className="stat-label">{m.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "soft" && (
          <div className="grid grid-auto-lg">
            {SOFT_SKILLS.map((skill) => (
              <div key={skill.name} className="card card-pad">
                <div className="spread" style={{ marginBottom: "var(--space-sm)" }}>
                  <span className="icon-tile"><i className={skill.icon}></i></span>
                  <span className="star-rating">
                    {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < skill.rating ? "filled" : ""}`}></i>)}
                  </span>
                </div>
                <h3 style={{ fontSize: "var(--fs-md)", marginBottom: "var(--space-2xs)" }}>{skill.name}</h3>
                <p style={{ fontSize: "var(--fs-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-sm)" }}>{skill.description}</p>
                <ul className="stack" style={{ '--gap': '0.35rem' }}>
                  {skill.achievements.map((a) => (
                    <li key={a} className="cluster" style={{ '--gap': '0.5rem', fontSize: "var(--fs-sm)", flexWrap: "nowrap", alignItems: "flex-start" }}>
                      <i className="fas fa-check-circle" style={{ color: "var(--color-accent)" }} aria-hidden="true"></i> {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === "certifications" && (
          <>
            <div className="grid grid-auto-lg">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.name} className="card card-pad">
                  <div className="spread" style={{ marginBottom: "var(--space-sm)" }}>
                    <span className="icon-tile"><i className={cert.icon}></i></span>
                    <span className={`badge ${cert.status === "Active" ? "badge-success" : "badge-neutral"}`}>
                      <i className="fas fa-check-circle" aria-hidden="true"></i> {cert.status}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "var(--fs-sm)", lineHeight: 1.3 }}>{cert.name}</h3>
                  <p style={{ fontSize: "var(--fs-xs)", color: "var(--color-text-tertiary)", marginTop: "var(--space-2xs)" }}>{cert.issuer} &middot; {cert.year}</p>
                </div>
              ))}
            </div>
            <div className="stat-grid" style={{ marginTop: "var(--space-lg)" }}>
              <div className="stat"><span className="stat-number"><CountUp end={CERTIFICATIONS.filter((c) => c.status === "Active").length} /></span><span className="stat-label">Active Certifications</span></div>
              <div className="stat"><span className="stat-number">2022</span><span className="stat-label">Latest Achievement</span></div>
              <div className="stat"><span className="stat-number"><CountUp end={CERTIFICATIONS.length} /></span><span className="stat-label">Total Earned</span></div>
            </div>
          </>
        )}
      </Reveal>
    </div>
  );
};

export default Skills;
