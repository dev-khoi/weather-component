import { test, expect, request } from "@playwright/test";
import { defineConfig } from "@playwright/test";

// Define test user credentials
const timestamp = Date.now().toString().slice(-6); // Use only last 6 digits
const TEST_USER_EMAIL = `test${timestamp}@example.com`;
const TEST_USER_PASSWORD = "TestPassword123!";
const TEST_USER_USERNAME = `test${timestamp}`; // Assuming username is also part of registration

// --- Before all tests in this file, ensure a test user exists via API ---
test.beforeAll(async () => {
  // Create a request context to make API calls directly
  const apiContext = await request.newContext({
    baseURL: process.env.PLAYWRIGHT_BACKEND_URL || "http://localhost:3000", // Use backend URL from env or default
  });

  try {
    // Attempt to register a new user for testing
    const response = await apiContext.post("/auth/local/register", {
      data: {
        username: TEST_USER_USERNAME,
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      },
    });

    if (response.ok()) {
      console.log(`Test user ${TEST_USER_EMAIL} registered successfully.`);
    } else {
      const errorBody = await response.json();
      // If user already exists (e.g., from a previous failed run), that's okay for login tests
      if (errorBody.message && errorBody.message.includes("already exists")) {
        console.warn(`Test user ${TEST_USER_EMAIL} already exists.`);
      } else {
        throw new Error(
          `Failed to register test user: ${response} - ${JSON.stringify(
            errorBody
          )}`
        );
      }
    }
  } catch (error) {
    console.error("Error during test user setup:", error);
    // Fail the test suite if setup fails critically
    test.fail(true, `Failed to set up test user: ${error.message}`);
  } finally {
    await apiContext.dispose(); // Clean up the request context
  }
});
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
    await page.fill('input[placeholder="Email"]', TEST_USER_EMAIL);
    await page.fill('input[placeholder="Password"]', TEST_USER_PASSWORD);

    // 4. Click the login button
    await page.getByTestId("login").click(); // Assuming button text is 'Login'

    // 6. Assert successful redirection to the main app page (e.g., '/')
    // Use a regex to match the base URL or specific dashboard URL
    await page.waitForURL("/weather");
    await expect(page).toHaveURL("/weather"); // Verify the final URL

    // 7. Assert that a logged-in indicator is visible (e.g., a "Logout" button, user profile link)
    // Replace with an actual element that appears post-login

//     const menuButton = page.getByTestId("main-menu");
// await menuButton.waitFor({ state: "visible" }); // or "attached"
// await menuButton.click();
//     await expect(page.getByTestId("logout")).toBeVisible();
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

    // 4. Assert that an error message is displayed
    // Look for a common error message or a specific error container
    await expect(
      page.getByText("Invalid email or password") || page.getByTestId("testid")
    ).toBeVisible();

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
