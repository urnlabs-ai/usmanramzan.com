# usmanramzan.com

The source for a consulting and technical writing site built with Astro. The site presents cloud and platform engineering experience, technical leadership, and selected articles.

## Requirements

- Node.js and npm

Dependencies and their lockfile are managed by `package.json` and `package-lock.json`.

## Local development

```sh
npm install
npm run dev
```

Astro prints the local development URL when the server starts. Other available commands are:

```sh
npm run build    # Build the static site into dist/
npm run preview  # Preview the built site locally
npm run og       # Generate the default and selected article Open Graph images
npm run check    # Validate the generated site after building
```

The `og` script uses an installed Chrome or Chromium executable (or the `CHROME_PATH` environment variable) and bundled font files. It writes generated images into `public/`.

## Project structure

- `src/pages/` contains the home, about, experience, FAQ, RSS, and writing routes.
- `src/content/blog/` contains Markdown articles loaded through Astro's content collections.
- `src/layouts/` and `src/styles/` hold the shared page layout and global styles.
- `src/data/` contains shared person data.
- `public/` contains static assets such as the portrait, favicon, and Open Graph images.

Astro is configured to build a static site, generate a sitemap for `https://usmanramzan.com`, and apply Tailwind CSS through Vite. `wrangler.jsonc` points Wrangler's static asset serving at `dist/`; the npm scripts do not include a deployment command.

## Consulting content and contact

- `src/data/consulting.ts` is the shared offer, contact email, and call CTA configuration.
- `/work-with-me/` explains engagement formats, pricing approach, availability, and call requests.
- The request form prepares a reviewed email draft; it does not submit to a server or reserve a calendar slot. A real calendar URL can replace the shared `callHref` when one is available.
- `hello@urnlabs.com` uses an existing active Cloudflare email routing rule. No new mailbox or provider was provisioned for this release.
- `src/data/case-studies.ts` holds anonymized summaries derived from the existing fractional CTO article.
- `src/data/recommendations.ts` holds short, verbatim excerpts from public LinkedIn recommendations, with source links. These describe earlier collaboration, not necessarily URN Labs consulting clients.
- Article `updatedDate` is for substantive editorial updates, not layout deployments. The original two articles retain their publication dates.

## Deployment

The `main` branch is the source of truth. Pull requests run the build and generated-site checks. The deployment workflow uses Wrangler 4; if `CLOUDFLARE_API_TOKEN` is unavailable, it explicitly reports that no automatic deployment occurred.

For manual deployment after successful checks and an authenticated Wrangler login:

```sh
npm run build
npm run check
npx wrangler@4.149.0 deploy
```

## Notes

This repository contains the website source and build configuration. It does not define a backend API or application service. Build, browser flows, and deployed routes are verified per release; consult the pull request for the current evidence.
