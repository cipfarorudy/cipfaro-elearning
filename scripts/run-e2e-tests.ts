#!/usr/bin/env node

/**
 * Script de démarrage pour les tests E2E CIPFARO V2
 * Lance les services nécessaires et exécute les tests
 */

import { spawn, execSync } from "child_process";
import { createServer } from "net";

const PORTS = {
  API: 10001,
  WEB: 3000,
};

const COLORS = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
};

function log(message: string, color: string = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();

    server.listen(port, () => {
      server.close(() => resolve(false));
    });

    server.on("error", () => resolve(true));
  });
}

async function waitForService(port: number, name: string, maxAttempts = 30) {
  log(`🔍 Attente du service ${name} sur le port ${port}...`, COLORS.BLUE);

  for (let i = 0; i < maxAttempts; i++) {
    const inUse = await isPortInUse(port);
    if (inUse) {
      log(`✅ Service ${name} prêt sur le port ${port}`, COLORS.GREEN);
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.stdout.write(".");
  }

  log(`❌ Timeout: Service ${name} non disponible`, COLORS.RED);
  return false;
}

function startService(command: string, cwd: string, name: string) {
  log(`🚀 Démarrage du service ${name}...`, COLORS.BLUE);

  const serviceProcess = spawn("pnpm", ["dev"], {
    cwd,
    stdio: "pipe",
    shell: true,
    env: {
      ...process.env,
      API_PORT: PORTS.API.toString(),
      NEXT_PUBLIC_API_URL: `http://localhost:${PORTS.API}`,
    },
  });

  serviceProcess.stdout?.on("data", (data: Buffer) => {
    const output = data.toString();
    if (output.includes("Ready") || output.includes("listening")) {
      log(`✅ ${name} démarré`, COLORS.GREEN);
    }
  });

  serviceProcess.stderr?.on("data", (data: Buffer) => {
    const error = data.toString();
    if (!error.includes("ExperimentalWarning")) {
      log(`⚠️ ${name}: ${error}`, COLORS.YELLOW);
    }
  });

  return serviceProcess;
}

async function runTests(testFile?: string) {
  const args = ["playwright", "test"];

  if (testFile) {
    args.push(testFile);
  }

  args.push("--project=chromium", "--headed");

  log(`🧪 Exécution des tests E2E...`, COLORS.BLUE);

  try {
    execSync(args.join(" "), {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    log(`✅ Tests terminés avec succès`, COLORS.GREEN);
  } catch (error) {
    log(`❌ Échec des tests`, COLORS.RED);
    throw error;
  }
}

async function main() {
  const testFile = process.argv[2];

  log(`${COLORS.BOLD}🚀 CIPFARO V2 - Tests E2E${COLORS.RESET}`);
  log(`============================`);

  // Vérifier si les services sont déjà en cours d'exécution
  const apiRunning = await isPortInUse(PORTS.API);
  const webRunning = await isPortInUse(PORTS.WEB);

  const processes: ReturnType<typeof spawn>[] = [];

  try {
    // Démarrer l'API si nécessaire
    if (!apiRunning) {
      const apiProcess = startService("pnpm dev", "apps/api", "API");
      processes.push(apiProcess);
      await waitForService(PORTS.API, "API");
    } else {
      log(
        `✅ API déjà en cours d'exécution sur le port ${PORTS.API}`,
        COLORS.GREEN
      );
    }

    // Démarrer l'application web si nécessaire
    if (!webRunning) {
      const webProcess = startService("pnpm dev", "apps/web", "Web");
      processes.push(webProcess);
      await waitForService(PORTS.WEB, "Web");
    } else {
      log(
        `✅ Web déjà en cours d'exécution sur le port ${PORTS.WEB}`,
        COLORS.GREEN
      );
    }

    // Attendre un peu pour que les services se stabilisent
    log(`⏳ Stabilisation des services...`, COLORS.BLUE);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Exécuter les tests
    await runTests(testFile);
  } catch (error) {
    log(`❌ Erreur: ${error}`, COLORS.RED);
    process.exit(1);
  } finally {
    // Nettoyer les processus si nous les avons démarrés
    if (processes.length > 0) {
      log(`🧹 Nettoyage des processus...`, COLORS.YELLOW);
      processes.forEach((proc) => {
        try {
          proc.kill();
        } catch (e) {
          // Ignorer les erreurs de nettoyage
        }
      });
    }
  }
}

// Gestion propre des interruptions
process.on("SIGINT", () => {
  log(`\n👋 Arrêt demandé`, COLORS.YELLOW);
  process.exit(0);
});

process.on("SIGTERM", () => {
  log(`\n👋 Arrêt demandé`, COLORS.YELLOW);
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    log(`❌ Erreur fatale: ${error}`, COLORS.RED);
    process.exit(1);
  });
}
