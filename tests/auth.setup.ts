import { test as setup, expect } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const test_email = process.env.TEST_EMAIL!;
  const test_password = process.env.TEST_PASSWORD!;

  await page.goto("/login");

  await expect(page.getByTestId("login-form")).toBeVisible();
  await page.getByPlaceholder("Email").fill(test_email);
  await page.getByPlaceholder("Password").fill(test_password);
  await page.getByTestId("login").click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("/weather");
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(page.getByTestId("main-menu")).toBeVisible();
  await page.getByTestId("main-menu").click();
  await expect(page.getByTestId("logout")).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: authFile });
});
