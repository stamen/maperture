<script>
  import { round } from '../math';
  import { config as configStore } from '../stores';
  import throttle from 'lodash.throttle';
  import deepEqual from 'deep-equal';
  import { Loader } from '@googlemaps/js-api-loader';
  import { onMount } from 'svelte';

  let {
    id,
    bearing,
    center,
    pitch,
    zoom,
    mapStyle,
    numberOfMaps,
    onMapMount,
    onMapMove,
  } = $props();

  let map = $state();

  const loader = new Loader({
    apiKey: $configStore.googleMapsAPIKey,
    version: 'beta',
  });

  let mapId = $derived(mapStyle?.mapId);

  // We group map-view props here as they are useful in a few contexts
  let mapViewProps = $derived({ bearing, center, pitch, zoom });

  const getCurrentMapView = () => ({
    // Unlike maplibre/mapbox's getBearing()/getPitch() (always a number),
    // Google's getHeading()/getTilt() return undefined until the map has
    // been explicitly rotated/tilted at least once. Left as undefined, this
    // becomes NaN once it reaches another (linked) map's jumpTo(), which at
    // least one style here crashes on internally (globe projection's matrix
    // math doesn't tolerate a NaN bearing) — default to 0 to match what
    // every other renderer already reports for "no rotation/tilt set".
    bearing: map.getHeading() ?? 0,
    center: {
      lng: map.getCenter().lng(),
      lat: map.getCenter().lat(),
    },
    pitch: map.getTilt() ?? 0,
    zoom: map.getZoom() - 1,
  });

  const roundMapViewValues = mapView => ({
    bearing: round(mapView.bearing, 1),
    pitch: round(mapView.pitch, 1),
    center: {
      lat: round(mapView.center.lat, 6),
      lng: round(mapView.center.lng, 6),
    },
    zoom: round(mapView.zoom, 2),
  });

  const shouldUpdateMapView = () => {
    // Round values to account for differences between this maps API and others
    const currentView = roundMapViewValues(getCurrentMapView());
    const propView = roundMapViewValues(mapViewProps);
    return !deepEqual(currentView, propView);
  };

  onMount(() => {
    loader.load().then(() => {
      // Preserve drawing buffer for google map
      HTMLCanvasElement.prototype.getContext = (function (origFn) {
        return function (type, attribs) {
          attribs = attribs || {};
          attribs.preserveDrawingBuffer = true;
          return origFn.call(this, type, attribs);
        };
      })(HTMLCanvasElement.prototype.getContext);
      map = new google.maps.Map(document.getElementById(id), {
        center: mapViewProps.center,
        zoom: mapViewProps.zoom,
        mapId,
        disableDefaultUI: true,
        isFractionalZoomEnabled: true,
        fullscreenControl: false,
        zoomControl: false,
      });

      onMapMount(map);

      const throttledWheelHandler = throttle(() => {
        document
          .getElementById(id)
          ?.querySelector('div[tabindex="0"]')
          ?.focus();
      }, 250);

      // Also focus map on wheel (automatically focused on click)
      document
        .getElementById(id)
        .addEventListener('wheel', throttledWheelHandler, { passive: true });

      map.addListener('center_changed', handleMove);
      map.addListener('heading_changed', handleMove);
      map.addListener('tilt_changed', handleMove);
      map.addListener('zoom_changed', handleMove);
    });

    const handleMove = () => {
      const isFocused = document
        .getElementById(id)
        .contains(document.activeElement);
      if (isFocused && shouldUpdateMapView()) {
        onMapMove({ options: getCurrentMapView() });
      }
    };
  });

  $effect(() => {
    if (!map || !shouldUpdateMapView(mapViewProps)) return;
    map.moveCamera({
      center: {
        lat: center.lat,
        lng: center.lng,
      },
      zoom: zoom + 1,
      heading: bearing,
      tilt: pitch,
    });
  });

  // Resize the map when adding more maps and changing container size
  $effect(() => {
    if (!map || !numberOfMaps) return;
    const container = document.getElementById(id);
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      google.maps.event.trigger(map, 'resize');
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  });
</script>

<div {id} class="map"></div>

<style>
  .map {
    height: 100%;
  }
</style>
