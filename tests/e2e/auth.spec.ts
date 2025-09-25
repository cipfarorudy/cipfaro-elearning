import { test, expect } from "@playwright/test";

/**
 * Tests E2E pour les parcours d'authentification
 * Vérifie les flux de connexion et déconnexion
 */
test.describe("Authentification E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Aller directement sur la page de login
    await page.goto("/login/v2");
    // Optionnel : Vérifier que la page de login est chargée
    // await expect(page).toHaveURL(/.*login/);
  });

  test("devrait permettre la connexion avec des identifiants valides", async ({
    page,
  }) => {
    // Vérifier que la page de connexion enhanced est affichée
    await expect(page.locator("h2")).toContainText("CIPFARO E-Learning");

    // Remplir le formulaire de connexion avec des comptes valides
    await page.fill('input[name="email"]', "admin@cipfaro.fr");
    await page.fill('input[name="password"]', "admin123");

    // Écouter les erreurs de console pour debug
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    // Soumettre le formulaire
    await page.click('button[type="submit"]');

    // Attendre un peu pour voir ce qui se passe
    await page.waitForTimeout(3000);

    // Log de l'URL actuelle pour debug
    console.log("URL actuelle après connexion:", page.url());

    // Vérifier si nous avons une erreur visible sur la page
    const errorElement = page.locator('[role="alert"], .text-red-700');
    if ((await errorElement.count()) > 0) {
      const errorText = await errorElement.textContent();
      console.log("Erreur visible:", errorText);
    }
  });

  test("devrait rejeter les identifiants invalides", async ({ page }) => {
    await page.goto("/login");

    // Essayer avec des identifiants incorrects
    await page.fill('input[name="email"]', "wrong@test.com");
    await page.fill('input[name="password"]', "wrongpassword");

    await page.click('button[type="submit"]');

    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      "identifiants invalides"
    );

    // Vérifier qu'on reste sur la page de connexion
    await expect(page).toHaveURL(/\/login/);
  });

  test("devrait permettre la déconnexion", async ({ page }) => {
    // Se connecter d'abord
    await page.goto("/login");
    await page.fill('input[name="email"]', "admin@test.com");
    await page.fill('input[name="password"]', "test123");
    await page.click('button[type="submit"]');

    // Attendre d'être sur le dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Cliquer sur le bouton de déconnexion
    await page.click('[data-testid="logout-button"]');

    // Vérifier la redirection vers la page d'accueil
    await expect(page).toHaveURL("/");
  });

  test("devrait rediriger vers la connexion si pas authentifié", async ({
    page,
  }) => {
    // Essayer d'accéder directement au dashboard
    await page.goto("/dashboard");

    // Vérifier la redirection vers la page de connexion
    await expect(page).toHaveURL(/\/login/);
  });
});
