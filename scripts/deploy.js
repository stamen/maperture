#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ghpages = require('gh-pages');

const ghPagesConfig = fs.readFileSync(
  path.resolve(__dirname, '../public/config/gh-pages.js'),
  'utf8'
);

const localConfigPath = path.resolve(__dirname, '../public/config/local.js');

const actualConfig = fs.readFileSync(localConfigPath, 'utf8');

fs.writeFileSync(localConfigPath, ghPagesConfig);

ghpages.publish('public', err => {
  if (err) console.error(err);
  // After deploy restore local.js to whatever user was using locally
  fs.writeFileSync(localConfigPath, actualConfig);
});
