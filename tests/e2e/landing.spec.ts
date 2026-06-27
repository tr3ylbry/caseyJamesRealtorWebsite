import { expect, test } from "@playwright/test";

test("renders the complete marketing-first landing page", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Casey James.*Marketing-First REALTOR/);
  await expect(page.getByRole("heading", { name: /Most agents list homes/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Every tool your home needs/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "An inside advantage in how homes are seen." })).toBeVisible();
  await expect(page.getByRole("heading", { name: /What could your home be worth/ })).toBeVisible();

  const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(horizontalOverflow).toBe(false);

  await page.screenshot({ path: testInfo.outputPath("landing.png"), fullPage: true });
});

test("primary CTA reaches the form and the Phase 1 form validates", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Get Your Free Home Value/ }).click();
  await expect(page.getByRole("heading", { name: /What could your home be worth/ })).toBeInViewport();

  await page.getByLabel("First name").fill("Casey");
  await page.getByLabel("Last name").fill("James");
  await page.getByLabel("Email address").fill("casey@example.com");
  await page.getByLabel("How can Casey help?").fill("I would like a home value consultation.");
  await page.getByLabel(/I agree to be contacted/).check();
  await page.getByRole("button", { name: "Request my consultation" }).click();

  await expect(page.getByRole("status")).toContainText("ready for launch delivery setup");
});
