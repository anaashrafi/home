/*
  Single source of truth for career + skills data.
  Consumed by the career timeline, tech radar, interactive terminal,
  command palette search, and the home bento grid.
*/
import Wipro from "../editable-stuff/asset/images/wipro.jpg";
import Cognizant from "../editable-stuff/asset/images/cognizant.jpg";
import Accenture from "../editable-stuff/asset/images/accenture.jpg";
import Thoughtworks from "../editable-stuff/asset/images/thoughtworks.png";
import AusPost from "../editable-stuff/asset/images/auspost.png";

export const CONTACT_EMAIL = "anuragvaidhya786@gmail.com";
export const LOCATION = { city: "Melbourne", country: "Australia", timeZone: "Australia/Melbourne" };
export const LINKS = {
  github: "https://github.com/anuu1989",
  linkedin: "https://www.linkedin.com/in/anurag-vaidhya-47b93222",
  calendly: "https://calendly.com/anuragvaidhya786",
  resume: "/resume.pdf",
};

/*
  Core focus, in priority order. Drives the hero, home bento, skills page,
  terminal and marquee ordering. Cloud is AWS-first, then GCP, then Azure.
*/
export const FOCUS_AREAS = [
  { id: "cloud", label: "Cloud", icon: "fas fa-cloud", detail: "AWS (primary) · GCP · Azure", items: ["AWS", "GCP", "Azure"] },
  { id: "platform", label: "Platform Engineering", icon: "fas fa-layer-group", detail: "Kubernetes · OpenShift · Terraform", items: ["Kubernetes", "OpenShift", "Terraform"] },
  { id: "devops", label: "DevOps", icon: "fas fa-infinity", detail: "CI/CD · GitOps · Automation", items: ["GitHub Actions", "ArgoCD", "Automation"] },
  { id: "devsecops", label: "DevSecOps", icon: "fas fa-shield-halved", detail: "Supply-chain security · Policy as code · Zero trust", items: ["SAST/DAST/SCA", "OPA & Checkov", "Zero-Trust IAM"] },
];

export const SUMMARY = [
  "I design, automate, and secure enterprise-scale cloud platforms. I engineer future-proof platforms on AWS and OpenShift, drive Terraform-based infrastructure as code at scale, and embed security and governance into every delivery layer — including secure platforms for generative AI and agentic workloads on AWS Bedrock.",
  "I translate strategic goals into actionable engineering outcomes: coaching teams, championing an automation-first culture, and aligning platform capability with business objectives across complex enterprise environments.",
];

/* Domains are used as timeline filters. Each experience lists the domains it touched. */
export const DOMAINS = [
  { id: "cloud", label: "Cloud" },
  { id: "platform", label: "Platform" },
  { id: "devops", label: "DevOps & CI/CD" },
  { id: "devsecops", label: "DevSecOps" },
  { id: "ai", label: "AI Platforms" },
  { id: "leadership", label: "Leadership" },
];

export const EXPERIENCES = [
  {
    id: "wipro",
    company: "Wipro Technologies", logo: Wipro, color: "#4A90E2",
    position: "DevSecOps Engineer & Various Engineering Roles",
    department: "Cloud · CI/CD · Security",
    start: "2011-02", end: "2020-02", duration: "Feb 2011 – Feb 2020",
    description: "Progressed through multiple engineering roles over 9 years, building deep expertise across cloud infrastructure, CI/CD automation, security engineering, and platform operations on large-scale enterprise engagements.",
    technologies: ["CI/CD", "Automation", "Cloud Infrastructure", "Security Engineering", "Agile"],
    domains: ["devops", "devsecops", "cloud", "leadership"],
    highlights: [
      "Delivered automation, infrastructure, and DevOps initiatives for global clients across financial services, retail, and telecommunications",
      "Built strong foundations in Agile delivery, stakeholder management, and engineering excellence",
      "Led onboarding, mentoring, and technology training on niche skills",
    ],
  },
  {
    id: "cognizant",
    company: "Cognizant Technology Solutions", logo: Cognizant, color: "#00A1C9",
    position: "Senior DevSecOps Engineer | Platform Engineer",
    department: "Cloud Migration · Platform",
    start: "2020-02", end: "2022-06", duration: "Feb 2020 – Jun 2022",
    description: "Led cloud migration and modernisation from on-premises to AWS and GCP — rehost, replatform and refactor — optimising performance, cost, and compliance with ISO 27001, SOC2, GDPR, and NIST.",
    technologies: ["AWS", "GCP", "OpenShift", "EKS", "GKE", "Istio", "Terraform", "CloudFormation", "Pulumi", "Prometheus", "Grafana"],
    domains: ["cloud", "platform", "devsecops", "devops"],
    highlights: [
      "Designed and deployed Cloud Landing Zones with centralised IAM, network segmentation, and compliance guardrails across multi-account AWS and GCP",
      "Implemented OpenShift and Kubernetes (EKS, GKE) platforms with Istio service mesh and workload autoscaling",
      "Built developer self-service tooling for infrastructure, secrets, networking, and deployments within policy-governed guardrails",
      "Automated security compliance-as-code with CSPM, zero-trust IAM, and network access models",
      "Full-stack observability with Prometheus, Grafana, ELK, CloudWatch, and OpenTelemetry, integrated with SIEM",
    ],
  },
  {
    id: "accenture",
    company: "Accenture Australia", logo: Accenture, color: "#A100FF",
    position: "DevSecOps & Platform Engineering Lead",
    department: "DevSecOps · Platform Engineering",
    start: "2022-06", end: "2025-08", duration: "Jun 2022 – Aug 2025",
    description: "Defined and led the DevSecOps & Platform Engineering strategy across multiple enterprise programs, operationalising secure, scalable delivery pipelines from Dev through Production.",
    technologies: ["AWS", "GCP", "Terraform Cloud", "Sentinel", "OpenShift", "EKS", "GKE", "Istio", "OPA Gatekeeper", "Snyk", "SonarQube", "Databricks", "Datadog"],
    domains: ["cloud", "platform", "devsecops", "devops", "leadership"],
    highlights: [
      "Built, hired, and scaled Platform Engineering and DevSecOps teams with standards, runbooks, on-call, and a security-by-default culture",
      "Architected multi-account Cloud Landing Zones on AWS and GCP — centralised IAM, Transit Gateway, audit logging, cost guardrails",
      "Modular Terraform & Terraform Cloud frameworks with Sentinel policy-as-code for audit-ready provisioning",
      "Secured the software supply chain end-to-end: SAST, DAST, SCA, SBOM generation, and image signing in CI/CD",
      "Implemented CSPM across AWS and GCP with CIS benchmark enforcement and automated remediation",
      "Provisioned the complete Databricks platform on AWS via Terraform and CloudFormation — zero manual console configuration",
    ],
  },
  {
    id: "thoughtworks",
    company: "Thoughtworks Australia", logo: Thoughtworks, color: "#FF6B35",
    position: "DevSecOps & Cloud Platform Engineering Lead",
    department: "AI Platforms · DevSecOps",
    start: "2025-08", end: "2025-11", duration: "Aug 2025 – Nov 2025",
    description: "Designed and built a secure AWS reference architecture for agentic AI workloads on Bedrock AgentCore using Terraform, with layered ingress, private runtime, and managed agent tiers.",
    technologies: ["AWS Bedrock", "AgentCore", "Guardrails", "OpenSearch Serverless", "ECS Fargate", "API Gateway", "WAF", "Terraform", "Checkov", "CircleCI", "GitHub Actions"],
    domains: ["ai", "cloud", "devsecops", "devops", "platform"],
    highlights: [
      "AI security in the request path: multi-provider Lambda authoriser (Kinde, Cognito, HMAC, SigV4), WAF, and Bedrock Guardrails against prompt injection and PII exposure",
      "Retrieval-augmented generation with Bedrock Knowledge Bases, Titan embeddings, and OpenSearch Serverless",
      "Provisioned a Whisper-based AI transcription platform on ECS Fargate with WebSocket-aware ALB and Cloud Map",
      "Led a Migration Acceleration Program (MAP) assessment for 50+ workloads with wave sequencing and right-sizing",
      "Modernised hybrid storage with AWS S3 File Gateway and DataSync",
    ],
  },
  {
    id: "auspost",
    company: "Australia Post", logo: AusPost, color: "#E31E24",
    position: "Senior Platform Engineer",
    department: "Cloud Platform · Governance",
    start: "2026-01", end: null, duration: "Jan 2026 – Present",
    description: "Leading cloud platform modernisation and multi-cloud governance — strengthening the enterprise security posture and building resilient, automated platforms across AWS and hybrid cloud.",
    technologies: ["AWS Organizations", "SCPs", "Service Catalog", "AWS Backup", "IAM", "Terraform", "Multi-cloud", "Hybrid Cloud"],
    domains: ["cloud", "platform", "devsecops", "devops", "leadership"],
    highlights: [
      "Implementing allow-list Service Control Policies across the AWS organisation, an AWS Service Catalog offering, and the new-service onboarding process",
      "Delivering enterprise backup and recovery with AWS Backup — tag-based plans for short- and long-term retention",
      "Defining multi-cloud and hybrid governance: guardrails, policies, and architectural standards",
      "Mentoring platform engineers through workshops and design reviews, fostering an automation-first culture",
      "Translating strategic goals into executable platform roadmaps with architecture, product, and engineering leadership",
    ],
  },
];

export const CURRENT_ROLE = EXPERIENCES[EXPERIENCES.length - 1];

const toMonths = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
};

const nowYm = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

/** Tenure in whole months, using today's date for the current role. */
export const tenureMonths = (exp) => Math.max(1, toMonths(exp.end || nowYm()) - toMonths(exp.start));

export const formatTenure = (months) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr${y > 1 ? "s" : ""}`;
  return `${y} yr${y > 1 ? "s" : ""} ${m} mo`;
};

export const careerStartYear = Number(EXPERIENCES[0].start.slice(0, 4));
export const yearsOfExperience = () => new Date().getFullYear() - careerStartYear;

/*
  Skills, in priority order (category order = display order).
  `level` is a self-assessed 0–100 used for bars and the radar; `domain` picks the radar axis.
  `experience` / `projects` are optional.
*/
export const SKILL_CATEGORIES = [
  { id: "cloud", title: "Cloud Platforms", icon: "fas fa-cloud", skills: [
    { name: "AWS", level: 95, domain: "Cloud", experience: "Primary cloud", featured: true, tags: ["Organizations & SCPs", "ECS Fargate", "Lambda", "API Gateway", "KMS", "Service Catalog", "AWS Backup"] },
    { name: "GCP", level: 82, domain: "Cloud", experience: "Landing zones & GKE", tags: ["GKE", "IAM", "Landing Zones", "CSPM"] },
    { name: "Azure", level: 72, domain: "Cloud", experience: "Multi-cloud & hybrid", tags: ["Multi-cloud", "Hybrid"] },
  ]},
  { id: "platform", title: "Platform Engineering", icon: "fas fa-layer-group", skills: [
    { name: "Terraform", level: 93, domain: "IaC", featured: true, tags: ["Terraform Cloud", "Sentinel", "Modules", "Remote State"] },
    { name: "Kubernetes", level: 88, domain: "Platform", featured: true, tags: ["EKS", "GKE", "Helm", "Istio", "RBAC"] },
    { name: "OpenShift", level: 85, domain: "Platform", tags: ["Enterprise", "Operators", "Network Policies"] },
    { name: "Docker & ECS Fargate", level: 88, domain: "Platform", tags: ["Containers", "Cloud Map", "ALB"] },
    { name: "CloudFormation / CDK / Pulumi", level: 78, domain: "IaC", tags: ["CloudFormation", "CDK", "Pulumi"] },
  ]},
  { id: "devops", title: "DevOps & CI/CD", icon: "fas fa-infinity", skills: [
    { name: "CI/CD Pipelines", level: 93, domain: "DevOps", featured: true, tags: ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI"] },
    { name: "GitOps & Delivery", level: 82, domain: "DevOps", tags: ["ArgoCD", "Helm", "Progressive Delivery"] },
    { name: "Secrets Management", level: 84, domain: "DevOps", tags: ["Vault", "Secrets Manager", "KMS"] },
  ]},
  { id: "devsecops", title: "DevSecOps & Security", icon: "fas fa-shield-halved", skills: [
    { name: "Software Supply Chain Security", level: 90, domain: "DevSecOps", featured: true, tags: ["SAST", "DAST", "SCA", "SBOM", "Image Signing", "Snyk", "Trivy"] },
    { name: "Policy as Code", level: 88, domain: "DevSecOps", tags: ["OPA Gatekeeper", "Checkov", "Sentinel"] },
    { name: "Zero-Trust IAM", level: 87, domain: "DevSecOps", tags: ["Least Privilege", "ABAC/RBAC", "OIDC", "JWT", "SigV4"] },
    { name: "CSPM & Compliance", level: 85, domain: "DevSecOps", tags: ["CIS", "ISO 27001", "SOC2", "NIST", "PCI-DSS", "GDPR"] },
  ]},
  { id: "ai", title: "AI Platforms", icon: "fas fa-robot", skills: [
    { name: "AWS Bedrock", level: 82, domain: "AI Platforms", tags: ["Agents", "AgentCore", "Guardrails", "Knowledge Bases"] },
    { name: "RAG Architecture", level: 78, domain: "AI Platforms", tags: ["OpenSearch Serverless", "Titan Embeddings", "Groq"] },
  ]},
  { id: "observability", title: "Observability", icon: "fas fa-chart-line", skills: [
    { name: "Metrics & Tracing", level: 85, domain: "Observability", tags: ["Prometheus", "Grafana", "OpenTelemetry", "X-Ray"] },
    { name: "Logging & APM", level: 82, domain: "Observability", tags: ["Dynatrace", "Splunk", "ELK", "Datadog", "CloudWatch"] },
  ]},
  { id: "scripting", title: "Scripting & Development", icon: "fas fa-code", skills: [
    { name: "Python", level: 82, domain: "Scripting", tags: ["Automation", "Lambda"] },
    { name: "Bash", level: 88, domain: "Scripting", tags: ["Automation", "Tooling"] },
    { name: "Go", level: 70, domain: "Scripting", tags: ["CLI", "Tooling"] },
    { name: "APIs", level: 80, domain: "Scripting", tags: ["REST", "GraphQL", "gRPC"] },
  ]},
];

export const ALL_SKILLS = SKILL_CATEGORIES.flatMap((c) => c.skills.map((s) => ({ ...s, category: c.title })));

/* Radar axes, in clockwise order. Score = mean level of the skills in that domain. */
export const RADAR_DOMAINS = ["Cloud", "Platform", "IaC", "DevOps", "DevSecOps", "Observability", "AI Platforms", "Scripting"];

export const radarData = () =>
  RADAR_DOMAINS.map((domain) => {
    const skills = ALL_SKILLS.filter((s) => s.domain === domain);
    const score = skills.length ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0;
    return { domain, score, skills };
  });

export const levelLabel = (level) =>
  level >= 90 ? "Expert" : level >= 80 ? "Advanced" : level >= 70 ? "Proficient" : "Familiar";

export const CERTIFICATIONS = [
  { name: "AWS Certified DevOps Engineer – Professional", issuer: "Amazon Web Services", year: "2022", icon: "fab fa-aws", status: "Active" },
  { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", year: "2022", icon: "fab fa-aws", status: "Active" },
  { name: "HashiCorp Certified Terraform Associate", issuer: "HashiCorp", year: "2021", icon: "fas fa-layer-group", status: "Active" },
  { name: "Certified Kubernetes Application Developer (CKAD)", issuer: "Cloud Native Computing Foundation", year: "2022", icon: "fas fa-dharmachakra", status: "Active" },
  { name: "Certified Jenkins Engineer", issuer: "CloudBees", year: "2022", icon: "fas fa-cogs", status: "Active" },
  { name: "Scrum Master", issuer: "ISQI", year: "2018", icon: "fas fa-users-cog", status: "Active" },
  { name: "Google Cloud Professional Cloud Architect", issuer: "Google Cloud", year: "2019", icon: "fab fa-google", status: "Expired" },
];

export const PAGES = [
  { icon: "fas fa-house", label: "Home", to: "/" },
  { icon: "fas fa-user-circle", label: "About", to: "/about" },
  { icon: "fas fa-route", label: "Experience", to: "/experience" },
  { icon: "fas fa-users-cog", label: "Leadership", to: "/leadership" },
  { icon: "fas fa-rocket", label: "Projects", to: "/projects" },
  { icon: "fas fa-code", label: "Skills", to: "/skills" },
  { icon: "fas fa-compass", label: "Interests", to: "/interests" },
  { icon: "fas fa-envelope", label: "Contact", to: "/contact" },
];
