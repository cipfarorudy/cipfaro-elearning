import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();
const mockBack = jest.fn();

jest.unstable_mockModule("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js image
jest.unstable_mockModule("next/image", () => ({
  default: ({ src, alt, ...props }: any) => {
    return `<img src="${src}" alt="${alt}" {...props} />`;
  },
}));

// Mock window.location
Object.defineProperty(window, "location", {
  value: {
    href: "http://localhost:3000",
    origin: "http://localhost:3000",
    pathname: "/",
    search: "",
    hash: "",
  },
  writable: true,
});

// Mock fetch global
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

// Mock console pour les tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is deprecated")
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
