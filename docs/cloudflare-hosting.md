# Cloudflare production hosting

The Cloudflare build is separate from the OpenAI Sites editing preview. It uses `vite.cloudflare.config.ts` and `build/cloudflare-worker.ts`; the production Worker does not use the Sites connector wrapper.

## Cloudflare resources

Create these resources in the Cloudflare account that owns `mohamedelkhoudimi.com`:

- D1 database named `portfolio`. Apply `drizzle/0000_fine_the_renegades.sql` once to create the game run and score tables.
- R2 bucket named `portfolio-media`. The television MP4 can be uploaded here later; it is not required for the rest of the site to run.

Set `CLOUDFLARE_D1_DATABASE_ID` in the Worker Builds environment to the ID shown for the new D1 database. The R2 name defaults to `portfolio-media`; set `CLOUDFLARE_R2_BUCKET_NAME` only if you choose a different name. Do not put these values in source control.

## GitHub build

Connect the `cloudflare-hosting` branch of `mtk1606/portfolio` to a Cloudflare Worker using Workers Builds.

- Build command: `pnpm run build:cloudflare`
- Deploy command: `pnpm run deploy:cloudflare`
- Production branch: `cloudflare-hosting`

Install the repository dependencies using the lockfile before the build. Verify the generated `workers.dev` address first, including `/`, `/resume.html`, `/after-hours.html`, `/api/arcade`, and `/api/video`.

Cloudflare deployment setup is being tested.

Before the first deploy, build with `CLOUDFLARE_D1_DATABASE_ID` set. Then initialize the tables once with `pnpm exec wrangler d1 execute portfolio --remote --file=drizzle/0000_fine_the_renegades.sql --config dist/server/wrangler.json`.

## Domain cutover

After the Worker passes the preview checks, open **Workers & Pages → the Worker → Settings → Domains & Routes → Add → Custom Domain**. Add `mohamedelkhoudimi.com` and `www.mohamedelkhoudimi.com`. Cloudflare creates the DNS records and certificates for Worker custom domains. Replace only conflicting website records for the apex and `www`; preserve mail-related DNS records.

The current scoreboard data and any video stored in the Sites-managed D1/R2 resources do not automatically move to the new Cloudflare account. The scoreboard starts empty unless its rows are exported and imported. The video can be re-uploaded to the new R2 bucket when ready.
