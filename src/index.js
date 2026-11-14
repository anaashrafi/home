import React from "react";
import { createRoot } from "react-dom/client";
import "./icons";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import ErrorBoundary from "./components/ErrorBoundary";
import { initializeGA } from "./hooks/useAnalytics";
import { googleAnalyticsMeasurementId } from "./editable-stuff/configurations.json";

// Initialize Google Analytics
if (googleAnalyticsMeasurementId) {
  initializeGA(googleAnalyticsMeasurementId);
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Enable service worker for PWA capabilities
serviceWorker.register();