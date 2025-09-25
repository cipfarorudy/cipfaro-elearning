#!/usr/bin/env node

/**
 * Script de scan de sécurité complet pour CIPFARO V2
 * Exécute tous les contrôles de sécurité requis
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const COLORS = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
};

class SecurityScanner {
  private results = {
    eslint: { passed: false, issues: 0 },
    audit: { passed: false, vulnerabilities: 0 },
    deps: { passed: false, outdated: 0 },
    overall: false,
  };

  constructor() {
    console.log(
      `${COLORS.BOLD}${COLORS.BLUE}🔒 CIPFARO V2 - Scan de Sécurité${COLORS.RESET}\n`
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

  private exec(command: string): string {
    try {
      return execSync(command, { encoding: "utf8", stdio: "pipe" });
    } catch (error: any) {
      throw new Error(
        `Command failed: ${command}\n${error.stdout || error.stderr}`
      );
    }
  }

  async scanESLint() {
    this.log("Scan ESLint Security...", "info");

    try {
      const output = this.exec("npx eslint . --ext .ts,.tsx --format json");
      const results = JSON.parse(output);

      let totalIssues = 0;
      let securityIssues = 0;

      results.forEach((file: any) => {
        totalIssues += file.messages.length;
        securityIssues += file.messages.filter(
          (msg: any) => msg.ruleId && msg.ruleId.startsWith("security/")
        ).length;
      });

      if (totalIssues === 0) {
        this.log("ESLint: Aucun problème détecté", "success");
        this.results.eslint = { passed: true, issues: 0 };
      } else {
        this.log(
          `ESLint: ${totalIssues} problèmes détectés (${securityIssues} sécurité)`,
          "warning"
        );
        this.results.eslint = {
          passed: securityIssues === 0,
          issues: totalIssues,
        };
      }
    } catch (error: any) {
      this.log(`ESLint Error: ${error.message}`, "error");
      this.results.eslint = { passed: false, issues: -1 };
    }
  }

  async scanAudit() {
    this.log("Audit des dépendances...", "info");

    try {
      // Scan avec pnpm audit
      const output = this.exec("pnpm audit --json");
      const auditResults = JSON.parse(output);

      const vulnerabilities = auditResults.metadata?.vulnerabilities || {};
      const totalVulns = Object.values(vulnerabilities).reduce(
        (sum: number, count: any) => sum + count,
        0
      );

      if (totalVulns === 0) {
        this.log("Audit: Aucune vulnérabilité détectée", "success");
        this.results.audit = { passed: true, vulnerabilities: 0 };
      } else {
        this.log(`Audit: ${totalVulns} vulnérabilités détectées`, "warning");
        this.results.audit = { passed: false, vulnerabilities: totalVulns };

        // Afficher les détails
        console.log(JSON.stringify(vulnerabilities, null, 2));
      }
    } catch (error: any) {
      // pnpm audit peut retourner un code d'erreur si des vulnérabilités sont trouvées
      if (error.message.includes("vulnerabilities")) {
        this.log("Audit: Vulnérabilités détectées dans la sortie", "warning");
        this.results.audit = { passed: false, vulnerabilities: -1 };
      } else {
        this.log(`Audit Error: ${error.message}`, "error");
        this.results.audit = { passed: false, vulnerabilities: -1 };
      }
    }
  }

  async scanOutdatedDeps() {
    this.log("Vérification des dépendances obsolètes...", "info");

    try {
      const output = this.exec("pnpm outdated --format json");
      const outdated = JSON.parse(output);

      const outdatedCount = Object.keys(outdated).length;

      if (outdatedCount === 0) {
        this.log("Dépendances: Toutes à jour", "success");
        this.results.deps = { passed: true, outdated: 0 };
      } else {
        this.log(`Dépendances: ${outdatedCount} packages obsolètes`, "warning");
        this.results.deps = { passed: false, outdated: outdatedCount };
      }
    } catch (error: any) {
      // pnpm outdated retourne une erreur s'il y a des packages obsolètes
      this.log("Dépendances: Certains packages sont obsolètes", "warning");
      this.results.deps = { passed: false, outdated: -1 };
    }
  }

  generateReport() {
    this.log("\n📊 Rapport de Sécurité", "info");
    console.log("─".repeat(50));

    // ESLint
    const eslintStatus = this.results.eslint.passed ? "✅" : "❌";
    console.log(
      `${eslintStatus} ESLint Security: ${this.results.eslint.issues} problèmes`
    );

    // Audit
    const auditStatus = this.results.audit.passed ? "✅" : "❌";
    console.log(
      `${auditStatus} Audit Vulnérabilités: ${this.results.audit.vulnerabilities}`
    );

    // Dépendances
    const depsStatus = this.results.deps.passed ? "✅" : "❌";
    console.log(
      `${depsStatus} Dépendances Obsolètes: ${this.results.deps.outdated}`
    );

    console.log("─".repeat(50));

    // Statut global
    this.results.overall =
      this.results.eslint.passed &&
      this.results.audit.passed &&
      this.results.deps.passed;

    if (this.results.overall) {
      this.log("🎉 Scan de sécurité: SUCCÈS", "success");
    } else {
      this.log("⚠️ Scan de sécurité: PROBLÈMES DÉTECTÉS", "warning");
    }

    // Sauvegarder le rapport
    this.saveReport();

    return this.results.overall;
  }

  private saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results,
      recommendations: this.generateRecommendations(),
    };

    fs.writeFileSync("security-report.json", JSON.stringify(report, null, 2));
    this.log("Rapport sauvegardé: security-report.json", "info");
  }

  private generateRecommendations() {
    const recommendations = [];

    if (!this.results.eslint.passed) {
      recommendations.push(
        "Corriger les problèmes de sécurité détectés par ESLint"
      );
    }

    if (!this.results.audit.passed) {
      recommendations.push(
        "Mettre à jour les dépendances vulnérables avec: pnpm audit fix"
      );
    }

    if (!this.results.deps.passed) {
      recommendations.push(
        "Mettre à jour les dépendances obsolètes avec: pnpm update"
      );
    }

    return recommendations;
  }

  async run() {
    try {
      await this.scanESLint();
      await this.scanAudit();
      await this.scanOutdatedDeps();

      const success = this.generateReport();
      process.exit(success ? 0 : 1);
    } catch (error: any) {
      this.log(`Erreur fatale: ${error.message}`, "error");
      process.exit(1);
    }
  }
}

// Exécution du scanner
if (import.meta.url === `file://${process.argv[1]}`) {
  const scanner = new SecurityScanner();
  scanner.run();
}
