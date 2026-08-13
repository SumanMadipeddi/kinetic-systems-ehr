import { test, expect } from "@playwright/test";

test("block time saves, appears on calendar, and persists after reload", async ({ page }) => {
  await page.goto("/schedule");
  await page.evaluate(() => window.localStorage.removeItem("pf-schedule-store"));
  await page.reload();

  await page.getByRole("button", { name: /Add appointment/i }).click();
  const dialog = page.getByRole("dialog", { name: "New appointment" });
  await expect(dialog).toBeVisible();

  await page.getByRole("button", { name: "Block time" }).click();
  await page.locator("#block-reason").selectOption("Meeting");
  await page.locator("#block-duration").fill("45");
  await page.getByTestId("block-time-input").fill("1:00 PM");
  await page.getByTestId("block-time-input").blur();

  await page.getByTestId("save-appointment").click();

  await expect(dialog).toBeHidden({ timeout: 10000 });
  await expect(page.getByText("Block time saved.")).toBeVisible();

  const block = page.locator("[data-entry-id]").filter({ hasText: "Meeting" });
  await block.scrollIntoViewIfNeeded();
  await expect(block).toBeVisible();

  await page.reload();
  const persisted = page.locator("[data-entry-id]").filter({ hasText: "Meeting" });
  await persisted.scrollIntoViewIfNeeded();
  await expect(persisted).toBeVisible();
});
