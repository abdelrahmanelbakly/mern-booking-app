import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";
test("should allow user to sign in", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click(); //get sign in botton
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible(); //expect the Sign in heading
  await page.locator("[name=email]").fill("1@1.com"); //fill-in email
  await page.locator("[name=password]").fill("password123"); //fill-in password
  await page.getByRole("button", { name: "Login" }).click(); //click Login button
  await expect(page.getByText("Sign in Successfull!")).toBeVisible(); // expect the sign in successfull toast
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible(); // expect My Bookings link to be visible
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible(); // expect My hotels link to be visible
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible(); // expect Sign out button to be visible
});
test("should allow user to register", async ({ page }) => {
  const testEmail = `test_register_${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`; //generate random email
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click(); // go to sign in page
  await page.getByRole("link", { name: "Create an account here" }).click(); //go to sign up page
  await expect(
    page.getByRole("heading", { name: "Create an Account" })
  ).toBeVisible(); //expect the Create an Account heading

  await page.locator("[name=firstName]").fill("test_firstName"); //fill-in firstName
  await page.locator("[name=lastName]").fill("test_lastName"); //fill-in lastName
  await page.locator("[name=email]").fill(testEmail); //fill-in Email
  await page.locator("[name=password]").fill("password123"); //fill-in password
  await page.locator("[name=confirmPassword]").fill("password123"); //fill-in confirmPassword

  await page.getByRole("button", { name: "Create Account" }).click(); // click create Account button

  await expect(page.getByText("Registration Success!")).toBeVisible(); //expect the Registeration Success! toast
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible(); // expect My Bookings link to be visible
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible(); // expect My hotels link to be visible
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible(); // expect Sign out button to be visible
});
