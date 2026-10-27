import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configPath = resolve("dist/server/wrangler.json");
if (!existsSync(configPath)) {
  throw new Error("Cloudflare build output is missing. Run `pnpm run build:cloudflare` first.");
}

const config = JSON.parse(readFileSync(configPath, "utf8"));
const database = config.d1_databases?.find((binding) => binding.binding === "DB");
const bucket = config.r2_buckets?.find((binding) => binding.binding === "BUCKET");
if (!database?.database_id || database.database_id === "00000000-0000-4000-8000-000000000000") {
  throw new Error("Set CLOUDFLARE_D1_DATABASE_ID in the Cloudflare Worker build environment before deploying.");
}
if (!bucket?.bucket_name) {
  throw new Error("Set CLOUDFLARE_R2_BUCKET_NAME or use the default `portfolio-media` bucket.");
}

const wrangler = fileURLToPath(new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url));
const result = spawnSync(process.execPath, [wrangler, "deploy", "--config", configPath], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
