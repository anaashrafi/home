import { vi, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  // Keep the smoke test offline: GitHub calls fail fast and fall back to their error states.
  global.fetch = vi.fn(() => Promise.reject(new Error("offline")));
});

afterEach(async () => {
  cleanup();
  // Let any already-scheduled React work flush before jsdom is torn down.
  await new Promise((r) => setTimeout(r, 0));
});

it("renders the home page without crashing", async () => {
  render(<App />);
  expect(await screen.findByRole("heading", { level: 1 }, { timeout: 4000 })).toBeInTheDocument();
});
