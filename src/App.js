import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { showNavigationbar, showBlog } from "./editable-stuff/configurations.json";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/home/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import ScrollToTop from "./components/ScrollToTop";
import FloatingContactButton from "./components/FloatingContactButton";
import CommandPalette from "./components/CommandPalette";
import ShortcutsModal from "./components/ShortcutsModal";
import { useCommandPalette } from "./hooks/useCommandPalette";
import { useShortcutsHelp } from "./hooks/useShortcutsHelp";
import { useAnalytics } from "./hooks/useAnalytics";
import { useDocumentTitle } from "./hooks/useDocumentTitle";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const LeadershipPage = lazy(() => import("./pages/LeadershipPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const InterestsPage = lazy(() => import("./pages/InterestsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const Blog = showBlog ? lazy(() => import("./components/blog/Blog")) : null;
const BlogPost = showBlog ? lazy(() => import("./components/blog/BlogPost")) : null;

const PageWrapper = ({ children }) => <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>;

const NotFound = () => {
  useDocumentTitle('Page Not Found');

  return (
  <div className="state-block" style={{ minHeight: "80vh" }}>
    <img src="/logo_av.svg" alt="" style={{ width: 64, height: 64, borderRadius: 16, opacity: 0.6 }} />
    <h1 style={{ fontSize: "var(--fs-3xl)", color: "var(--color-text)" }}>404</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" className="btn btn-primary">
      <i className="fas fa-house" aria-hidden="true"></i> Go Home
    </a>
  </div>
  );
};

const AppRouter = () => {
  useAnalytics();
  const commandPalette = useCommandPalette();
  const shortcutsHelp = useShortcutsHelp();

  const withPage = (Component) => (
    <PageWrapper>
      <Suspense fallback={<LoadingSpinner />}>
        <Component />
      </Suspense>
    </PageWrapper>
  );

  return (
    <div className="App">
      <ScrollToTop />
      {showNavigationbar && <Navbar onOpenCommandPalette={commandPalette.open} />}
      <FloatingContactButton />
      <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} onOpenShortcuts={shortcutsHelp.open} />
      <ShortcutsModal isOpen={shortcutsHelp.isOpen} onClose={shortcutsHelp.close} />

      <Routes>
        <Route path="/" element={withPage(HomePage)} />
        <Route path="/about" element={withPage(AboutPage)} />
        <Route path="/experience" element={withPage(ExperiencePage)} />
        <Route path="/responsibilities" element={<Navigate to="/skills" replace />} />
        <Route path="/leadership" element={withPage(LeadershipPage)} />
        <Route path="/projects" element={withPage(ProjectsPage)} />
        <Route path="/skills" element={withPage(SkillsPage)} />
        <Route path="/interests" element={withPage(InterestsPage)} />
        <Route path="/contact" element={withPage(ContactPage)} />

        {showBlog && Blog && (
          <>
            <Route path="/blog" element={withPage(Blog)} />
            <Route path="/blog/:id" element={withPage(BlogPost)} />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AppRouter />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
