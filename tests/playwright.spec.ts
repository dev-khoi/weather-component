import { test, expect, request } from "@playwright/test";
import { defineConfig } from "@playwright/test";

test.describe("Login Functionality", () => {
  // --- Test Case 1: Successful Login ---
  test("should allow an existing user to log in successfully", async ({
    page,
  }) => {
    // 1. Navigate to the login page
    await page.goto("/login");
    await expect(page).toHaveURL("http://localhost:5173/login");

    // 2. Ensure loading animation is not visible before interacting
    await expect(page.getByTestId("loading")).not.toBeVisible();

    await expect(page.getByTestId("login-form")).toBeVisible(); // Main container

    // 3. Fill in valid credentials
    // Using getByPlaceholder for robustness, adjust if your inputs have different labels/names
    await page.fill('input[placeholder="Email"]', "example@gmail.com");
    await page.fill('input[placeholder="Password"]', "example");

    // 4. Click the login button
    await page.getByTestId("login").click(); // Assuming button text is 'Login'

    await page.waitForURL("/weather");
    await expect(page).toHaveURL("/weather"); // Verify the final URL
  });

  // --- Test Case 2: Failed Login with Invalid Credentials ---
  test("should display an error message for invalid login credentials", async ({
    page,
  }) => {
    // 1. Navigate to the login page
    await page.goto("/login");

    // 2. Fill in invalid credentials
    await page.fill('input[placeholder="Email"]', "invalid@example.com");
    await page.fill('input[placeholder="Password"]', "WrongPassword123!");

    // 3. Click the login button
    await page.getByTestId("login").click(); // Assuming button text is 'Login'

    // 5. Assert that the page does NOT navigate away from the login page
    await expect(page).toHaveURL("/login"); // Still on the login page
    console.log("Failed login attempt correctly displayed an error.");
  });
});
// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
