#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ghpages = require('gh-pages');

const defaultLocalConfig = `
const mapboxGlAccessToken =
  'pk.eyJ1Ijoic3RhbWVuIiwiYSI6ImNrdXEwMXhxazE5anEyb2xpMzRxNDRlNjcifQ.-UzWaNfg5uegCCO_nzkI9w';

const stylePresets = [
  {
    id: 'mapbox-streets',
    name: 'Mapbox Streets',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/streets-v11',
  },
  {
    id: 'mapbox-outdoors',
    name: 'Mapbox Outdoors',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/outdoors-v11',
  },
  {
    id: 'mapbox-light',
    name: 'Mapbox Light',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/light-v10',
  },
  {
    id: 'mapbox-dark',
    name: 'Mapbox Dark',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/dark-v10',
  },
];

export { mapboxGlAccessToken, stylePresets };
`;

const localConfigPath = path.resolve(__dirname, '../public/config/local.js');

const actualConfig = fs.readFileSync(localConfigPath, 'utf8');

fs.writeFileSync(localConfigPath, defaultLocalConfig);

ghpages.publish('public', err => {
  if (err) console.error(err);
  // After deploy restore local.js to whatever user was using locally
  fs.writeFileSync(localConfigPath, actualConfig);
});
