// Version développement avec données simulées pour fonctionner sans PostgreSQL

interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "FORMATEUR" | "STAGIAIRE" | "OPCO";
  isActive: boolean;
  createdAt: Date;
}

interface MockSession {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  enrollments: any[];
}

interface MockEnrollment {
  id: string;
  userId: string;
  sessionId: string;
  status: string;
  enrolledAt: Date;
}

interface MockModule {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  isActive: boolean;
}

// Données de test
const mockUsers: MockUser[] = [
  {
    id: "admin-1",
    email: "admin@cipfaro.fr",
    password: "$2b$12$P3Cx9l2rBa.gc5t0mpy4GOMA90fbckbN.Xw7OVZd1bqg13tPnxTwi", // admin123
    firstName: "Admin",
    lastName: "CIPFARO",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "formateur-1",
    email: "formateur@cipfaro.fr",
    password: "$2b$12$dzoXHDi0ZqT4Rd82RH220Oz4GQmF7.LKykj9xkWswHwMQhMFa1AHa", // formateur123
    firstName: "Marie",
    lastName: "MARTIN",
    role: "FORMATEUR",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "stagiaire-1",
    email: "stagiaire@cipfaro.fr",
    password: "$2b$12$5gAfCSS7phJAm7Jonq3fwedkI.SVFLgYMDSysAqa5aYv.BPso2qlG", // stagiaire123
    firstName: "Pierre",
    lastName: "DUPONT",
    role: "STAGIAIRE",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "opco-1",
    email: "opco@cipfaro.fr",
    password: "$2b$12$F3K8nR7vWx1zA4bM.9EOL.2Qs6tY8hJ5gP1uC7rN9dE3oI.4FvB", // opco123
    firstName: "Sophie",
    lastName: "LEGRAND",
    role: "OPCO",
    isActive: true,
    createdAt: new Date(),
  },
];

const mockSessions: MockSession[] = [
  {
    id: "session-1",
    title: "Formation JavaScript Avancé",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    capacity: 20,
    enrollments: [],
  },
  {
    id: "session-2",
    title: "Formation React & Next.js",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    capacity: 15,
    enrollments: [],
  },
];

const mockModules: MockModule[] = [
  {
    id: "module-1",
    title: "Introduction au TypeScript",
    description: "Apprenez les bases du TypeScript",
    createdBy: "formateur-1",
    isActive: true,
  },
  {
    id: "module-2",
    title: "API REST avec Express",
    description: "Développement d'APIs modernes",
    createdBy: "formateur-1",
    isActive: true,
  },
];

const mockEnrollments: MockEnrollment[] = [
  {
    id: "enrollment-1",
    userId: "stagiaire-1",
    sessionId: "session-1",
    status: "ENROLLED",
    enrolledAt: new Date(),
  },
];

// Mock du client Prisma pour le développement
export const mockPrisma = {
  user: {
    findUnique: async (params: any) => {
      console.log("🔍 Mock Prisma: user.findUnique", params);
      if (params.where.email) {
        return mockUsers.find((u) => u.email === params.where.email) || null;
      }
      if (params.where.id) {
        return mockUsers.find((u) => u.id === params.where.id) || null;
      }
      return null;
    },
    findMany: async (params?: any) => {
      console.log("🔍 Mock Prisma: user.findMany", params);
      return mockUsers;
    },
    count: async () => {
      console.log("🔍 Mock Prisma: user.count");
      return mockUsers.length;
    },
    create: async (params: any) => {
      console.log("🔍 Mock Prisma: user.create", params);
      const newUser = {
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        ...params.data,
      };
      mockUsers.push(newUser);
      return newUser;
    },
  },
  session: {
    findMany: async (params?: any) => {
      console.log("🔍 Mock Prisma: session.findMany", params);
      return mockSessions.map((s) => ({
        ...s,
        _count: {
          enrollments: mockEnrollments.filter((e) => e.sessionId === s.id)
            .length,
        },
      }));
    },
    count: async () => {
      console.log("🔍 Mock Prisma: session.count");
      return mockSessions.length;
    },
  },
  enrollment: {
    findMany: async (params?: any) => {
      console.log("🔍 Mock Prisma: enrollment.findMany", params);
      return mockEnrollments.map((e) => ({
        ...e,
        user: mockUsers.find((u) => u.id === e.userId),
        session: mockSessions.find((s) => s.id === e.sessionId),
      }));
    },
    count: async () => {
      console.log("🔍 Mock Prisma: enrollment.count");
      return mockEnrollments.length;
    },
  },
  module: {
    findMany: async (params?: any) => {
      console.log("🔍 Mock Prisma: module.findMany", params);
      return mockModules.map((module) => ({
        ...module,
        _count: {
          enrollments: Math.floor(Math.random() * 20) + 1, // Simule des inscriptions
        },
      }));
    },
    count: async () => {
      console.log("🔍 Mock Prisma: module.count");
      return mockModules.length;
    },
  },
  auditLog: {
    findMany: async (params?: any) => {
      console.log("🔍 Mock Prisma: auditLog.findMany", params);
      return [
        {
          id: "audit-1",
          userId: "admin-1",
          event: "LOGIN_SUCCESS",
          details: { ip: "127.0.0.1" },
          createdAt: new Date(Date.now() - 60000),
          user: mockUsers[0],
        },
        {
          id: "audit-2",
          userId: "stagiaire-1",
          event: "MODULE_ACCESS",
          details: { moduleId: "module-1" },
          createdAt: new Date(Date.now() - 30000),
          user: mockUsers[2],
        },
      ];
    },
    create: async (params: any) => {
      console.log("🔍 Mock Prisma: auditLog.create", params);
      return {
        id: `audit-${Date.now()}`,
        createdAt: new Date(),
        ...params.data,
      };
    },
  },
  refreshToken: {
    create: async (params: any) => {
      console.log("🔍 Mock Prisma: refreshToken.create", params);
      return {
        id: `refresh-${Date.now()}`,
        ...params.data,
        createdAt: new Date(),
      };
    },
    findUnique: async (params: any) => {
      console.log("🔍 Mock Prisma: refreshToken.findUnique", params);
      return null; // Pas de tokens en mémoire pour la démo
    },
    delete: async (params: any) => {
      console.log("🔍 Mock Prisma: refreshToken.delete", params);
      return { id: params.where.id };
    },
  },
  scormData: {
    findMany: async () => {
      console.log("🔍 Mock Prisma: scormData.findMany");
      return [];
    },
  },
  xapiStatement: {
    findMany: async () => {
      console.log("🔍 Mock Prisma: xapiStatement.findMany");
      return [];
    },
  },
  // Ajout de la méthode $transaction pour les statistiques
  $transaction: async (queries: any[]) => {
    console.log("🔍 Mock Prisma: $transaction", queries.length, "queries");
    // Simule les résultats des transactions
    const results = [];
    for (const query of queries) {
      if (query.toString().includes("user")) {
        results.push(mockUsers.length);
      } else if (query.toString().includes("session")) {
        results.push(mockSessions.length);
      } else if (query.toString().includes("module")) {
        results.push(mockModules.length);
      } else if (query.toString().includes("enrollment")) {
        results.push(mockEnrollments.length);
      } else {
        results.push(0);
      }
    }
    return results;
  },
};

// Export du client de développement
export const prisma = mockPrisma as any;
