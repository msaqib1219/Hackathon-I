// @ts-check
const { test, expect } = require("@playwright/test");

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

/**
 * Helper: log in via the AuthModal on a /docs page gate.
 * better-auth uses cookie-based sessions, so after login
 * the session cookie is set automatically.
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
test.describe("Auth Flow (email/password via better-auth)", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "TEST_USER_EMAIL and TEST_USER_PASSWORD env vars required"
  );

  test("login with existing account redirects to /docs/intro", async ({
    page,
  }) => {
    await loginViaGate(page, EMAIL, PASSWORD);

    await expect(page).toHaveURL(/\/docs\/intro/, { timeout: 15_000 });
    await expect(
      page.locator("h2", { hasText: "Sign in required" })
    ).toBeHidden();
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 10_000 });
  });

  test("session persists on page reload (cookie-based)", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await expect(
      page.locator("h1", { hasText: "The Art of the Agent" })
    ).toBeVisible({ timeout: 15_000 });

    // Reload and verify still authenticated via session cookie
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

    // Click Sign Out in the navbar — navigates to /goodbye page
    await page.locator("button", { hasText: "Sign Out" }).click();
    await expect(page).toHaveURL(/\/goodbye/, { timeout: 10_000 });

    // Goodbye page auto-redirects to homepage after 4s
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

    await expect(
      page.locator("button", { hasText: "Sign Out" })
    ).toBeVisible({ timeout: 10_000 });
  });
});
