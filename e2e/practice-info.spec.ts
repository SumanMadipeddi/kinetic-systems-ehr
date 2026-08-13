import { test, expect } from "@playwright/test";

test("practice info save updates home card and persists after reload", async ({ page }) => {
  await page.goto("/home");
  await page.evaluate(() => window.localStorage.removeItem("pf-practice-store"));
  await page.reload();

  await page.getByRole("button", { name: "Gather practice information" }).click();
  await expect(page.getByRole("heading", { name: "Add practice information" })).toBeVisible();

  const uniqueName = `Kinetic Demo Practice ${Date.now()}`;
  await page.locator("#practiceName").fill(uniqueName);
  await page.getByTestId("practice-save").click();

  await expect(page.getByRole("heading", { name: "Practice dashboard" })).toBeVisible();
  const practiceCard = page.getByRole("button", { name: "Gather practice information" });
  await expect(practiceCard).toContainText(uniqueName);

  await page.reload();
  await expect(
    page.getByRole("button", { name: "Gather practice information" }),
  ).toContainText(uniqueName);
});
