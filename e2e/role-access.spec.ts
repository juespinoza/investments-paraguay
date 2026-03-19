import { expect, test } from "@playwright/test";
import {
  assertAuthenticatedRole,
  loginViaUi,
  skipIfMissingRoleCredentials,
  type QaRole,
} from "./helpers/auth";

const CASES: Array<{
  role: QaRole;
  allowed: string[];
  denied: string[];
}> = [
  {
    role: "ADMIN",
    allowed: [
      "/virtual-office",
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores",
      "/virtual-office/propiedades",
    ],
    denied: [],
  },
  {
    role: "INMOBILIARIA",
    allowed: [
      "/virtual-office",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores",
      "/virtual-office/propiedades",
    ],
    denied: [
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
    ],
  },
  {
    role: "ASESOR",
    allowed: [
      "/virtual-office",
      "/virtual-office/mi-landing",
      "/virtual-office/asesores",
      "/virtual-office/propiedades",
    ],
    denied: [
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
      "/virtual-office/inmobiliaria",
      "/virtual-office/asesores/new",
    ],
  },
  {
    role: "BLOGUERO",
    allowed: ["/virtual-office", "/virtual-office/blog"],
    denied: [
      "/virtual-office/workflow",
      "/virtual-office/usuarios",
      "/virtual-office/propiedades",
      "/virtual-office/inmobiliaria",
    ],
  },
];

for (const scenario of CASES) {
  test(`${scenario.role} sees only allowed protected routes`, async ({ page }, testInfo) => {
    const maybeCreds = skipIfMissingRoleCredentials(testInfo, scenario.role);
    test.skip(!maybeCreds, `Missing QA credentials for ${scenario.role}.`);
    if (!maybeCreds) return;
    const creds = maybeCreds;

    await loginViaUi(page, creds);
    await assertAuthenticatedRole(page, scenario.role);

    for (const path of scenario.allowed) {
      await page.goto(path);
      await expect(page).toHaveURL(
        new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      );
      await expect(
        page.getByText(/No tienes permisos|Forbidden|Unauthorized/),
      ).toHaveCount(0);
    }

    for (const path of scenario.denied) {
      await page.goto(path);
      await expect(
        page.getByText(/No tienes permisos|Forbidden|Unauthorized/),
      ).toBeVisible();
    }
  });
}
