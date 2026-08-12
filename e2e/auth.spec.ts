import { expect, test } from "@playwright/test";
import {
  assertAuthenticatedRole,
  loginViaUi,
  logoutViaUi,
  skipIfMissingRoleCredentials,
} from "./helpers/auth";

test("invalid login shows a friendly error", async ({ page }) => {
  await page.goto("/virtual-office/login");
  await page.getByPlaceholder("Email").fill("invalid@example.com");
  await page.getByPlaceholder("Contraseña").fill("wrong-password-123");
  await page.getByRole("button", { name: /ingresar/i }).click();
  await expect(page.getByText("Email o contraseña incorrectos.")).toBeVisible();
});

test("admin can login and logout through the UI", async ({ page }, testInfo) => {
  const maybeCreds = skipIfMissingRoleCredentials(testInfo, "ADMIN");
  test.skip(!maybeCreds, "Missing QA credentials for ADMIN.");
  if (!maybeCreds) return;
  const creds = maybeCreds;

  await loginViaUi(page, creds);
  await page.waitForURL(/\/virtual-office$/);
  await assertAuthenticatedRole(page, "ADMIN");

  await logoutViaUi(page);
  await page.waitForURL(/\/virtual-office\/login$/);

  const response = await page.request.get("/api/auth/me");
  const json = await response.json();
  expect(json.authenticated).toBe(false);
});
