import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Support local Next.js configuration while preserving environment variables
// supplied by the deployment environment.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});

