import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";

const Leadership = React.lazy(() => import("../components/home/Leadership"));

const LeadershipPage = () => (
  <div>
    <PageHeader kicker="~/leadership" title="Leadership & Management" subtitle="15+ years of leading high-performing teams and driving successful project outcomes across diverse industries" />
    <Suspense fallback={<LoadingSpinner />}>
      <Leadership />
    </Suspense>
  </div>
);

export default LeadershipPage;
