import { expect, test } from "@playwright/test";
import { loginViaUi, skipIfMissingRoleCredentials } from "./helpers/auth";

test("advisor can access self-service landing and sees property CTA", async ({ page }, testInfo) => {
  const maybeCreds = skipIfMissingRoleCredentials(testInfo, "ASESOR");
  test.skip(!maybeCreds, "Missing QA credentials for ASESOR.");
  if (!maybeCreds) return;
  const creds = maybeCreds;

  await loginViaUi(page, creds, "/virtual-office/mi-landing");
  await page.waitForURL(/\/virtual-office\/mi-landing$/);

  await expect(page.getByText(/Mi landing pública/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Crear propiedad/i })).toBeVisible();
});
