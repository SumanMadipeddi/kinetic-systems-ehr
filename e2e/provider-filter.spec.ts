import { test, expect } from "@playwright/test";

test("provider All off shows empty state; Just me restores default provider", async ({
  page,
}) => {
  await page.goto("/schedule");
  await page.evaluate(() => window.localStorage.removeItem("pf-schedule-store"));
  await page.reload();

  const providerColumn = page
    .locator("div.min-w-\\[220px\\]")
    .filter({ hasText: /^Ma, suman$/ });
  await expect(providerColumn).toBeVisible();

  await page.getByTestId("filter-providers-all").locator("input").uncheck();

  await expect(
    page.getByText("Select at least one provider in Filters."),
  ).toBeVisible();
  await expect(providerColumn).toHaveCount(0);

  await page.getByTestId("filter-just-me").click();
  await expect(
    page.locator("div.min-w-\\[220px\\]").filter({ hasText: /^Ma, suman$/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Select at least one provider in Filters."),
  ).toHaveCount(0);
});
