// Build para Vercel (comando: `yarn build:vercel`).
//
// Las migraciones solo corren en producción. Los previews comparten hoy la
// base de producción, y una migración a medio terminar en una rama de
// trabajo dejó todos los deploys bloqueados (Prisma P3009, agosto 2026).
//
// - VERCEL_ENV=production: prisma migrate deploy, generate, validate y build.
//   Si la migración falla, el build falla y no se publica nada.
// - VERCEL_ENV=preview: sin migración, salvo que MIGRATE_ON_PREVIEW=true.
//   Activar esa variable solo cuando los previews tengan su propia base
//   (por ejemplo, un branch de Neon con su DATABASE_URL en el entorno Preview).
// - Local (sin VERCEL_ENV): sin migración.
import { spawnSync } from "node:child_process";

const vercelEnv = process.env.VERCEL_ENV ?? "local";
const migrateOnPreview = process.env.MIGRATE_ON_PREVIEW === "true";
const shouldMigrate =
  vercelEnv === "production" || (vercelEnv === "preview" && migrateOnPreview);

function run(command, args) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(`No se pudo ejecutar ${command}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\n${command} ${args.join(" ")} falló (código ${result.status}).`);
    process.exit(result.status ?? 1);
  }
}

console.log(`Entorno de Vercel: ${vercelEnv}`);

if (shouldMigrate) {
  run("prisma", ["migrate", "deploy"]);
} else {
  console.log(
    "Se omite prisma migrate deploy: solo corre en producción " +
      "(o en preview con MIGRATE_ON_PREVIEW=true).",
  );
}

run("prisma", ["generate"]);
run("prisma", ["validate"]);
run("next", ["build"]);
