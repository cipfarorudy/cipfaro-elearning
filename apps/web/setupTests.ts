import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Next font to avoid runtime issues in tests
vi.mock("next/font/google", () => ({
  Inter: () => ({ className: "inter", variable: "--font-inter" }),
}));

// Mock next/navigation if needed in future tests
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));
