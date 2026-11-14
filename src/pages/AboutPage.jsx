import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import AboutSection from "../components/modern/AboutSection";

const AboutPage = () => (
  <div>
    <PageHeader kicker="~/about" title="About Me" subtitle="Get to know more about my background, skills, and passion for technology" />
    <Suspense fallback={<LoadingSpinner />}>
      <AboutSection />
    </Suspense>
  </div>
);

export default AboutPage;
