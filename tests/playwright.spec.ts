import { test, expect } from "@playwright/test";

test.describe("Login Functionality", () => {
  test("should allow authenticated user to see the weather page", async ({
    page,
  }) => {
    await page.goto("/weather");
    
    // Wait for loading to complete and toolbar to appear
    await expect(page.getByTestId("toolbar")).toBeVisible({ timeout: 15000 });
    await expect(page.getByTestId("layout")).toBeVisible();
  });
});
