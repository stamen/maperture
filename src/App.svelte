<script>
  import Maps from './components/Maps.svelte';
  import MapControls from './components/MapControls.svelte';
  import { writeHash } from './query';
  import { getInitialSettings } from './settings';
  import { mapboxGlAccessToken } from './config';
  import { fetchUrl } from './fetch-url';
  import throttle from 'lodash.throttle';

  let mapState = {};
  let maps = [];
  let settings = getInitialSettings();

  // Throttle writing to the hash since this can get invoked many times when
  // moving the map around
  const throttledWriteHash = throttle(() => {
    writeHash({ ...settings, ...mapState });
  }, 250);

  $: if (settings && mapState) throttledWriteHash();

  $: {
    const { bearing, center, pitch, showCollisions, zoom } = settings;
    mapState = { bearing, center, pitch, showCollisions, zoom };
  }

  $: {
    maps = settings.maps.map((map, index) => ({ ...map, index }));
  }

  const handleChangeMap = async function (event) {
    const { prevUrl, nextUrl, index } = event;
    let nextMap;
    if (maps[index].url !== prevUrl) return;
    let nextMaps = maps;
    
    try {
      const data = await fetchUrl(nextUrl);
      // TODO make a better check that it is style and not arbitrary object
      if (data && typeof data === 'object') {
        // TODO create checks by type for non-mapbox maps
        nextMap = { id: data.id, index, name: data.name, type: 'mapbox-gl', url: data };
        nextMaps.splice(index, 1, nextMap);
        maps = nextMaps;

        // Simple polling for any style on localhost
        if (nextUrl.includes('localhost')) {
          setTimeout(() => handleChangeMap({ prevUrl: data, nextUrl, index }), 5000)
        }

        return { url: nextUrl };
      }
    } catch (err) {
      return { url: nextUrl, error: new Error('Style was not found.') };
    }
  }

  const handleMapState = event => {
    mapState = {
      ...mapState,
      ...event.detail.options
    };
  };
</script>

<main>
  <Maps {maps} {mapState} on:mapState={handleMapState} {handleChangeMap} />

  <div class="map-controls-container">
    <MapControls
      mapboxGlAccessToken={mapboxGlAccessToken}
      {...mapState}
      on:mapState={handleMapState}
    />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .map-controls-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: absolute;
    top: 1em;
    width: 100%;
    z-index: 2000;
  }
</style>
