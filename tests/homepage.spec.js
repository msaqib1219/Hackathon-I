// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Homepage & Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("homepage loads with hero section", async ({ page }) => {
    await expect(
      page.locator("h1", { hasText: "Master the Future of Autonomy" })
    ).toBeVisible();
    await expect(
      page.locator("p", {
        hasText: "Build Production-Ready AI Agents from Scratch",
      })
    ).toBeVisible();
    await expect(
      page.locator("a", { hasText: "Start Reading for Free" })
    ).toBeVisible();
  });

  test("hero meta badges display", async ({ page }) => {
    await expect(page.locator("text=12 Weeks")).toBeVisible();
    await expect(page.locator("text=Hands-on Projects")).toBeVisible();
    await expect(page.locator("text=Free Access")).toBeVisible();
  });

  test("features section renders", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "Why This Book?" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Foundation", exact: true })
    ).toBeVisible();
    await expect(page.locator("h3", { hasText: "Tooling" })).toBeVisible();
    await expect(page.locator("h3", { hasText: "Deployment" })).toBeVisible();
  });

  test("WhatsInside section renders with module cards", async ({ page }) => {
    await expect(
      page.locator("h2", { hasText: "What's Inside" })
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Foundations" })
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Core Capabilities" })
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Advanced Systems" })
    ).toBeVisible();
    await expect(
      page.locator("h3", { hasText: "Production" })
    ).toBeVisible();
  });

  test("navbar has brand title and navigation links", async ({ page }) => {
    await expect(
      page.locator(".navbar__title", { hasText: "Agentic AI Book" })
    ).toBeVisible();
    await expect(
      page.locator("a.navbar__item", { hasText: "Read the Book" })
    ).toBeVisible();
    await expect(
      page.locator("nav button", { hasText: "Sign In" })
    ).toBeVisible();
  });

  test("footer renders with copyright", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Agentic AI Book");
    await expect(footer).toContainText("Docusaurus");
  });

  test('"Read the Book" navigates to /docs/intro', async ({ page }) => {
    await page.locator("a.navbar__item", { hasText: "Read the Book" }).click();
    await expect(page).toHaveURL(/\/docs\/intro/);
  });

  test('"Start Reading for Free" navigates to /docs/intro', async ({
    page,
  }) => {
    await page
      .locator("a", { hasText: "Start Reading for Free" })
      .first()
      .click();
    await expect(page).toHaveURL(/\/docs\/intro/);
  });
});
