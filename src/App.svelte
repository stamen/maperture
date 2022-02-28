<script>
  import Maps from './Maps.svelte';
  import MapControls from './MapControls.svelte';
  import { writeHash } from './query';
  import { getInitialSettings } from './settings';
  import { mapboxGlAccessToken } from './config';

  let mapSettings = getInitialSettings();

  $: writeHash(mapSettings);

  let mapProps = {};
  $: {
    const { bearing, center, pitch, showCollisions, zoom } = mapSettings;
    mapProps = { bearing, center, pitch, showCollisions, zoom };
  }
  let maps = [];

  $: {
    const { names, styles, watches } = mapSettings;
    maps = names.map((name, i) => ({
      ...mapProps,
      id: `map-${i}`,
      index: i,
      name,
      style: styles[i],
      type: 'mapbox-gl',
      watch: watches[i]
    }));
  }

  const handleMapState = event => {
    mapSettings = {
      ...mapSettings,
      ...event.detail.options
    };
  };
</script>

<main>
  <Maps 
    maps={maps}
    mapStateUpdateOrigin={mapSettings.mapStateUpdateOrigin}
    on:mapState={handleMapState}
  />

  <div class="map-controls-container">
    <MapControls
      mapboxGlAccessToken={mapboxGlAccessToken}
      bearing={mapSettings.bearing}
      center={mapSettings.center}
      pitch={mapSettings.pitch}
      showCollisions={mapSettings.showCollisions}
      zoom={mapSettings.zoom}
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
