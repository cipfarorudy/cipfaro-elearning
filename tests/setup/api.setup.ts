import { jest } from "@jest/globals";

// Type pour le mock global
declare global {
  var mockPrismaClient: any;
}

// Mock Prisma Client pour les tests API
const mockPrismaClient = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  role: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  session: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  enrollment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  module: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  scormCmi: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    upsert: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Mock des variables d'environnement pour les tests
Object.defineProperty(process.env, "NODE_ENV", {
  value: "test",
  writable: true,
});
Object.defineProperty(process.env, "JWT_SECRET", {
  value: "test-jwt-secret",
  writable: true,
});
Object.defineProperty(process.env, "API_PORT", {
  value: "10001",
  writable: true,
});

// Mock du client Prisma
jest.unstable_mockModule("@prisma/client", () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

// Export du mock pour utilisation dans les tests
global.mockPrismaClient = mockPrismaClient;

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
