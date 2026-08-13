import { test, expect } from "@playwright/test";

test("schedule type filter hides and restores Follow-Up entries", async ({ page }) => {
  await page.goto("/schedule");
  await page.evaluate(() => window.localStorage.removeItem("pf-schedule-store"));
  await page.reload();

  const followUp = page.locator("[data-entry-id]").filter({ hasText: "Lee, Jordan" });
  await followUp.scrollIntoViewIfNeeded();
  await expect(followUp).toBeVisible();

  await page.getByRole("button", { name: "Appointment types" }).click();
  await page.getByTestId("filter-type-follow-up").locator("input").uncheck();

  await expect(followUp).toHaveCount(0);

  await page.getByTestId("filter-type-follow-up").locator("input").check();
  const restored = page.locator("[data-entry-id]").filter({ hasText: "Lee, Jordan" });
  await restored.scrollIntoViewIfNeeded();
  await expect(restored).toBeVisible();
});
