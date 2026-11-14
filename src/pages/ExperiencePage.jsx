import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import { yearsOfExperience } from "../data/profile";

const CareerTimeline = React.lazy(() => import("../components/experience/CareerTimeline"));

const ExperiencePage = () => (
  <div>
    <PageHeader
      kicker="~/experience"
      title="Career Timeline"
      subtitle={`${yearsOfExperience()}+ years from test automation to platform engineering. Filter by domain or expand a role for the leadership story behind it.`}
    />
    <Suspense fallback={<LoadingSpinner />}>
      <CareerTimeline />
    </Suspense>
  </div>
);

export default ExperiencePage;
