import { test, expect } from "@playwright/test";

test("appointment save without patient shows validation and keeps dialog open", async ({
  page,
}) => {
  await page.goto("/schedule");
  await page.evaluate(() => window.localStorage.removeItem("pf-schedule-store"));
  await page.reload();

  await page.getByRole("button", { name: /Add appointment/i }).click();
  const dialog = page.getByRole("dialog", { name: "New appointment" });
  await expect(dialog).toBeVisible();

  await page.getByTestId("save-appointment").click();

  await expect(dialog).toBeVisible();
  await expect(page.getByTestId("patient-error")).toHaveText("Patient is required");
});
