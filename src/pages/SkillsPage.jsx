import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";

const Skills = React.lazy(() => import("../components/home/Skills"));

const SkillsPage = () => (
  <div>
    <PageHeader kicker="~/skills" title="Skills & Expertise" subtitle="Cloud first — AWS, then GCP and Azure — followed by platform engineering, DevOps and DevSecOps. Everything else builds on those four." />
    <Suspense fallback={<LoadingSpinner />}>
      <Skills />
    </Suspense>
  </div>
);

export default SkillsPage;
