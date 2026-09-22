#!/usr/bin/env node
// Assembles a standalone demo site (built dist/ + index.html + the gh-pages
// config) in a scratch directory, the same shape as `example/`, and publishes
// it to the gh-pages branch. Assumes `dist/` has already been built (see the
// `deploy` script in package.json).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ghpages from 'gh-pages';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const demoDir = path.resolve(root, '.gh-pages-demo');

fs.rmSync(demoDir, { recursive: true, force: true });
fs.mkdirSync(demoDir);

fs.cpSync(path.resolve(root, 'dist'), path.resolve(demoDir, 'dist'), {
  recursive: true,
});
fs.copyFileSync(
  path.resolve(root, 'config/gh-pages.js'),
  path.resolve(demoDir, 'config.js'),
);
fs.copyFileSync(
  path.resolve(root, 'example/index.html'),
  path.resolve(demoDir, 'index.html'),
);

// In GitHub Actions, `actions/checkout` authenticates the *checked-out*
// repo's origin remote (via an extraheader in its local git config), but
// gh-pages clones the remote URL fresh into its own cache dir, which
// doesn't inherit that config — so it needs an explicitly token-embedded
// repo URL and a committer identity instead of relying on local git config.
const publishOptions =
  process.env.GITHUB_ACTIONS === 'true'
    ? {
        repo: `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/${process.env.GITHUB_REPOSITORY}.git`,
        user: {
          name: 'github-actions[bot]',
          email: 'github-actions[bot]@users.noreply.github.com',
        },
      }
    : {};

ghpages.publish(demoDir, publishOptions, err => {
  fs.rmSync(demoDir, { recursive: true, force: true });
  if (err) {
    console.error(err);
    process.exit(1);
  }
});
