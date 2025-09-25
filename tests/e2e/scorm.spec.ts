import { test, expect } from "@playwright/test";

/**
 * Tests E2E pour les modules SCORM
 * Vérifie le lancement et l'interaction avec le contenu SCORM
 */
test.describe("SCORM E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto("/login");
    await page.fill('input[name="email"]', "stagiaire@test.com");
    await page.fill('input[name="password"]', "test123");
    await page.click('button[type="submit"]');

    // Attendre d'être connecté
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("devrait afficher la liste des modules disponibles", async ({
    page,
  }) => {
    // Aller à la page des modules
    await page.goto("/learn");

    // Vérifier que la page des modules est affichée
    await expect(page.locator("h1")).toContainText("Mes Modules");

    // Vérifier qu'il y a des modules disponibles
    const modules = page.locator('[data-testid="module-card"]');
    await expect(modules.first()).toBeVisible();
  });

  test("devrait permettre de lancer un module SCORM", async ({ page }) => {
    // Aller à la page des modules
    await page.goto("/learn");

    // Cliquer sur le premier module
    await page.click(
      '[data-testid="module-card"]:first-child [data-testid="launch-module"]'
    );

    // Vérifier la navigation vers le module
    await expect(page).toHaveURL(/\/learn\/[^\/]+/);

    // Vérifier que l'iframe SCORM est présente
    await expect(page.locator('[data-testid="scorm-iframe"]')).toBeVisible();
  });

  test("devrait initialiser l'API SCORM correctement", async ({ page }) => {
    // Aller à un module spécifique
    await page.goto("/learn/module-demo");

    // Attendre que l'iframe soit chargée
    await page.waitForSelector('[data-testid="scorm-iframe"]');

    // Vérifier que l'API SCORM est disponible dans la fenêtre
    const apiAvailable = await page.evaluate(() => {
      return (
        typeof window.API !== "undefined" ||
        typeof window.API_1484_11 !== "undefined"
      );
    });

    expect(apiAvailable).toBe(true);
  });

  test("devrait sauvegarder les données CMI", async ({ page }) => {
    // Aller à un module spécifique
    await page.goto("/learn/module-demo");

    // Attendre que l'iframe soit chargée
    await page.waitForSelector('[data-testid="scorm-iframe"]');

    // Simuler des interactions SCORM dans l'iframe
    await page.evaluate(() => {
      // Simuler l'utilisation de l'API SCORM
      if (window.API) {
        window.API.LMSSetValue("cmi.core.lesson_status", "incomplete");
        window.API.LMSSetValue("cmi.core.score.raw", "75");
        window.API.LMSCommit("");
      }
    });

    // Actualiser la page et vérifier que les données sont persistées
    await page.reload();
    await page.waitForSelector('[data-testid="scorm-iframe"]');

    // Vérifier que les données CMI sont récupérées
    const lessonStatus = await page.evaluate(() => {
      if (window.API) {
        return window.API.LMSGetValue("cmi.core.lesson_status");
      }
      return null;
    });

    expect(lessonStatus).toBe("incomplete");
  });

  test("devrait afficher le progrès du module", async ({ page }) => {
    // Aller à la page des modules
    await page.goto("/learn");

    // Vérifier qu'au moins un module a des indicateurs de progrès
    const progressIndicator = page
      .locator('[data-testid="module-progress"]')
      .first();
    await expect(progressIndicator).toBeVisible();

    // Vérifier que le progrès est affiché (pourcentage ou statut)
    const progressText = await progressIndicator.textContent();
    expect(progressText).toMatch(/(\\d+%|complété|en cours|non commencé)/i);
  });

  test("devrait permettre de reprendre un module en cours", async ({
    page,
  }) => {
    // Aller à la page des modules
    await page.goto("/learn");

    // Chercher un module en cours
    const moduleInProgress = page
      .locator(
        '[data-testid="module-card"]:has([data-testid="module-progress"]:has-text("en cours"))'
      )
      .first();

    if (await moduleInProgress.isVisible()) {
      // Cliquer sur "Reprendre"
      await moduleInProgress.locator('[data-testid="resume-module"]').click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/learn\/[^\/]+/);

      // Vérifier que le module se charge
      await expect(page.locator('[data-testid="scorm-iframe"]')).toBeVisible();
    }
  });

  test("devrait gérer les erreurs de chargement SCORM", async ({ page }) => {
    // Essayer d'accéder à un module inexistant
    await page.goto("/learn/module-inexistant");

    // Vérifier qu'un message d'erreur est affiché
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      "Module non trouvé"
    );
  });
});
