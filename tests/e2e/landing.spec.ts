import { expect, test } from "@playwright/test";

test("renders the complete marketing-first landing page", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Casey James.*The Marketing-First REALTOR/);
  await expect(page.getByRole("heading", { name: /Most agents list homes/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Every tool your home needs/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An inside advantage in how homes are seen." })).toBeVisible();
  await expect(page.getByRole("heading", { name: /What could your home be worth/ })).toBeVisible();

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(horizontalOverflow).toBe(false);

  await page.screenshot({ path: testInfo.outputPath("landing.png"), fullPage: true });
});

test("primary CTA reaches the form and the Phase 1 form validates", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/");
  await page.getByRole("link", { name: /Get Your Free Home Value/ }).click();
  await expect(page.getByRole("heading", { name: /What could your home be worth/ })).toBeInViewport();

  await page.getByLabel("First name").fill("Casey");
  await page.getByLabel("Last name").fill("James");
  await page.getByLabel("Email address").fill("casey@example.com");
  await page.getByLabel("How can Casey help?").fill("I would like a home value consultation.");
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Request my consultation" }).click();
  await expect(page.getByRole("button", { name: "Requesting..." })).toBeDisabled();

  await expect(page.getByRole("status")).toContainText("your inquiry has been received");
  expect(page.url()).not.toContain("?");
});

test("contact form uses custom validation and phone formatting", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Get Your Free Home Value/ }).click();

  await page.getByRole("button", { name: "Request my consultation" }).click();

  await expect(page.getByText("Please enter your first name.")).toBeVisible();
  await expect(page.getByText("Please enter your last name.")).toBeVisible();
  await expect(page.getByText("Please enter at least 10 characters about your home or selling goals.")).toBeVisible();
  await expect(page.getByText("Please provide an email address or phone number so Casey can follow up.")).toBeVisible();
  await expect(page.getByText("Please confirm Casey may contact you about your inquiry.")).toBeVisible();

  await page.getByLabel("First name").fill("Casey");
  await expect(page.getByText("Please enter your first name.")).toHaveCount(0);

  await page.getByLabel("Email address").fill("not-an-email");
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await page.getByLabel("Email address").fill("casey@example.com");
  await expect(page.getByText("Please enter a valid email address.")).toHaveCount(0);

  await page.getByLabel("Phone number").fill("abc");
  await expect(page.getByText("Please enter numbers only.")).toBeVisible();
  await page.getByLabel("Phone number").fill("5205551212");
  await expect(page.getByLabel("Phone number")).toHaveValue("520-555-1212");
  await expect(page.getByText("Please enter numbers only.")).toHaveCount(0);
});

test("contact form maps rate limits to a friendly message", async ({ page }) => {
  await page.route("**/api/contact", async (route) => {
    await route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ ok: false }),
    });
  });

  await page.goto("/");
  await page.getByRole("link", { name: /Get Your Free Home Value/ }).click();

  await page.getByLabel("First name").fill("Casey");
  await page.getByLabel("Last name").fill("James");
  await page.getByLabel("Email address").fill("casey@example.com");
  await page.getByLabel("How can Casey help?").fill("I would like a home value consultation.");
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Request my consultation" }).click();

  await expect(page.getByRole("status")).toContainText("Please wait a moment before submitting another inquiry.");
});
