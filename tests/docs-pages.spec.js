// @ts-check
const { test, expect } = require("@playwright/test");

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

const DOC_PAGES = [
  { path: "/docs/intro", heading: "The Art of the Agent" },
  { path: "/docs/week-01-anatomy", heading: "Anatomy" },
  { path: "/docs/week-02-language", heading: "Language" },
  { path: "/docs/week-03-reasoning", heading: "Reasoning" },
  { path: "/docs/week-04-tool-use", heading: "Tool Use" },
  { path: "/docs/week-05-react", heading: "ReAct" },
  { path: "/docs/week-06-rag", heading: "RAG" },
  { path: "/docs/week-07-planning", heading: "Planning" },
  { path: "/docs/week-08-memory", heading: "Memory" },
  { path: "/docs/week-09-orchestration", heading: "Orchestration" },
  { path: "/docs/week-10-errors", heading: "Error" },
  { path: "/docs/week-11-ethics", heading: "Ethics" },
  { path: "/docs/week-12-capstone", heading: "Capstone" },
];

const SIDEBAR_CATEGORIES = [
  "Phase I: The Engine",
  "Phase II: The Tools",
  "Phase III: The Architecture",
  "Phase IV: The Deployment",
];

/**
 * Helper: log in via the AuthModal on a /docs page gate.
 */
async function loginViaGate(page, email, password) {
  await page.goto("/docs/intro");
  await page.locator("button", { hasText: "Sign In" }).first().click();
  await expect(page.locator("h2", { hasText: "Welcome Back" })).toBeVisible();
  await page.locator("input#email").fill(email);
  await page.locator("input#password").fill(password);
  await page.locator('button[type="submit"]', { hasText: "Sign In" }).click();
  await expect(
    page.locator("h1", { hasText: "The Art of the Agent" })
  ).toBeVisible({ timeout: 15_000 });
}

test.describe("All Docs Pages Load", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "TEST_USER_EMAIL and TEST_USER_PASSWORD env vars required"
  );

  for (const { path, heading } of DOC_PAGES) {
    test(`${path} loads with heading containing "${heading}"`, async ({
      page,
    }) => {
      await loginViaGate(page, EMAIL, PASSWORD);
      await page.goto(path);

      // Auth gate should not show
      await expect(
        page.locator("h2", { hasText: "Sign in required" })
      ).toBeHidden({ timeout: 10_000 });

      // Page heading should contain the expected text
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible({ timeout: 10_000 });
      await expect(h1).toContainText(heading);
    });
  }

  test("sidebar navigation shows 4 categories", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);

    for (const category of SIDEBAR_CATEGORIES) {
      await expect(
        page.locator(".menu__list-item", { hasText: category })
      ).toBeVisible();
    }
  });

  test("KaTeX math stylesheet loads", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);

    const katexLink = page.locator('link[href*="katex"]');
    await expect(katexLink).toBeAttached();
  });
});
