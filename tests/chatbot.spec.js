// @ts-check
const { test, expect } = require("@playwright/test");

const EMAIL = process.env.TEST_USER_EMAIL;
const PASSWORD = process.env.TEST_USER_PASSWORD;

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

test.describe("Chatbot Widget (unauthenticated)", () => {
  test("chatbot toggle button visible on docs page", async ({ page }) => {
    await page.goto("/docs/intro");
    // Even when unauthenticated, the chatbot toggle should appear
    await expect(page.locator(".chatbot-toggle")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("chatbot shows sign-in prompt when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/docs/intro");
    await page.locator(".chatbot-toggle").click();
    await expect(page.locator(".chatbot-window")).toBeVisible();
    await expect(
      page.locator("text=Please sign in to use the chatbot")
    ).toBeVisible();
  });
});

test.describe("Chatbot Widget (authenticated)", () => {
  test.skip(
    !EMAIL || !PASSWORD,
    "TEST_USER_EMAIL and TEST_USER_PASSWORD env vars required"
  );

  test("chatbot toggle button visible on docs page", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await expect(page.locator(".chatbot-toggle")).toBeVisible();
  });

  test("opens chat window on click", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await page.locator(".chatbot-toggle").click();
    await expect(page.locator(".chatbot-window")).toBeVisible();
    await expect(page.locator("text=AI Book Agent")).toBeVisible();
  });

  test("shows input field and send button", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await page.locator(".chatbot-toggle").click();

    await expect(
      page.locator('input[placeholder="Ask a question..."]')
    ).toBeVisible();
    await expect(
      page.locator(".chatbot-input button", { hasText: "Send" })
    ).toBeVisible();
  });

  test("shows initial bot greeting message", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await page.locator(".chatbot-toggle").click();

    await expect(
      page.locator(".message.bot", {
        hasText: "I can answer questions about the Agentic AI Book",
      })
    ).toBeVisible();
  });

  test("close button hides chat window", async ({ page }) => {
    await loginViaGate(page, EMAIL, PASSWORD);
    await page.locator(".chatbot-toggle").click();
    await expect(page.locator(".chatbot-window")).toBeVisible();

    await page.locator(".chatbot-close").click();
    await expect(page.locator(".chatbot-window")).toBeHidden();
  });
});
