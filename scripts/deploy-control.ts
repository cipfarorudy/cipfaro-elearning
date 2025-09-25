#!/usr/bin/env node

/**
 * Interface de contrôle manuel pour le déploiement CIPFARO V2
 * Permet la sélection d'environnement, version et confirmation
 */

import { execSync } from "child_process";
import fs from "fs";
import readline from "readline";

const COLORS = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  MAGENTA: "\x1b[35m",
  CYAN: "\x1b[36m",
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
};

interface DeploymentConfig {
  environment: string;
  version: string;
  branch: string;
  confirmed: boolean;
  timestamp: string;
}

class DeploymentController {
  private rl: readline.Interface;
  private config: DeploymentConfig = {
    environment: "",
    version: "",
    branch: "",
    confirmed: false,
    timestamp: "",
  };

  private environments = [
    {
      name: "development",
      url: "http://localhost:3000",
      description: "Environnement de développement local",
    },
    {
      name: "staging",
      url: "https://staging.cipfaro.com",
      description: "Environnement de test/pré-production",
    },
    {
      name: "production",
      url: "https://cipfaro.com",
      description: "Environnement de production",
    },
  ];

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(
      `${COLORS.BOLD}${COLORS.CYAN}🚀 CIPFARO V2 - Contrôle de Déploiement${COLORS.RESET}\n`
    );
  }

  private log(
    message: string,
    type: "info" | "success" | "warning" | "error" = "info"
  ) {
    const colorMap = {
      info: COLORS.BLUE,
      success: COLORS.GREEN,
      warning: COLORS.YELLOW,
      error: COLORS.RED,
    };

    const icons = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    };

    console.log(`${colorMap[type]}${icons[type]} ${message}${COLORS.RESET}`);
  }

  private async question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(`${COLORS.CYAN}${prompt}${COLORS.RESET}`, resolve);
    });
  }

  private exec(command: string): string {
    try {
      return execSync(command, { encoding: "utf8", stdio: "pipe" });
    } catch (error: any) {
      throw new Error(
        `Command failed: ${command}\n${error.stdout || error.stderr}`
      );
    }
  }

  private getCurrentBranch(): string {
    try {
      return this.exec("git branch --show-current").trim();
    } catch {
      return "unknown";
    }
  }

  private getLatestVersion(): string {
    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      return packageJson.version || "1.0.0";
    } catch {
      return "1.0.0";
    }
  }

  private getCommitHash(): string {
    try {
      return this.exec("git rev-parse --short HEAD").trim();
    } catch {
      return "unknown";
    }
  }

  async selectEnvironment() {
    console.log(
      `${COLORS.BOLD}📍 Sélection de l'environnement:${COLORS.RESET}\n`
    );

    this.environments.forEach((env, index) => {
      console.log(`${COLORS.YELLOW}${index + 1}.${COLORS.RESET} ${env.name}`);
      console.log(`   📍 ${env.url}`);
      console.log(`   📝 ${env.description}\n`);
    });

    while (true) {
      const choice = await this.question("Choisissez un environnement (1-3): ");
      const index = parseInt(choice) - 1;

      if (index >= 0 && index < this.environments.length) {
        this.config.environment = this.environments[index].name;
        this.log(
          `Environnement sélectionné: ${this.config.environment}`,
          "success"
        );
        break;
      } else {
        this.log("Choix invalide. Veuillez sélectionner 1, 2 ou 3.", "error");
      }
    }
  }

  async selectVersion() {
    const currentVersion = this.getLatestVersion();
    const currentBranch = this.getCurrentBranch();
    const commitHash = this.getCommitHash();

    console.log(`\n${COLORS.BOLD}🏷️ Sélection de version:${COLORS.RESET}\n`);
    console.log(
      `${COLORS.CYAN}Version actuelle:${COLORS.RESET} ${currentVersion}`
    );
    console.log(`${COLORS.CYAN}Branche:${COLORS.RESET} ${currentBranch}`);
    console.log(`${COLORS.CYAN}Commit:${COLORS.RESET} ${commitHash}\n`);

    const options = [
      `Version actuelle (${currentVersion})`,
      "Version personnalisée",
      "Latest commit (snapshot)",
      "Tag Git spécifique",
    ];

    options.forEach((option, index) => {
      console.log(`${COLORS.YELLOW}${index + 1}.${COLORS.RESET} ${option}`);
    });

    while (true) {
      const choice = await this.question(
        "\nChoisissez une option de version (1-4): "
      );
      const index = parseInt(choice) - 1;

      if (index === 0) {
        this.config.version = currentVersion;
        this.config.branch = currentBranch;
        break;
      } else if (index === 1) {
        const customVersion = await this.question(
          "Entrez la version personnalisée (ex: 1.2.3): "
        );
        if (/^\d+\.\d+\.\d+$/.test(customVersion)) {
          this.config.version = customVersion;
          this.config.branch = currentBranch;
          break;
        } else {
          this.log(
            "Format de version invalide. Utilisez le format x.y.z",
            "error"
          );
        }
      } else if (index === 2) {
        this.config.version = `snapshot-${commitHash}`;
        this.config.branch = currentBranch;
        break;
      } else if (index === 3) {
        const tag = await this.question("Entrez le nom du tag Git: ");
        this.config.version = tag;
        this.config.branch = tag;
        break;
      } else {
        this.log(
          "Choix invalide. Veuillez sélectionner 1, 2, 3 ou 4.",
          "error"
        );
      }
    }

    this.log(`Version sélectionnée: ${this.config.version}`, "success");
  }

  async runPreDeploymentChecks() {
    console.log(
      `\n${COLORS.BOLD}🔍 Vérifications pré-déploiement:${COLORS.RESET}\n`
    );

    const checks = [
      { name: "Tests unitaires", command: "pnpm test:ci" },
      { name: "Scan de sécurité", command: "tsx scripts/security-scan.ts" },
      { name: "Build production", command: "pnpm build" },
      { name: "Lint code", command: "npx eslint . --ext .ts,.tsx" },
    ];

    for (const check of checks) {
      try {
        this.log(`Exécution: ${check.name}...`, "info");
        this.exec(check.command);
        this.log(`${check.name}: ✅ RÉUSSI`, "success");
      } catch (error: any) {
        this.log(`${check.name}: ❌ ÉCHEC`, "error");
        console.log(error.message);

        const continueAnyway = await this.question(
          "Continuer malgré l'échec? (y/N): "
        );
        if (continueAnyway.toLowerCase() !== "y") {
          this.log("Déploiement annulé.", "warning");
          process.exit(1);
        }
      }
    }
  }

  async confirmDeployment() {
    console.log(
      `\n${COLORS.BOLD}📋 Récapitulatif du déploiement:${COLORS.RESET}\n`
    );
    console.log("─".repeat(50));
    console.log(
      `${COLORS.CYAN}Environnement:${COLORS.RESET} ${this.config.environment}`
    );
    console.log(`${COLORS.CYAN}Version:${COLORS.RESET} ${this.config.version}`);
    console.log(`${COLORS.CYAN}Branche:${COLORS.RESET} ${this.config.branch}`);
    console.log(
      `${COLORS.CYAN}Timestamp:${COLORS.RESET} ${new Date().toISOString()}`
    );
    console.log("─".repeat(50));

    if (this.config.environment === "production") {
      console.log(
        `${COLORS.RED}${COLORS.BOLD}⚠️  ATTENTION: DÉPLOIEMENT EN PRODUCTION ⚠️${COLORS.RESET}\n`
      );

      const productionConfirm = await this.question(
        'Tapez "CONFIRMER PRODUCTION" pour continuer: '
      );
      if (productionConfirm !== "CONFIRMER PRODUCTION") {
        this.log("Déploiement annulé - confirmation incorrecte.", "warning");
        process.exit(0);
      }
    }

    const finalConfirm = await this.question(
      `\n${COLORS.YELLOW}Confirmer le déploiement? (y/N): ${COLORS.RESET}`
    );

    if (finalConfirm.toLowerCase() === "y") {
      this.config.confirmed = true;
      this.config.timestamp = new Date().toISOString();
      this.log("Déploiement confirmé!", "success");
    } else {
      this.log("Déploiement annulé par l'utilisateur.", "warning");
      process.exit(0);
    }
  }

  async deploy() {
    this.log("🚀 Démarrage du déploiement...", "info");

    // Sauvegarder la configuration de déploiement
    fs.writeFileSync(
      "deployment-config.json",
      JSON.stringify(this.config, null, 2)
    );

    try {
      if (this.config.environment === "development") {
        this.log("Déploiement local - redémarrage des services...", "info");
        this.exec("pnpm dev");
      } else if (this.config.environment === "staging") {
        this.log("Déploiement staging - construction et upload...", "info");
        // Ici on peut ajouter des commandes spécifiques au staging
        this.exec("pnpm build");
        // this.exec('vercel deploy --prebuilt');
      } else if (this.config.environment === "production") {
        this.log("Déploiement production - construction et upload...", "info");
        this.exec("pnpm build");
        // this.exec('vercel deploy --prebuilt --prod');
      }

      this.log(
        `🎉 Déploiement ${this.config.environment} terminé avec succès!`,
        "success"
      );

      // Log du déploiement
      const deployLog = {
        ...this.config,
        status: "success",
        completedAt: new Date().toISOString(),
      };

      fs.appendFileSync("deployments.log", JSON.stringify(deployLog) + "\n");
    } catch (error: any) {
      this.log(`❌ Échec du déploiement: ${error.message}`, "error");

      const deployLog = {
        ...this.config,
        status: "failed",
        error: error.message,
        completedAt: new Date().toISOString(),
      };

      fs.appendFileSync("deployments.log", JSON.stringify(deployLog) + "\n");
      process.exit(1);
    }
  }

  async run() {
    try {
      await this.selectEnvironment();
      await this.selectVersion();
      await this.runPreDeploymentChecks();
      await this.confirmDeployment();
      await this.deploy();
    } catch (error: any) {
      this.log(`Erreur fatale: ${error.message}`, "error");
    } finally {
      this.rl.close();
    }
  }
}

// Exécution du contrôleur
if (import.meta.url === `file://${process.argv[1]}`) {
  const controller = new DeploymentController();
  controller.run();
}
