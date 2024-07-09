# Maperture: Stamen's map compare tool

![Maperture Science](silly_maperture_logo.png?raw=true)

A web application for comparing webmap styles.

View a [demo here](https://stamen.github.io/maperture/).

![gif demo](Maperture_demo.gif?raw=true)

## Get started

1. Install the dependencies: `yarn install`
2. Make a local config module: `cp public/config/local.example.js public/config/local.js` and edit the config file as appropriate
3. Start the dev server: `yarn dev`

## Building and running in production mode

1. Create an optimised version of the app: `yarn build`. If you will serve the built app from a subpath such as `/compare-tool/` rather than the root domain, use the `BASE_PATH` environment variable to set it: `BASE_PATH=/compare-tool/ yarn build`
2. Deploy `public/` to a server.

## Local config

The compare tool allows you to use a local config file (`public/config/local.js`) to customize for your use case.

Here, you can customize the following options:

- `mapboxGlAccessToken`: Your Mapbox GL token to allow style reads
- `mapboxBaseApiUrl`: (optional) Support for a Mapbox flavored style that is served from a different server other than `api.mapbox.com`, e.g., Mapbox Atlas.
- `googleMapsAPIKey`: Your Google Maps API key to enable API usage
- `stylePresets`: A list of styles with urls to show in the dropdowns. Styles must have the following keys:
  - `id`: a unique id
  - `name`: a display name
  - `type`: the type of map or referencing a sublist of presets (`mapbox-gl`, `maplibre-gl`, `google`, `leaflet`, `sublist`)
  - `url`: (currently applies to `mapbox-gl`, `maplibre-gl`, and `leaflet` maps only) the style's url
  - `mapId`: (currently `google` only) the style's id
  - [`presets`]: used only with `type: sublist`, this allows one level of nesting to add an additional nested list of style presets following this format
- `branchPatterns`: An array of objects that specify how to build a URL to fetch a style living on a branch with the following keys:
  - `pattern`: a tokenized url pattern using `{branch}` and `{style}` tokens
  - `styles`: an array specifying specific styles you can view on the specified branch
  - `type`: the type of map (`mapbox-gl`, `maplibre-gl`, `google`, `leaflet`)
- `stylePresetUrls`: An array of URLs pointing to additional presets. URLs must point to JSON arrays containing objects of the same shape as those in `stylePresets`.
- `gazetteer`: An object that specifies the options available in the interface for navigating directly to specific geographic locations or changing other view options such as the pitch and zoom of the map. The object is a map of **option group names** to arrays of options. Each **option** is an object of names to map options to update.

  See `defaultGazetteer` in `src/make-config.js` for the default gazetteer, but as an example you might use:

  ```js
  const gazetteer = {
    Locations: [
      {
        'San Francisco, CA': {
          zoom: 18,
          center: { lng: -122.4193, lat: 37.7648 },
        },
      },
      {
        'Washington DC': {
          zoom: 12,
          center: { lng: -77.0435, lat: 38.9098 },
        },
      },
    ],
  };
  ```

  This creates an option group called **Locations** with two options (**San Francisco** and **Washington DC**). Selecting **San Francisco** or **Washington DC** zooms and centers the map view as specified.

For more details on how these should look, see the example in [`public/config/local.example.js`](./public/config/local.example.js).

## Setting up the app in your repo

### 1. Install this module into your repo.

`npm i github:stamen/maperture#<release>` or `yarn add github:stamen/maperture#<release>`

### 2. Set up files to serve app

When setting up the app in your repo, you'll want to create a directory that can house:

- An `index.html` file to serve the app
- A local config file (specified above)
- The copied over module files (see step 3)

Your `index.html` file should look like the following:

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />

    <title>Maperture</title>

    <link rel="stylesheet" href="./dist/bundle.css" />
  </head>

  <script type="module">
    import { startApp } from './dist/bundle.js';
    import * as localConfig from './local.js';

    startApp(document.body, { localConfig });
  </script>

  <body></body>
</html>
```

### 3. In addition, prior to serving the compare tool in your repo, you'll want to add a simple build script to your package that will copy our module files into the appropriate directory where `tool/dir/path/` is the directory you've created to serve the app from:

`"build-compare": "rm -rf tool/dir/path/dist && cp -r node_modules/maperture/dist tool/dir/path/dist"`

You will run this build script prior to serving the app from `index.html` or publishing the app anywhere to ensure files are up to date.

The final directory structure should look like:

```
root/
  - maperture/
    - dist/
      - bundle.js
      - bundle.js.map
      - bundle.css
    - index.html
    - local.js
```
