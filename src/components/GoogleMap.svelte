<script>
  import { round } from '../math';
  import { config as configStore } from '../stores';
  import throttle from 'lodash.throttle';
  import deepEqual from 'deep-equal';
  import { Loader } from '@googlemaps/js-api-loader';
  import { createEventDispatcher, onMount } from 'svelte';

  export let id;
  export let bearing;
  export let center;
  export let pitch;
  export let zoom;
  export let mapStyle;
  export let numberOfMaps;

  let googleMapsAPIKey;
  configStore.subscribe(value => ({ googleMapsAPIKey } = value));

  const dispatch = createEventDispatcher();

  let map;
  let mapViewProps = {};

  const loader = new Loader({
    apiKey: googleMapsAPIKey,
    version: 'beta',
  });

  $: mapId = mapStyle?.mapId;

  // We group map-view props here as they are useful in a few contexts
  $: mapViewProps = { bearing, center, pitch, zoom };

  const getCurrentMapView = () => {
    return {
      bearing: map.getHeading(),
      center: {
        lng: map.getCenter().lng(),
        lat: map.getCenter().lat(),
      },
      pitch: map.getTilt(),
      zoom: map.getZoom() - 1,
    };
  };

  const shouldUpdateMapView = () => {
    // Round values to account for differences between this maps API and others
    const currentView = roundMapViewValues(getCurrentMapView());
    const propView = roundMapViewValues(mapViewProps);
    return !deepEqual(currentView, propView);
  };

  const roundMapViewValues = mapView => {
    return {
      bearing: round(mapView.bearing, 1),
      pitch: round(mapView.pitch, 1),
      center: {
        lat: round(mapView.center.lat, 6),
        lng: round(mapView.center.lng, 6),
      },
      zoom: round(mapView.zoom, 2),
    };
  };

  const updateMapFromProps = (map, mapView) => {
    if (!map || !shouldUpdateMapView(mapView)) return;
    map.moveCamera({
      center: {
        lat: center.lat,
        lng: center.lng,
      },
      zoom: zoom + 1,
      heading: bearing,
      tilt: pitch,
    });
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

      const throttledWheelHandler = throttle(() => {
        document.getElementById(id).querySelector('div[tabindex="0"]').focus();
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
        dispatch('mapMove', { options: getCurrentMapView() });
      }
    };
  });

  // We check map and mapViewProps here to ensure this reacts to changes to
  // either
  $: updateMapFromProps(map, mapViewProps);

  // Resize the map when adding more maps and changing container size
  $: if (map && numberOfMaps) {
    const container = document.getElementById(id);
    if (container) {
      const resizeObserver = new ResizeObserver(() => {
        google.maps.event.trigger(map, 'resize');
      });
      resizeObserver.observe(container);
    }
  }
</script>

<div {id} class="map" />

<style>
  .map {
    height: 100%;
  }
</style>
