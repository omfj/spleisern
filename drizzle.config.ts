import { defineConfig } from "drizzle-kit";

export default defineConfig({
  driver: "d1",
  dialect: "sqlite",
  dbCredentials: {
    dbName: "spleis-db",
    wranglerConfigPath: "./wrangler.toml",
  },
  out: "./migrations",
  schema: "./app/db/schemas/index.ts",
});
