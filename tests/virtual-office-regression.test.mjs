import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

test("policy v2 keeps the expected matrix for users, properties and blogs", () => {
  const source = read("src/lib/auth/policy-v2.ts");

  assert.match(
    source,
    /\[Role\.INMOBILIARIA\]:\s*\{[\s\S]*users:\s*\{[\s\S]*create:\s*\["advisor_users"\][\s\S]*read:\s*\["advisor_users"\][\s\S]*update:\s*\["advisor_users"\][\s\S]*delete_soft:\s*\["advisor_users"\]/,
  );
  assert.match(
    source,
    /\[Role\.INMOBILIARIA\]:\s*\{[\s\S]*properties:\s*\{[\s\S]*create:\s*NONE[\s\S]*read:\s*\["advisor_properties"\][\s\S]*update:\s*\["advisor_properties"\][\s\S]*delete_soft:\s*\["advisor_properties"\]/,
  );
  assert.match(
    source,
    /\[Role\.ASESOR\]:\s*\{[\s\S]*advisor_core:\s*\{[\s\S]*read:\s*\["own"\][\s\S]*update:\s*\["own"\]/,
  );
  assert.match(
    source,
    /\[Role\.ADMIN\]:\s*\{[\s\S]*blogs:\s*\{[\s\S]*create:\s*\["all"\][\s\S]*read:\s*\["all"\][\s\S]*update:\s*\["all"\][\s\S]*delete_soft:\s*\["all"\]/,
  );
});

test("menu aligns with role visibility in the new policy", () => {
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
    /label:\s*"Usuarios"[\s\S]*roles:\s*\["ADMIN",\s*"INMOBILIARIA"\]/,
  );
});

test("dashboard no longer suggests invalid actions for inmobiliaria", () => {
  const source = read(
    "src/app/(virtual-office)/virtual-office/(protected)/page.tsx",
  );

  assert.match(
    source,
    /Mantén tu landing actualizada, crea asesores y usuarios de asesores, y supervisa que las propiedades de tu equipo estén completas\./,
  );
  assert.match(source, /const canSeeUsers = can\(session, "users", "read"\)/);
  assert.match(
    source,
    /label:\s*"Usuarios"[\s\S]*href:\s*"\/virtual-office\/usuarios"/,
  );
});

test("users scope keeps inmobiliaria limited to advisor users of its tenant", () => {
  const source = read("src/lib/auth/users.ts");

  assert.match(source, /scope === "advisor_users"/);
  assert.match(
    source,
    /Las inmobiliarias solo pueden gestionar usuarios de asesores de su tenant\./,
  );
  assert.match(source, /role:\s*Role\.ASESOR/);
  assert.match(source, /advisorId:\s*\{\s*in:\s*advisors\.map/);
});

test("property rules keep inmobiliaria creation blocked and advisor ownership scoped", () => {
  const source = read("src/lib/virtualoffice/properties.ts");
  const createPage = read(
    "src/app/(virtual-office)/virtual-office/(protected)/propiedades/new/page.tsx",
  );

  assert.match(source, /const propertyScope = scopeFor\(/);
  assert.match(source, /propertyScope === "advisor_properties"/);
  assert.match(source, /inmobiliariaId = advisor\.inmobiliariaId \?\? null/);
  assert.match(createPage, /if\s*\(!canCreateProperty\(session\)\)/);
});

test("blog persistence writes and reads explicit ownership", () => {
  const schema = read("prisma/schema.prisma");
  const blogLib = read("src/lib/virtualoffice/blog.ts");
  const collectionRoute = read("src/app/api/virtualoffice/blog/route.ts");
  const itemRoute = read("src/app/api/virtualoffice/blog/[id]/route.ts");

  assert.match(schema, /enum BlogOwnerType/);
  assert.match(schema, /ownerType\s+BlogOwnerType\?/);
  assert.match(schema, /ownerId\s+String\?/);
  assert.match(blogLib, /ownerTypeFromDbValue/);
  assert.match(blogLib, /ownerTypeToDbValue/);
  assert.match(collectionRoute, /ownerType:\s*ownerTypeToDbValue\(ownership\.ownerType\)/);
  assert.match(itemRoute, /ownerType:\s*ownerTypeToDbValue\(ownership\.ownerType\)/);
});

test("inmobiliaria landing persistence uses a dedicated relation with fallback", () => {
  const schema = read("prisma/schema.prisma");
  const repo = read("src/lib/virtualoffice/inmobiliarias.ts");
  const publicPage = read(
    "src/app/[locale]/(public)/bienes-raices/inmobiliarias/[slug]/page.tsx",
  );

  assert.match(schema, /model InmobiliariaLanding/);
  assert.match(schema, /landing\s+InmobiliariaLanding\?/);
  assert.match(repo, /resolveLandingThemeFromRecord/);
  assert.match(repo, /tx\.inmobiliariaLanding\.create/);
  assert.match(repo, /tx\.inmobiliariaLanding\.upsert/);
  assert.match(
    publicPage,
    /\(agency\.landing\?\.deletedAt \? null : agency\.landing\?\.themeJson\) \?\?[\s\S]*agency\.themeJson/,
  );
});

test("backfill script covers phase 9 data migration", () => {
  const source = read("scripts/backfill-phase9-persistence.cjs");

  assert.match(source, /prisma\.inmobiliariaLanding\.(create|update)/);
  assert.match(source, /ownerType/);
  assert.match(source, /ownerId/);
  assert.match(source, /unresolvedAdminOrBloggerPosts/);
});

test("protected pages keep denied states instead of server failures", () => {
  const workflow = read(
    "src/app/(virtual-office)/virtual-office/(protected)/workflow/page.tsx",
  );
  const users = read(
    "src/app/(virtual-office)/virtual-office/(protected)/usuarios/page.tsx",
  );
  const inmobiliaria = read(
    "src/app/(virtual-office)/virtual-office/(protected)/inmobiliaria/page.tsx",
  );

  assert.match(workflow, /await requireAdminSession\(\)/);
  assert.match(users, /No tienes permisos|Sin permisos|Forbidden/);
  assert.match(inmobiliaria, /No tienes permisos|Sin permisos|Forbidden/);
});
