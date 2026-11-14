import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../Reveal';
import CountUp from '../CountUp';
import { gitHubUsername } from '../../editable-stuff/configurations.json';
import { fetchRepos } from '../../hooks/useGitHub';
import { SUMMARY, FOCUS_AREAS, CERTIFICATIONS, yearsOfExperience } from '../../data/profile';

const TIME_ZONE = 'Australia/Melbourne';

const formatLocalTime = () =>
  new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit', timeZone: TIME_ZONE }).format(new Date());

const HIGHLIGHTS = [
  { icon: 'fas fa-cloud', title: 'Cloud Governance at Scale', description: 'Allow-list Service Control Policies across the AWS organisation, an AWS Service Catalog offering, and multi-account landing zones on AWS and GCP.', metric: 'AWS-first, multi-cloud' },
  { icon: 'fas fa-layer-group', title: 'Platform Engineering', description: 'Secure OpenShift, EKS and GKE platforms with Istio, RBAC and OPA Gatekeeper, plus developer self-service within policy-governed guardrails.', metric: 'Kubernetes · OpenShift' },
  { icon: 'fas fa-shield-halved', title: 'DevSecOps & Supply Chain', description: 'SAST, DAST, SCA, SBOM and image signing embedded in CI/CD, with continuous CSPM against CIS, ISO 27001, SOC2, NIST and PCI-DSS.', metric: 'Security by default' },
  { icon: 'fas fa-robot', title: 'Secure AI Platforms', description: 'Reference architecture for agentic AI on AWS Bedrock AgentCore with Guardrails, WAF, multi-provider authorisers and RAG on OpenSearch Serverless.', metric: 'Bedrock · RAG' },
  { icon: 'fas fa-route', title: 'Cloud Migration', description: 'Led a Migration Acceleration Program assessment for 50+ workloads, with wave sequencing, risk analysis and right-sizing recommendations.', metric: '50+ Workloads Assessed' },
  { icon: 'fas fa-users-cog', title: 'Teams & Culture', description: 'Built, hired and scaled Platform Engineering and DevSecOps teams; coaching engineers through workshops and design reviews.', metric: 'Automation-first culture' },
];

const COMPETENCIES = [
  { category: 'Cloud Platforms', icon: 'fas fa-cloud', skills: ['AWS (primary)', 'GCP', 'Azure', 'Multi-cloud & Hybrid', 'AWS Organizations', 'SCPs'] },
  { category: 'Platform & Containers', icon: 'fas fa-layer-group', skills: ['Kubernetes', 'EKS', 'GKE', 'OpenShift', 'ECS Fargate', 'Docker', 'Helm', 'Istio'] },
  { category: 'IaC & Automation', icon: 'fas fa-code-branch', skills: ['Terraform', 'Terraform Cloud', 'CloudFormation', 'CDK', 'Pulumi'] },
  { category: 'CI/CD & Secrets', icon: 'fas fa-infinity', skills: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD', 'Vault'] },
  { category: 'DevSecOps & Compliance', icon: 'fas fa-shield-halved', skills: ['SAST/DAST/SCA', 'OPA', 'Checkov', 'CSPM', 'SBOM', 'Zero-Trust IAM', 'ISO 27001', 'SOC2', 'NIST', 'PCI-DSS'] },
  { category: 'AI Platforms & Security', icon: 'fas fa-robot', skills: ['AWS Bedrock', 'AgentCore', 'Guardrails', 'Knowledge Bases', 'RAG', 'OpenSearch Serverless'] },
  { category: 'AWS Services', icon: 'fab fa-aws', skills: ['ECS Fargate', 'Lambda', 'API Gateway', 'ALB', 'WAF', 'DynamoDB', 'KMS', 'AWS Backup', 'Service Catalog', 'Secrets Manager', 'Cognito'] },
  { category: 'Observability', icon: 'fas fa-chart-line', skills: ['Dynatrace', 'Splunk', 'Prometheus', 'Grafana', 'ELK', 'OpenTelemetry', 'CloudWatch', 'X-Ray'] },
  { category: 'Scripting & Dev', icon: 'fas fa-terminal', skills: ['Python', 'Go', 'Bash', 'REST', 'GraphQL', 'gRPC'] },
];

const AboutSection = () => {
  const [localTime, setLocalTime] = useState(formatLocalTime);
  const [copied, setCopied] = useState(false);
  const [gh, setGh] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(formatLocalTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchRepos()
      .then((owned) => {
        if (cancelled || !owned.length) return;
        const stars = owned.reduce((sum, r) => sum + r.stargazers_count, 0);
        const latest = owned.reduce((a, b) => (new Date(a.updated_at) > new Date(b.updated_at) ? a : b), owned[0]);
        setGh({ repoCount: owned.length, stars, latestName: latest?.name, latestDate: latest?.updated_at });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('anuragvaidhya786@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
  <div className="container">
    <Reveal className="section" style={{ paddingTop: 0 }}>
      <div className="about-hero-grid">
        <img
          src="/profile.webp"
          width={220}
          height={220}
          decoding="async"
          alt="Anurag Vaidhya"
          style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}
          onError={(e) => { e.target.src = '/profile.jpg'; }}
        />
        <div>
          <h1 style={{ fontSize: 'var(--fs-2xl)' }}>Anurag Vaidhya</h1>
          <div className="tag-list" style={{ marginTop: 'var(--space-xs)' }}>
            {FOCUS_AREAS.map((f, i) => <span key={f.id} className={`tag ${i === 0 ? 'tag-accent' : ''}`}>{i === 0 ? 'Cloud: AWS · GCP · Azure' : f.label}</span>)}
          </div>

          <div className="cluster" style={{ '--gap': 'var(--space-sm)', marginTop: 'var(--space-2xs)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-tertiary)' }}>
            <span><i className="fas fa-map-marker-alt" aria-hidden="true"></i> Melbourne, Australia</span>
            <span className="cluster" style={{ '--gap': '0.4rem' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
              {localTime} local time &middot; open to opportunities
            </span>
          </div>

          <div className="stat-grid" style={{ margin: 'var(--space-md) 0' }}>
            <div className="stat"><span className="stat-number"><CountUp end={yearsOfExperience()} suffix="+" /></span><span className="stat-label">Years Experience</span></div>
            <div className="stat"><span className="stat-number"><CountUp end={3} /></span><span className="stat-label">Clouds: AWS, GCP, Azure</span></div>
            <div className="stat"><span className="stat-number"><CountUp end={CERTIFICATIONS.length} /></span><span className="stat-label">Certifications</span></div>
          </div>

          <div className="cluster">
            <Link to="/contact" className="btn btn-primary">
              <i className="fas fa-envelope" aria-hidden="true"></i> Get In Touch
            </Link>
            <a href="/resume.pdf" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              <i className="fas fa-download" aria-hidden="true"></i> Resume
            </a>
            <button type="button" className="btn btn-ghost" onClick={copyEmail}>
              <i className={copied ? 'fas fa-check' : 'far fa-copy'} aria-hidden="true"></i> {copied ? 'Copied!' : 'Copy email'}
            </button>
          </div>
        </div>
      </div>
    </Reveal>

    <Reveal as="section" className="section-sm stack" style={{ '--gap': 'var(--space-sm)', maxWidth: 760 }}>
      {SUMMARY.map((para) => (
        <p key={para.slice(0, 24)} style={{ color: 'var(--color-text-secondary)', lineHeight: 'var(--lh-normal)', fontSize: 'var(--fs-md)' }}>{para}</p>
      ))}
    </Reveal>

    <Reveal as="section" className="section-sm">
      <div className="section-header">
        <span className="section-kicker">Impact</span>
        <h2 className="section-title">Key Highlights</h2>
      </div>
      <div className="grid grid-auto-lg">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="card card-hover card-pad stack" style={{ '--gap': 'var(--space-2xs)' }}>
            <span className="icon-tile"><i className={h.icon}></i></span>
            <h3 style={{ fontSize: 'var(--fs-md)' }}>{h.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--fs-sm)' }}>{h.description}</p>
            <span className="tag tag-accent" style={{ alignSelf: 'flex-start' }}>{h.metric}</span>
          </div>
        ))}
      </div>
    </Reveal>

    <Reveal as="section" className="section-sm">
      <div className="section-header">
        <span className="section-kicker">Toolkit</span>
        <h2 className="section-title">Core Competencies</h2>
      </div>
      <div className="grid grid-auto-lg">
        {COMPETENCIES.map((c) => (
          <div key={c.category} className="card card-pad stack" style={{ '--gap': 'var(--space-xs)' }}>
            <div className="cluster" style={{ '--gap': 'var(--space-2xs)', flexWrap: 'nowrap' }}>
              <span className="icon-tile"><i className={c.icon}></i></span>
              <h3 style={{ fontSize: 'var(--fs-sm)' }}>{c.category}</h3>
            </div>
            <div className="tag-list">
              {c.skills.map((s) => <span key={s} className="tag">{s}</span>)}
            </div>
          </div>
        ))}
      </div>
    </Reveal>

    {gh && (
      <Reveal as="section" className="section-sm card card-pad" style={{ padding: 'var(--space-lg)' }}>
        <div className="spread" style={{ marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
          <span className="cluster" style={{ '--gap': '0.5rem' }}>
            <span className="pulse-dot"></span>
            <span className="section-kicker" style={{ marginBottom: 0 }}>Live from GitHub</span>
          </span>
          <a href={`https://github.com/${gitHubUsername}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
            @{gitHubUsername} <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <span className="stat-number"><CountUp end={gh.repoCount} suffix="+" /></span>
            <span className="stat-label">Public Repos</span>
          </div>
          {gh.stars > 0 && (
            <div className="stat">
              <span className="stat-number"><CountUp end={gh.stars} /></span>
              <span className="stat-label">Stars Earned</span>
            </div>
          )}
          {gh.latestName && (
            <div className="stat">
              <span className="stat-number" style={{ fontSize: 'var(--fs-md)', fontFamily: 'var(--font-mono)' }}>{gh.latestName}</span>
              <span className="stat-label">Last Updated Repo</span>
            </div>
          )}
        </div>
      </Reveal>
    )}

    <Reveal as="section" className="section-sm contact-cta card">
      <h2 className="section-title">Let's Connect</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)' }}>
        Always open to discussing technology, leadership, and opportunities to create impact together.
      </p>
      <div className="cluster" style={{ justifyContent: 'center' }}>
        <Link to="/contact" className="btn btn-primary"><i className="fas fa-envelope" aria-hidden="true"></i> Get In Touch</Link>
        <a href="https://www.linkedin.com/in/anurag-vaidhya-47b93222" target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><i className="fab fa-linkedin" aria-hidden="true"></i> LinkedIn</a>
        <a href="https://github.com/anuu1989" target="_blank" rel="noopener noreferrer" className="btn btn-secondary"><i className="fab fa-github" aria-hidden="true"></i> GitHub</a>
      </div>
    </Reveal>
  </div>
  );
};

export default AboutSection;
