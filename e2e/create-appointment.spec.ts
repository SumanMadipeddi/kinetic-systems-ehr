import { test, expect } from "@playwright/test";

test("create patient appointment appears and persists after reload", async ({ page }) => {
  await page.goto("/schedule");
  await page.evaluate(() => window.localStorage.removeItem("pf-schedule-store"));
  await page.reload();

  await expect(page.getByRole("heading", { name: "Schedule" })).toBeVisible();

  await page.getByRole("button", { name: /Add appointment/i }).click();
  await expect(page.getByRole("dialog", { name: "New appointment" })).toBeVisible();

  await page.getByLabel("Search patients").fill("Brooks");
  await page.getByTestId("patient-option-pat-004").click();
  await expect(page.getByTestId("patient-id")).toHaveValue("pat-004");

  await page.locator("#appointmentType").selectOption("new-patient");
  await page.locator("#duration").fill("45");

  // Move to 11:00 AM so the block is distinct from seed data at 9:00/10:00
  for (let i = 0; i < 8; i += 1) {
    await page.getByTestId("time-plus").click();
  }
  await expect(page.getByTestId("appointment-time")).toHaveText("11:00 AM");

  await page.getByTestId("save-appointment").click();

  await expect(page.getByRole("dialog", { name: "New appointment" })).toBeHidden({
    timeout: 10000,
  });
  await expect(page.getByText("Appointment saved for Brooks, Riley.")).toBeVisible();

  const block = page.locator("[data-entry-id]").filter({ hasText: "Brooks, Riley" });
  await block.scrollIntoViewIfNeeded();
  await expect(block).toBeVisible();

  await page.reload();
  const persisted = page.locator("[data-entry-id]").filter({ hasText: "Brooks, Riley" });
  await persisted.scrollIntoViewIfNeeded();
  await expect(persisted).toBeVisible();
});
