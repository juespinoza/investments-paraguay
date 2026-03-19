import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

test("permission matrix keeps advisor self-service and ownership rules", () => {
  const source = read("src/lib/auth/permissions.ts");

  assert.match(
    source,
    /advisors:\s*\{[\s\S]*update:\s*\[Role\.ADMIN,\s*Role\.INMOBILIARIA,\s*Role\.ASESOR\]/,
  );
  assert.match(
    source,
    /properties:\s*\{[\s\S]*create:\s*\[Role\.ADMIN,\s*Role\.INMOBILIARIA,\s*Role\.ASESOR\]/,
  );
  assert.match(
    source,
    /properties:\s*\{[\s\S]*delete:\s*\[Role\.ADMIN,\s*Role\.INMOBILIARIA,\s*Role\.ASESOR\]/,
  );
  assert.match(
    source,
    /users:\s*\{[\s\S]*read:\s*\[Role\.ADMIN\]/,
  );
});

test("menu keeps role isolation for admin, inmobiliaria and advisor", () => {
  const source = read("src/lib/virtualoffice/menu.ts");

  assert.match(
    source,
    /label:\s*"Workflow Admin"[\s\S]*roles:\s*\["ADMIN"\]/,
  );
  assert.match(
    source,
    /label:\s*"Mi landing"[\s\S]*roles:\s*\["ASESOR"\]/,
  );
  assert.match(
    source,
    /label:\s*"Usuarios"[\s\S]*roles:\s*\["ADMIN"\]/,
  );
});

test("advisor create page denies access when role cannot create advisors", () => {
  const source = read(
    "src/app/(virtual-office)/virtual-office/(protected)/asesores/new/page.tsx",
  );

  assert.match(source, /if\s*\(!canCreateAdvisor\(session\)\)/);
  assert.match(source, /No tienes permisos para crear asesores\./);
});

test("advisor self-service route redirects only the current advisor to its landing", () => {
  const source = read(
    "src/app/(virtual-office)/virtual-office/(protected)/mi-landing/page.tsx",
  );

  assert.match(source, /if\s*\(!isAdvisor\(session\)\s*\|\|\s*!session\.advisorId\)/);
  assert.match(source, /redirect\(`\/virtual-office\/asesores\/\$\{session\.advisorId\}\/edit`\)/);
});

test("property routes enforce ownership and derived assignments", () => {
  const createRoute = read("src/app/api/virtualoffice/properties/route.ts");
  const itemRoute = read("src/app/api/virtualoffice/properties/[id]/route.ts");
  const propertyLib = read("src/lib/virtualoffice/properties.ts");

  assert.match(createRoute, /if\s*\(!canCreateProperty\(session\)\)/);
  assert.match(createRoute, /const assignments = await resolvePropertyAssignments\(session, data\)/);
  assert.match(itemRoute, /await assertPropertyScope\(session, id\)/);
  assert.match(itemRoute, /if\s*\(!canDeleteProperty\(session\)\)/);
  assert.match(propertyLib, /const advisorId = isAdvisor\(session\)\s*\?[\s\S]*session\.advisorId/);
  assert.match(propertyLib, /inmobiliariaId = advisor\.inmobiliariaId \?\? null/);
});

test("session and logout keep auth hardening in place", () => {
  const sessionSource = read("src/lib/auth/session.ts");
  const loginSource = read("src/app/api/auth/login/route.ts");
  const logoutSource = read("src/app/api/auth/logout/route.ts");

  assert.match(sessionSource, /where:\s*\{\s*id:\s*userId,\s*deletedAt:\s*null\s*\}/);
  assert.match(loginSource, /where:\s*\{[\s\S]*email,[\s\S]*deletedAt:\s*null,[\s\S]*\}/);
  assert.match(logoutSource, /response\.cookies\.set\(cookieName,\s*""/);
  assert.match(logoutSource, /expires:\s*new Date\(0\)/);
});

test("workflow admin page stays protected behind requireAdminSession", () => {
  const source = read(
    "src/app/(virtual-office)/virtual-office/(protected)/workflow/page.tsx",
  );

  assert.match(source, /await requireAdminSession\(\)/);
});

test("user assignment rules reject invalid cross-role combinations", () => {
  const source = read("src/lib/auth/users.ts");

  assert.match(
    source,
    /Los usuarios de inmobiliaria deben tener una inmobiliaria asignada\./,
  );
  assert.match(
    source,
    /Los usuarios de inmobiliaria no deben tener un asesor asignado\./,
  );
  assert.match(
    source,
    /Los usuarios asesores deben tener un asesor asignado\./,
  );
  assert.match(
    source,
    /El asesor no pertenece a la inmobiliaria seleccionada\./,
  );
});

test("soft delete protections remain in place for users and inmobiliarias", () => {
  const usersSource = read("src/lib/auth/users.ts");
  const inmoSource = read("src/lib/virtualoffice/inmobiliarias.ts");

  assert.match(usersSource, /No puedes desactivar tu propio usuario\./);
  assert.match(inmoSource, /No se puede desactivar la inmobiliaria mientras tenga relaciones activas:/);
  assert.match(inmoSource, /dependencies\.users > 0/);
  assert.match(inmoSource, /dependencies\.advisors > 0/);
  assert.match(inmoSource, /dependencies\.properties > 0/);
});

test("inmobiliaria landing can only feature its own active properties", () => {
  const inmoSource = read("src/lib/virtualoffice/inmobiliarias.ts");

  assert.match(inmoSource, /async function validateFeaturedPropertyIds/);
  assert.match(inmoSource, /inmobiliariaId,/);
  assert.match(inmoSource, /deletedAt:\s*null/);
  assert.match(
    inmoSource,
    /Solo puedes destacar propiedades activas de tu propia inmobiliaria\./,
  );
});
