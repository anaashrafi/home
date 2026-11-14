import React, { Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PageHeader from "../components/PageHeader";
import ContactSection from "../components/modern/ContactSection";

const ContactPage = () => (
  <div>
    <PageHeader kicker="~/contact" title="Let's Connect" subtitle="Hiring, consulting, a gnarly platform problem, or just want to talk Kubernetes? Pick whichever channel suits you." />
    <Suspense fallback={<LoadingSpinner />}>
      <ContactSection />
    </Suspense>
  </div>
);

export default ContactPage;
