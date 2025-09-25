import { test, expect } from "@playwright/test";

/**
 * Tests E2E pour les fonctionnalités du dashboard
 * Vérifie l'affichage des données et les interactions
 */
test.describe("Dashboard E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "test123");
    await page.click('button[type="submit"]');

    // Attendre d'être sur le dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("devrait afficher les statistiques du dashboard", async ({ page }) => {
    // Vérifier la présence des éléments du dashboard
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Vérifier les cartes de statistiques
    await expect(page.locator('[data-testid="total-sessions"]')).toBeVisible();
    await expect(page.locator('[data-testid="total-users"]')).toBeVisible();
    await expect(page.locator('[data-testid="active-sessions"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="completed-modules"]')
    ).toBeVisible();

    // Vérifier que les statistiques ont des valeurs numériques
    const totalSessions = await page
      .locator('[data-testid="total-sessions"]')
      .textContent();
    expect(totalSessions).toMatch(/\\d+/);
  });

  test("devrait permettre la navigation vers les modules", async ({ page }) => {
    // Cliquer sur le lien vers les modules
    await page.click('[data-testid="modules-link"]');

    // Vérifier la navigation
    await expect(page).toHaveURL(/\/admin\/modules/);
    await expect(page.locator("h1")).toContainText("Modules");
  });

  test("devrait permettre la navigation vers les rapports", async ({
    page,
  }) => {
    // Cliquer sur le lien vers les rapports
    await page.click('[data-testid="reports-link"]');

    // Vérifier la navigation
    await expect(page).toHaveURL(/\/admin\/reports/);
    await expect(page.locator("h1")).toContainText("Rapports");
  });

  test("devrait afficher les activités récentes", async ({ page }) => {
    // Vérifier la section des activités récentes
    await expect(page.locator('[data-testid="recent-activity"]')).toBeVisible();

    // Vérifier qu'il y a au moins une activité
    const activities = page.locator('[data-testid="activity-item"]');
    await expect(activities.first()).toBeVisible();
  });

  test("devrait être responsive sur mobile", async ({ page }) => {
    // Changer la taille de la fenêtre pour simuler un mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Vérifier que les éléments principaux restent visibles
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('[data-testid="total-sessions"]')).toBeVisible();

    // Vérifier que le menu mobile fonctionne si présent
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(
        page.locator('[data-testid="navigation-menu"]')
      ).toBeVisible();
    }
  });

  test("devrait permettre le rafraîchissement des données", async ({
    page,
  }) => {
    // Obtenir les valeurs initiales
    const initialSessions = await page
      .locator('[data-testid="total-sessions"]')
      .textContent();

    // Cliquer sur le bouton de rafraîchissement s'il existe
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();

      // Attendre que les données se rechargent
      await page.waitForTimeout(2000);

      // Vérifier que les données sont toujours présentes
      await expect(
        page.locator('[data-testid="total-sessions"]')
      ).toBeVisible();
    }
  });
});
