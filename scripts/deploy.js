#!/usr/bin/env node
const ghpages = require('gh-pages');

ghpages.publish(
  'public',
  {
    src: ['build/**', 'index.html', 'favicon.png'],
  },
  err => {
    console.error(err);
  }
);
