<script>
  import { fetchErrorStore } from './stores/fetch-error-store';
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

  const isMapboxUrl = url => {
    if (typeof url !== 'string') return false;
    const hasMapboxFormat = url.startsWith('mapbox://styles/') && url.split('/').length === 5;
    return hasMapboxFormat;
  }

  const handleChangeMap = event => {
    const { prevUrl, nextUrl, index } = event.detail;
    let nextMap;
    if (maps[index].url !== prevUrl) return;
    let nextMaps = maps;
    let url = nextUrl;
    
    if (isMapboxUrl(nextUrl)) {
      const [ , , , userName, styleId ] = nextUrl.split('/');
      url = `https://api.mapbox.com/styles/v1/${userName}/${styleId}?title=true&access_token=${mapboxGlAccessToken}`;
    }

    fetchUrl(url).then(data => {
      // Special handling to error on Mapbox style url since it returns successfully with an error
      if (isMapboxUrl(nextUrl) && data.message) throw new Error(data.message);
      // TODO make a better check that it is style and not arbitrary object
      if (data && typeof data === 'object') {
        // TODO create checks by type for non-mapbox maps
        nextMap = { id: data.id, index, name: data.name, type: 'mapbox-gl', url: isMapboxUrl(nextUrl) ? nextUrl : data };
        nextMaps.splice(index, 1, nextMap);
        maps = nextMaps;
      }
    }).catch(() => {
      fetchErrorStore.set({ [nextUrl]: 'Style was not found.' });
    });
  }

  const handleMapState = event => {
    mapState = {
      ...mapState,
      ...event.detail.options
    };
  };
</script>

<main>
  <Maps {maps} {mapState} on:mapState={handleMapState} on:mapChange={handleChangeMap} />

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
