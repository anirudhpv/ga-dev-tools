# Handoff: ga-dev-tools fork

> **Two-repo setup (decided 2026-10-13)**
>
> - **This repo, `anirudhpv/ga-dev-tools-classic`** (GitHub fork of Google's repo):
>   Google's Gatsby app with our fixes. Generic fixes also go to Google as pull requests,
>   signed as Anirudh Venkat `<16452894+anirudhpv@users.noreply.github.com>` with no
>   Claude attribution (the owner signs Google's individual CLA). Moves to the Cloudflare
>   address `ga-dev-tools-classic.ballp.workers.dev` once Pro is ready.
> - **`anirudhpv/ga-dev-tools-pro`** (private, new): a rebuild in Vite + React + Mantine
>   with its own branding, starting with the Query Explorer. When it's ready it
>   takes over the main address `ga-dev-tools.ballp.workers.dev`.

Context for a new Claude Code session picking up this project.

## Goal

Run our own improved version of Google's GA Demos & Tools
(fork of `googleanalytics/ga-dev-tools`), hosted on Cloudflare Pages.

## Current state (done)

- `main` was reset to upstream `googleanalytics/ga-dev-tools` main (`14217f4`),
  plus two commits:
  - `7042cf3`: fixes 3 TypeScript errors in Query Explorer caused by newer
    `@types/gapi.client.analyticsdata` (there is no root lockfile, so deps float).
  - `51d23d9`: adds `yarn build:cloudflare` (`scripts/write-env.js` writes
    `.env.production` from env vars, then `gatsby build`). The env-writing step
    was tested; a full `build:cloudflare` run has **not** been tested yet.
- The previous fork attempt is preserved in branch `archive/old-main`.
- The site runs locally on the owner's Windows machine (`yarn start:app:production`,
  http://localhost:5000) and Google sign-in works.
- `yarn check-types` passes. `gatsby build` succeeds. Jest tests have **not** been run.

## Decisions made

- **Hosting: Cloudflare Pages**, not Firebase. Firebase project IDs are not needed.
- **Drop the Bit.ly link-shortening feature.** No Bit.ly keys or secrets.
- **Secrets: none needed.** `GAPI_CLIENT_ID` (Google OAuth client ID) is public;
  security comes from the OAuth client's Authorized JavaScript origins.
  `GA_MEASUREMENT_ID` is optional and also public.

## Next steps

### 1. Remove the Bit.ly feature (done)

Removed the Shorten link UI, `bitly-auth` page, `functions/`, the `deploy-functions`
command and the Bit.ly config prompts. `check-types`, CampaignURLBuilder Jest tests and
`yarn build:cloudflare` pass. Pages also get `noindex` via `static/_headers` and a
robots meta tag in `gatsby-ssr.tsx` (owner's rule: keep deployed sites out of search).

### 2. Deploy to Cloudflare Pages

Option A, Git-connected (auto-deploys on every push to `main`). Dashboard:
Workers & Pages → Create → Pages → Connect to Git → `anirudhpv/ga-dev-tools`, branch `main`.

| Setting                       | Value                                           |
| ----------------------------- | ----------------------------------------------- |
| Framework preset              | None                                            |
| Build command                 | `yarn install && yarn build:cloudflare`         |
| Output directory              | `public`                                        |
| Env `GAPI_CLIENT_ID`          | the Google OAuth client ID (public, not secret) |
| Env `NODE_VERSION`            | `22`                                            |
| Env `PUPPETEER_SKIP_DOWNLOAD` | `1`                                             |
| Env `SKIP_DEPENDENCY_INSTALL` | `1` (stops Pages' own npm install; we use yarn) |

Option B, manual from the CLI: owner runs `npx wrangler login` once, then
`yarn build:cloudflare` (with `GAPI_CLIENT_ID` set, or an existing `.env.production`),
`npx wrangler pages project create ga-dev-tools`, `npx wrangler pages deploy public`.

After the first deploy, add the `https://<project>.pages.dev` URL to the OAuth
client's **Authorized JavaScript origins** in Google Cloud Console.

### 3. Modernise the UI (planned, on hold by owner's choice)

Decisions so far (2026-10-13):

- **Focus: Query Explorer.** Other tools are lower priority.
- **Library: Mantine** (independent, MIT). Owner prefers tools not owned by Vercel,
  so shadcn/ui is out.
- **Brand:** Inter font; orange `#e8793a` / `#d4662a` for primary
  buttons (135deg gradient, pill-shaped, soft orange glow); teal `#5ba4a4` for accents
  and links; dark navy/black background (`#020205`, `#0f1a2e`, `#0a1119`); glass cards
  (white at 4-5% opacity, 12-20px corners); inputs with 8px corners and a white 10%
  border.
- **Theme: dark by default, with a switch to light mode.**
- **Plan:** build a pilot Query Explorer on a separate route (e.g.
  `/ga4/query-explorer-beta/`) that reuses the existing hooks (`useInputs`,
  `useMakeRequest`, `useAccounts`, `useDimensionsAndMetrics`) and only replaces the UI.
  Review it with the owner, then decide whether to roll it out to the other tools.

Style regressions from upstream's makeStyles → `styled()` codemod (commit `598a24f`) were
fixed in `3dc7e49` and `092dca5`. Still open: React hydration errors #418/#423 on the
Campaign URL Builder (present upstream too).

## Gotchas

- Owner is on **Windows / PowerShell**. Use `;` not `&&` in PowerShell 5.
- The local clone is at `C:\Users\aniru\Documents\Projects\ga-dev-tools\ga-dev-tools`
  (nested). The outer folder is not a repo; its `node_modules`/`yarn.lock` are leftovers.
- Install: `yarn`, then `cd lib; yarn; cd ..`. The `re2` node-gyp error in `lib` is an
  optional dependency and safe to ignore.
- `yarn prettier` runs `prettier --write` on the **whole repo**. Use
  `npx prettier --check <files>` instead.
- There is no root lockfile upstream, so dependency versions float. Consider committing
  a `yarn.lock` once things are stable.
- First `gatsby develop` is slow on Windows. Adding a Windows Defender exclusion for the
  repo folder helps. The `'WMIC' is not recognized` message is harmless.
- `yarn start:app:production` prompts for config: only the Google client ID matters;
  skip the rest. Re-run prompts with `yarn check-config`.
- Never commit `.env*` files (already gitignored).
