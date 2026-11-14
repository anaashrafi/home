import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="state-block" style={{ minHeight: "100vh" }}>
        <i className="fas fa-triangle-exclamation" aria-hidden="true"></i>
        <h1 style={{ fontSize: "var(--fs-xl)" }}>Something went wrong</h1>
        <p>We're sorry — please try refreshing the page.</p>
        <div className="cluster" style={{ justifyContent: "center" }}>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            <i className="fas fa-arrows-rotate" aria-hidden="true"></i> Refresh Page
          </button>
          <button className="btn btn-secondary" onClick={() => { window.location.href = "/"; }}>
            <i className="fas fa-house" aria-hidden="true"></i> Go Home
          </button>
        </div>
        {import.meta.env.DEV && (
          <details style={{ textAlign: "left", marginTop: "var(--space-md)" }}>
            <summary>Show error details</summary>
            <pre style={{ fontSize: "var(--fs-xs)", whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              {"\n"}
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        )}
      </div>
    );
  }
}

export default ErrorBoundary;
