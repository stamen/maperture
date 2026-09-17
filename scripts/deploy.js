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

ghpages.publish(demoDir, err => {
  fs.rmSync(demoDir, { recursive: true, force: true });
  if (err) console.error(err);
});
