# map-compare

A web application for comparing webmap styles.

## Get started

1.  Install the dependencies: `yarn install`
2.  Make a local config module: `cp src/config/local.example.js src/config/local.js` and edit the config file as appropriate
3.  Start the dev server: `yarn dev`

## Building and running in production mode

1.  Create an optimised version of the app: `yarn build`
2.  Deploy `public/` to a server.

## Local config

The compare tool allows you to use a local config file (`src/config/local.js`) to customize for your use case.

Here, you can customize the following options:

- `mapboxGlAccessToken`: Your Mapbox GL token to allow style reads
- `stylePresets`: A list of styles with urls to show in the dropdowns
- `branchPattern`: An object that specifies how to build a URL to fetch a style living on a branch with the following keys:
  - `pattern`: a tokenized url pattern using `{branch}` and `{style}` tokens
  - `styles`: an array specifying specific styles you can view on the specified branch

For more details on how these should look, see the example in [`src/config/local.example.js`](./src/config/local.example.js).
