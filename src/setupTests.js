// jsdom lacks a few browser APIs the app relies on; provide minimal stand-ins for tests.
import "@testing-library/jest-dom";

if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  };
}

// jsdom defines scrollTo but throws "Not implemented".
window.scrollTo = () => {};
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || (() => {});

if (typeof performance.getEntriesByType !== "function") {
  performance.getEntriesByType = () => [];
}
