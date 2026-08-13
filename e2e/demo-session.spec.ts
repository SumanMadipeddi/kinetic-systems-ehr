import { test, expect } from "@playwright/test";
import { DEMO_CREDENTIALS } from "../src/config/demo-credentials";

test("lock unlock and logout login demo session flow", async ({ page }) => {
  await page.goto("/schedule");
  await page.evaluate(() => {
    window.sessionStorage.removeItem("pf-demo-session");
    window.localStorage.removeItem("pf-schedule-store");
  });
  await page.reload();

  await expect(page.getByRole("heading", { name: "Schedule" })).toBeVisible();

  await page.getByTestId("nav-lock").click();
  await expect(page).toHaveURL(/\/lock/);
  await expect(
    page.getByRole("heading", { name: "Enter your password to unlock the screen" }),
  ).toBeVisible();

  await page.getByTestId("lock-password").fill(DEMO_CREDENTIALS.password);
  await page.getByTestId("lock-unlock").click();

  await expect(page).toHaveURL(/\/schedule/);
  await expect(page.getByRole("heading", { name: "Schedule" })).toBeVisible();

  await page.getByTestId("nav-logout").click();
  await expect(page).toHaveURL(/\/login/);

  await page.locator("#login-email").fill(DEMO_CREDENTIALS.email);
  await page.locator("#login-password").fill(DEMO_CREDENTIALS.password);
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/\/home/);
  await expect(page.getByRole("heading", { name: "Practice dashboard" })).toBeVisible();
});
