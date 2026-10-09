# usmanramzan.com

The source for a personal portfolio and technical writing site built with Astro. The site presents cloud and platform engineering experience, technical leadership, and selected articles.

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
```

The `og` script uses an installed Chrome or Chromium executable (or the `CHROME_PATH` environment variable) and bundled font files. It writes generated images into `public/`.

## Project structure

- `src/pages/` contains the home, about, experience, FAQ, RSS, and writing routes.
- `src/content/blog/` contains Markdown articles loaded through Astro's content collections.
- `src/layouts/` and `src/styles/` hold the shared page layout and global styles.
- `src/data/` contains shared person data.
- `public/` contains static assets such as the portrait, favicon, and Open Graph images.

Astro is configured to build a static site, generate a sitemap for `https://usmanramzan.com`, and apply Tailwind CSS through Vite. `wrangler.jsonc` points Wrangler's static asset serving at `dist/`; the npm scripts do not include a deployment command.

## Notes

This repository contains the website source and build configuration. It does not define a backend API or application service. Build and runtime compatibility were not tested as part of this README refresh.
