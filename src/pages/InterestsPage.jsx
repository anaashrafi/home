import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";

const Interests = React.lazy(() => import("../components/home/Interests"));

const InterestsPage = () => (
  <div>
    <PageHeader kicker="~/interests" title="Personal Interests" subtitle="What keeps me inspired and balanced after 15+ years in the fast-paced tech industry" />
    <Suspense fallback={<LoadingSpinner />}>
      <Interests />
    </Suspense>
  </div>
);

export default InterestsPage;
