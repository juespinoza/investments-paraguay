import { expect, test } from "@playwright/test";
import { loginViaUi, skipIfMissingRoleCredentials } from "./helpers/auth";

test("admin can open the workflow wizard and see the first operational step", async ({ page }, testInfo) => {
  const maybeCreds = skipIfMissingRoleCredentials(testInfo, "ADMIN");
  test.skip(!maybeCreds, "Missing QA credentials for ADMIN.");
  if (!maybeCreds) return;
  const creds = maybeCreds;

  await loginViaUi(page, creds, "/virtual-office/workflow");
  await page.waitForURL(/\/virtual-office\/workflow$/);

  await expect(page.getByText("Wizard de alta operativa")).toBeVisible();
  await expect(page.getByText("Paso 1. Inmobiliaria")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /continuar sin inmobiliaria/i }),
  ).toBeVisible();
});
