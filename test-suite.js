#!/usr/bin/env node

/**
 * 🧪 Script de Test Automatisé - CIPFARO E-Learning Enhanced
 *
 * Ce script vérifie que toutes les nouvelles fonctionnalités marchent correctement :
 * - Authentification JWT
 * - Dashboard API par rôle
 * - Validation des données
 * - Performance des endpoints
 */

const https = require("http");
const { performance } = require("perf_hooks");

// Configuration
const API_BASE = "http://localhost:5000";
const WEB_BASE = "http://localhost:3000";

// Comptes de test
const TEST_ACCOUNTS = {
  admin: { email: "admin@cipfaro.fr", password: "admin123" },
  formateur: { email: "formateur@cipfaro.fr", password: "formateur123" },
  stagiaire: { email: "stagiaire@cipfaro.fr", password: "stagiaire123" },
  opco: { email: "opco@cipfaro.fr", password: "opco123" },
};

// Couleurs pour la console
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function error(message) {
  log(`❌ ${message}`, "red");
}

function info(message) {
  log(`ℹ️  ${message}`, "blue");
}

function warning(message) {
  log(`⚠️  ${message}`, "yellow");
}

// Utilitaire pour faire des requêtes HTTP
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: parsed,
            headers: res.headers,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data, headers: res.headers });
        }
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Tests d'authentification
async function testAuthentication() {
  log("\n🔐 Test du Système d'Authentification JWT", "bold");

  let totalTests = 0;
  let passedTests = 0;

  for (const [role, credentials] of Object.entries(TEST_ACCOUNTS)) {
    try {
      totalTests++;
      info(`Testing login for ${role}...`);

      const startTime = performance.now();
      const response = await makeRequest(`${API_BASE}/auth/v2/login`, {
        method: "POST",
        body: credentials,
      });
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (response.status === 200 && response.data.success) {
        success(`${role} login successful (${duration}ms)`);

        // Vérifier la structure de la réponse
        if (
          response.data.tokens &&
          response.data.tokens.accessToken &&
          response.data.user
        ) {
          success(`${role} - Tokens et user data présents`);
          passedTests++;

          // Test du profil utilisateur
          totalTests++;
          const profileResponse = await makeRequest(`${API_BASE}/auth/v2/me`, {
            headers: {
              Authorization: `Bearer ${response.data.tokens.accessToken}`,
            },
          });

          if (profileResponse.status === 200) {
            success(`${role} - Profile API accessible`);
            passedTests++;
          } else {
            error(`${role} - Profile API failed (${profileResponse.status})`);
          }
        } else {
          error(`${role} - Structure de réponse invalide`);
        }
      } else {
        error(
          `${role} login failed (${response.status}): ${
            response.data.error || "Unknown error"
          }`
        );
      }
    } catch (err) {
      error(`${role} login error: ${err.message}`);
    }
  }

  log(
    `\n📊 Authentification: ${passedTests}/${totalTests} tests réussis`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
}

// Tests du dashboard
async function testDashboard() {
  log("\n📊 Test des API Dashboard par Rôle", "bold");

  let totalTests = 0;
  let passedTests = 0;

  // D'abord se connecter comme admin pour avoir un token
  const adminLogin = await makeRequest(`${API_BASE}/auth/v2/login`, {
    method: "POST",
    body: TEST_ACCOUNTS.admin,
  });

  if (adminLogin.status !== 200) {
    error("Impossible de se connecter comme admin pour tester le dashboard");
    return { passed: 0, total: 0 };
  }

  const token = adminLogin.data.tokens.accessToken;
  const endpoints = [
    "/dashboard/stats",
    "/dashboard/recent-activity",
    "/dashboard/modules",
  ];

  for (const endpoint of endpoints) {
    try {
      totalTests++;
      info(`Testing ${endpoint}...`);

      const startTime = performance.now();
      const response = await makeRequest(`${API_BASE}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (response.status === 200) {
        success(`${endpoint} successful (${duration}ms)`);

        // Vérifier que la réponse contient des données
        if (response.data && response.data.data) {
          success(`${endpoint} - Data structure valid`);
        } else {
          warning(`${endpoint} - Empty or invalid data structure`);
        }
        passedTests++;
      } else {
        error(`${endpoint} failed (${response.status})`);
      }
    } catch (err) {
      error(`${endpoint} error: ${err.message}`);
    }
  }

  log(
    `\n📊 Dashboard: ${passedTests}/${totalTests} tests réussis`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
}

// Test de performance
async function testPerformance() {
  log("\n⚡ Test de Performance", "bold");

  const performanceTests = [];

  // Test login performance
  try {
    const startTime = performance.now();
    await makeRequest(`${API_BASE}/auth/v2/login`, {
      method: "POST",
      body: TEST_ACCOUNTS.admin,
    });
    const endTime = performance.now();
    const loginTime = Math.round(endTime - startTime);

    performanceTests.push({
      test: "Login API",
      duration: loginTime,
      target: 200,
      passed: loginTime < 200,
    });
  } catch (err) {
    performanceTests.push({
      test: "Login API",
      duration: 0,
      target: 200,
      passed: false,
      error: err.message,
    });
  }

  // Afficher les résultats
  for (const test of performanceTests) {
    if (test.passed) {
      success(`${test.test}: ${test.duration}ms (target: <${test.target}ms)`);
    } else {
      error(
        `${test.test}: ${test.duration}ms (target: <${test.target}ms) ${
          test.error || ""
        }`
      );
    }
  }

  const passedPerf = performanceTests.filter((t) => t.passed).length;
  log(
    `\n📊 Performance: ${passedPerf}/${performanceTests.length} tests réussis`,
    passedPerf === performanceTests.length ? "green" : "red"
  );

  return { passed: passedPerf, total: performanceTests.length };
}

// Test de validation
async function testValidation() {
  log("\n🛡️  Test de Validation Zod", "bold");

  let totalTests = 0;
  let passedTests = 0;

  // Test avec données invalides
  const invalidTests = [
    { email: "invalid-email", password: "123" }, // Email invalide, mot de passe trop court
    { email: "test@test.com", password: "" }, // Mot de passe vide
    { email: "", password: "validpassword" }, // Email vide
  ];

  for (const [index, invalidData] of invalidTests.entries()) {
    try {
      totalTests++;
      info(`Testing validation rejection ${index + 1}...`);

      const response = await makeRequest(`${API_BASE}/auth/v2/login`, {
        method: "POST",
        body: invalidData,
      });

      if (response.status === 400 || response.status === 422) {
        success(`Validation correctly rejected invalid data ${index + 1}`);
        passedTests++;
      } else {
        error(
          `Validation should have rejected invalid data ${index + 1} (got ${
            response.status
          })`
        );
      }
    } catch (err) {
      error(`Validation test ${index + 1} error: ${err.message}`);
    }
  }

  log(
    `\n📊 Validation: ${passedTests}/${totalTests} tests réussis`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
}

// Test de connectivité de base
async function testConnectivity() {
  log("\n🌐 Test de Connectivité des Services", "bold");

  let totalTests = 0;
  let passedTests = 0;

  // Test API Backend
  try {
    totalTests++;
    info("Testing API backend connectivity...");
    const response = await makeRequest(`${API_BASE}/health`);
    // Pour l'instant on teste juste qu'on arrive à se connecter
    success("API Backend accessible");
    passedTests++;
  } catch (err) {
    error(`API Backend inaccessible: ${err.message}`);
  }

  log(
    `\n📊 Connectivité: ${passedTests}/${totalTests} tests réussis`,
    passedTests === totalTests ? "green" : "red"
  );
  return { passed: passedTests, total: totalTests };
}

// Fonction principale
async function runTests() {
  log("🧪 CIPFARO E-Learning - Test Suite Automatisé", "bold");
  log("=".repeat(50), "blue");

  const results = [];

  // Exécuter tous les tests
  results.push(await testConnectivity());
  results.push(await testAuthentication());
  results.push(await testDashboard());
  results.push(await testValidation());
  results.push(await testPerformance());

  // Résumé final
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0);
  const totalTests = results.reduce((sum, r) => sum + r.total, 0);
  const successRate = Math.round((totalPassed / totalTests) * 100);

  log("\n🎯 RÉSUMÉ FINAL", "bold");
  log("=".repeat(30), "blue");
  log(
    `Tests réussis: ${totalPassed}/${totalTests} (${successRate}%)`,
    successRate === 100 ? "green" : successRate > 80 ? "yellow" : "red"
  );

  if (successRate === 100) {
    log("\n🎉 Toutes les fonctionnalités fonctionnent parfaitement !", "green");
    log("✅ La plateforme est prête pour utilisation", "green");
  } else if (successRate > 80) {
    log("\n⚠️  La plupart des fonctionnalités marchent", "yellow");
    log("🔧 Quelques ajustements mineurs nécessaires", "yellow");
  } else {
    log("\n❌ Plusieurs problèmes détectés", "red");
    log("🛠️  Investigation et corrections nécessaires", "red");
  }

  log("\n📋 Commandes utiles:", "blue");
  log("- Démarrer PostgreSQL: docker-compose up -d postgres");
  log("- Seed database: cd infra && pnpm run db:seed-simple");
  log("- Démarrer API: cd apps/api && pnpm dev");
  log("- Démarrer Web: cd apps/web && pnpm dev");

  return successRate === 100;
}

// Exécution du script
if (require.main === module) {
  runTests().catch((err) => {
    error(`Erreur fatale: ${err.message}`);
    process.exit(1);
  });
}

module.exports = { runTests };
