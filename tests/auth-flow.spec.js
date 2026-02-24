// @ts-check
const { test, expect } = require("@playwright/test");

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

/**
 * Helper: log in via the AuthModal on a /docs page gate.
 */
async function loginViaGate(page, email, password) {
  await page.goto("/docs/intro");
  // AuthModal opens automatically for unauthenticated users on /docs pages
  await expect(page.locator("h2", { hasText: "Welcome Back" })).toBeVisible({ timeout: 10_000 });
  await page.locator("input#email").fill(email);
  await page.locator("input#password").fill(password);
  await page.locator('button[type="submit"]', { hasText: "Sign In" }).click();
  // Wait for the modal's success redirect (setTimeout 1000ms in AuthModal)
  await expect(page.locator("h1", { hasText: "The Art of the Agent" })).toBeVisible({ timeout: 15_000 });
}

test.describe.configure({ mode: 'serial' });
test.describe("Auth Flow (email/password)", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "TEST_USER_EMAIL and TEST_USER_PASSWORD env vars required"
  );

  test("login with existing account redirects to /docs/intro", async ({
    page,
  }) => {
    await loginViaGate(page, EMAIL, PASSWORD);

    // After successful login, the docs content should appear
    await expect(page).toHaveURL(/\/docs\/intro/, { timeout: 15_000 });
    await expect(
      page.locator("h2", { hasText: "Sign in required" })
    ).toBeHidden();
    // The doc page title should be visible
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("session persists on page reload", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 15_000 });

    // Reload and verify still authenticated
    await page.reload();
    await expect(
      page.locator("h2", { hasText: "Sign in required" })
    ).toBeHidden({ timeout: 10_000 });
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("sign out redirects to homepage", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 15_000 });

    // Click Sign Out in the navbar
    await page.locator("button", { hasText: "Sign Out" }).click();

    // Should redirect to homepage (not a /docs/* path)
    await expect(page).toHaveURL(/^https?:\/\/[^/]+(\/)?$/, { timeout: 10_000 });
    await expect(
      page.locator("h1", { hasText: "Master the Future of Autonomy" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("navbar shows user info when authenticated", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 15_000 });

    // Sign Out button should be visible instead of Sign In
    await expect(
      page.locator("button", { hasText: "Sign Out" })
    ).toBeVisible({ timeout: 10_000 });
  });
});
