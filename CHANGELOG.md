## Unreleased

## 0.16.0

- Add multi-level dropdowns

## 0.15.1

- Update Maplibre GL to `v3.6.2`

## 0.15.0

- Switch to module for Stamen attribution
- Add CSS auto-prefixing to rollup config
- Add check for Mapbox URLs in source object of stylesheet
- Add labels when screenshotting

## 0.14.0

- Add Stamen attribution
- Add Stamen map tiles in GitHub Pages deploy
- Upgrade to latest version of `mapbox-gl`

## 0.13.1

- Update dropdown styling to accomodate long style names
- Add layer id to feature popup
- Fix bug for branch dropdown option while polling a style

## 0.13.0

- Add a Github Action for pushing to gh-pages on pushes to main
- Add support for Mapbox Atlas.
- Update app UI on browser history changes
- Validate location input on submit
- Add support for Tangram styles
- Switch out `BASE_PATH` for `window.location.pathname` in url updates
- Remove border on screenshots
- Add renderer dropdown for styles that support mulitple renderers
- Don't load geocoder without Mapbox token
- Add hotkeys for map controls

## 0.12.0

- Only add to browser history when updating non-location settings
- Add support for Leaflet styles
- Document gazetteer configuration

## 0.11.0

- Add highlight diff checkbox in swipe mode

## 0.10.1

- Better error reporting on fetching bad styles

## 0.10.0

- Multi-location view
- Allow polling for locally served styles on the same port via direct path

## 0.9.4

- Change hide UI keycode from `f` + `⌘` to `f` + `⌘` + `shift` to allow find on page

## 0.9.3

- Change hide UI keycode from `v` + `⌘` to `f` + `⌘` to allow copy/paste

## 0.9.2

- Copy the location text when clicking anywhere on the location control
- Automatically select the text in the location input on change
- Change hide UI keycode from `v` to `v` + `⌘` to prevent unintentionally hiding UI

## 0.9.1

- Start to standardize reactive blocks
- Look at map type in addition to url for initial dropdown selection

## 0.9.0

- Add support for MapLibre

## 0.8.0

- Add a PR template
- Change map orientation in mirror mode to tend towards portrait over landscape
- Add button to hide the UI

## 0.7.5

- Fix dropdown bug to pull correct value on load

## 0.7.4

- Rebundle package

## 0.7.3

- Refactor MapStyleInput into MapStyleInput and MapStyleInputWrapper

## 0.7.2

- Avoid reacting to hashchange when writing to hash
- Fix bug to not use style name field when creating URL from branch pattern

## 0.7.1

- Build package
- Add LICENSE

## 0.7.0

- Retain branch name when changing between branch patterns (#72)
- Watch hash for changes, update app state on change (#75)

## 0.6.0

- Rename this tool

## 0.5.0

- Implement popup to inspect rendered features (#67)
- Fix polling url issue (#64)

## 0.4.0

- Allow one map view
- Create responsive size mode

## 0.3.1

- Fix: Remote style presets now update dropdown

## 0.3.0

- Allow multiple branch patterns in local config as an array
- Add RTL plugin to render text correctly
- Add button to copy maps images to clipboard
