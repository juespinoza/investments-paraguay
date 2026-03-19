import { expect, type Page, type TestInfo } from "@playwright/test";

export type QaRole = "ADMIN" | "INMOBILIARIA" | "ASESOR" | "BLOGUERO";

export function roleCredentials(role: QaRole) {
  const envMap = {
    ADMIN: {
      email: process.env.QA_ADMIN_EMAIL,
      password: process.env.QA_ADMIN_PASSWORD,
    },
    INMOBILIARIA: {
      email: process.env.QA_INMOBILIARIA_EMAIL,
      password: process.env.QA_INMOBILIARIA_PASSWORD,
    },
    ASESOR: {
      email: process.env.QA_ASESOR_EMAIL,
      password: process.env.QA_ASESOR_PASSWORD,
    },
    BLOGUERO: {
      email: process.env.QA_BLOGUERO_EMAIL,
      password: process.env.QA_BLOGUERO_PASSWORD,
    },
  } as const;

  return envMap[role];
}

export function skipIfMissingRoleCredentials(testInfo: TestInfo, role: QaRole) {
  const creds = roleCredentials(role);
  if (!creds.email || !creds.password) {
    testInfo.annotations.push({
      type: "skip",
      description: `Missing QA credentials for ${role}. Set QA_${role}_EMAIL and QA_${role}_PASSWORD.`,
    });
    return null;
  }
  return { email: creds.email as string, password: creds.password as string };
}

export async function loginViaUi(
  page: Page,
  creds: { email: string; password: string },
  nextPath = "/virtual-office",
) {
  await page.goto(`/virtual-office/login?next=${encodeURIComponent(nextPath)}`);
  await page.getByPlaceholder("Email").fill(creds.email);
  await page.getByPlaceholder("Contraseña").fill(creds.password);
  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/login") &&
      response.request().method() === "POST",
  );

  await page.getByRole("button", { name: /ingresar/i }).click();

  const loginResponse = await loginResponsePromise;
  expect(loginResponse.ok()).toBeTruthy();
  await page.waitForLoadState("networkidle");
}

export async function assertAuthenticatedRole(page: Page, role: QaRole) {
  const response = await page.request.get("/api/auth/me");
  expect(response.ok()).toBeTruthy();
  const json = await response.json();
  expect(json.authenticated).toBe(true);
  expect(json.user.role).toBe(role);
}

export async function logoutViaUi(page: Page) {
  const button = page.getByRole("button", { name: /cerrar sesión/i });
  await expect(button).toBeVisible();
  await button.click();
}
