# map-compare

A web application for comparing webmap styles.

## Get started

1. Install the dependencies: `yarn install`
2. Make a local config module: `cp src/config/local.example.js src/config/local.js` and edit the config file as appropriate
3. Start the dev server: `yarn dev`

## Building and running in production mode

1. Create an optimised version of the app: `yarn build`. If you will serve the built app from a subpath such as `/compare-tool/` rather than the root domain, use the `BASE_PATH` environment variable to set it: `BASE_PATH=/compare-tool/ yarn build`
2. Deploy `public/` to a server.

## Local config

The compare tool allows you to use a local config file (`src/config/local.js`) to customize for your use case.

Here, you can customize the following options:

- `mapboxGlAccessToken`: Your Mapbox GL token to allow style reads
- `googleMapsAPIKey`: Your Google Maps API key to enable API usage
- `stylePresets`: A list of styles with urls to show in the dropdowns. Styles must have the following keys:
  - `id`: a unique id
  - `name`: a display name
  - `type`: the type of map (`mapbox-gl`, `google`)
  - `options`: options specific to the type of map, which can include:
    - `url`: (currently `mapbox-gl` only) the style's url
    - `mapId`: (currently `google` only) the style's id
- `branchPattern`: An object that specifies how to build a URL to fetch a style living on a branch with the following keys:
  - `pattern`: a tokenized url pattern using `{branch}` and `{style}` tokens
  - `styles`: an array specifying specific styles you can view on the specified branch
  - `type`: the type of map (`mapbox-gl`, `google`)
- `stylePresetUrls`: An array of URLs pointing to additional presets. URLs must point to JSON arrays containing objects of the same shape as those in `stylePresets`.

For more details on how these should look, see the example in [`src/config/local.example.js`](./src/config/local.example.js).
