import React from "react";
import PageHeader from "../components/PageHeader";
import GitHubStats from "../components/github/GitHubStats";
import PortfolioSection from "../components/modern/PortfolioSection";

const ProjectsPage = () => (
  <div>
    <PageHeader
      kicker="~/projects"
      title="Projects & Open Source"
      subtitle="Live data from GitHub: activity, languages and repositories across cloud infrastructure, automation and DevOps tooling."
    />
    <div className="container" style={{ marginBottom: "var(--space-xl)" }}>
      <GitHubStats />
    </div>
    <PortfolioSection />
  </div>
);

export default ProjectsPage;
