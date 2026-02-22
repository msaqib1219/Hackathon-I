// @ts-check
const { test, expect } = require("@playwright/test");

const DOC_ROUTES = [
  "/docs/intro",
  "/docs/week-01-anatomy",
  "/docs/week-02-language",
  "/docs/week-03-reasoning",
  "/docs/week-04-tool-use",
  "/docs/week-05-react",
  "/docs/week-06-rag",
  "/docs/week-07-planning",
  "/docs/week-08-memory",
  "/docs/week-09-orchestration",
  "/docs/week-10-errors",
  "/docs/week-11-ethics",
  "/docs/week-12-capstone",
];

test.describe("Authentication Gate", () => {
  for (const route of DOC_ROUTES) {
    test(`${route} shows "Sign in required" when unauthenticated`, async ({
      page,
    }) => {
      await page.goto(route);
      await expect(
        page.locator("h2", { hasText: "Sign in required" })
      ).toBeVisible();
      await expect(
        page.locator("p", { hasText: "Please sign in to access this content" })
      ).toBeVisible();
    });
  }

  test("Sign In button appears on protected route gate", async ({ page }) => {
    await page.goto("/docs/intro");
    // Close the auto-opened modal via close button (×)
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();
    await page.locator("button", { hasText: "\u00d7" }).click();
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeHidden({ timeout: 5000 });

    const signInBtn = page.getByRole("button", {
      name: "Sign In",
      exact: true,
    });
    await expect(signInBtn).toBeVisible();
  });

  test("AuthModal auto-opens in sign-in mode on protected route", async ({
    page,
  }) => {
    await page.goto("/docs/intro");
    // Modal auto-opens with showModal = true
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#password")).toBeVisible();
    await expect(
      page.locator('button[type="submit"]', { hasText: "Sign In" })
    ).toBeVisible();
  });

  test("AuthModal switches to sign-up mode", async ({ page }) => {
    await page.goto("/docs/intro");
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();

    // Click the "Sign Up" switch button inside the modal
    await page.locator("button", { hasText: "Sign Up" }).click();
    await expect(
      page.locator("h2", { hasText: "Create Account" })
    ).toBeVisible();
    await expect(page.locator("input#name")).toBeVisible();
    await expect(page.locator("input#email")).toBeVisible();
    await expect(page.locator("input#password")).toBeVisible();
  });

  test("form validation rejects invalid email", async ({ page }) => {
    await page.goto("/docs/intro");
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();

    // Use value that passes native type="email" validation but fails custom regex
    // Native accepts "user@domain" but custom regex requires a dot after @
    await page.locator("input#email").fill("test@example");
    await page.locator("input#password").fill("Password1");
    await page.locator('button[type="submit"]').click();

    await expect(
      page.locator("text=Please enter a valid email address")
    ).toBeVisible();
  });

  test("form validation rejects short password", async ({ page }) => {
    await page.goto("/docs/intro");
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();

    await page.locator("input#email").fill("test@example.com");
    // Use 7 chars to bypass native required but fail the 8-char custom check
    // Dispatch submit programmatically to bypass native minLength validation
    await page.locator("input#password").fill("Short1!");
    await page.locator("form").evaluate((form) => {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    await expect(
      page.locator("text=Password must be at least 8 characters")
    ).toBeVisible();
  });

  test("form validation requires letter and number in password", async ({
    page,
  }) => {
    await page.goto("/docs/intro");
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();

    // Password with only letters
    await page.locator("input#email").fill("test@example.com");
    await page.locator("input#password").fill("abcdefgh");
    await page.locator('button[type="submit"]').click();

    await expect(
      page.locator("text=Password must contain at least one number")
    ).toBeVisible();
  });

  test("AuthModal closes when close button clicked", async ({ page }) => {
    await page.goto("/docs/intro");
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();

    // Click the × close button
    await page.locator("button", { hasText: "\u00d7" }).click();

    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeHidden({ timeout: 5000 });
  });

  test("AuthModal has Google sign-in option", async ({ page }) => {
    await page.goto("/docs/intro");
    await expect(
      page.locator("h2", { hasText: "Welcome Back" })
    ).toBeVisible();
    await expect(
      page.locator("button", { hasText: "Continue with Google" })
    ).toBeVisible();
  });
});
