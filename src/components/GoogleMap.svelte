<script>
  import { round } from '../math';
  import deepEqual from 'deep-equal';
  import { Loader } from '@googlemaps/js-api-loader';
  import { createEventDispatcher, onMount } from 'svelte';
  import { googleMapId, googleMapsAPIKey } from '../config';

  export let bearing;
  export let center;
  export let id;
  export let pitch;
  export let url;
  export let zoom;

  const dispatch = createEventDispatcher();

  let map;
  let mapViewProps = {};

  const loader = new Loader({
    apiKey: googleMapsAPIKey,
    version: 'beta',
  });

  // We group map-view props here as they are useful in a few contexts
  $: mapViewProps = { bearing, center, pitch, zoom };

  // We check map and mapViewProps here to ensure this reacts to changes to
  // either
  $: if (map && mapViewProps) updateMapFromProps();

  $: if (map && url) updateMapStyle();

  const getCurrentMapView = () => {
    return {
      // bearing: map.getHeading() || 0,
      bearing: 0,
      center: {
        lng: map.getCenter().lng(),
        lat: map.getCenter().lat(),
      },
      //pitch: map.getTilt(),
      pitch: 0,
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

  const updateMapStyle = () => {
    map.setStyle(url);
  };

  const updateMapFromProps = () => {
    if (shouldUpdateMapView(mapViewProps)) {
      map.moveCamera({
        center: {
          lat: center.lat,
          lng: center.lng,
        },
        zoom: zoom + 1,
        tilt: pitch,
      });
      //map.setTilt(pitch); // TODO restrict when google map enabled
      // heading: bearing, // TODO also update heading
    }
  };

  onMount(() => {
    loader.load().then(() => {
      map = new google.maps.Map(document.getElementById(id), {
        center: mapViewProps.center,
        zoom: mapViewProps.zoom,
        mapId: googleMapId, // TODO from map props
        isFractionalZoomEnabled: true,
        fullscreenControl: false,
        zoomControl: false,
      });

      document.getElementById(id).addEventListener('wheel', () => {
        // TODO make something more robust/universal
        document.getElementById(id).querySelector('div[tabindex="0"]').focus();
      });

      map.addListener('center_changed', handleMove);
      map.addListener('heading_changed', handleMove);
      map.addListener('tilt_changed', handleMove);
      map.addListener('zoom_changed', handleMove);
    });

    const handleMove = () => {
      const focused = document
        .getElementById(id)
        .contains(document.activeElement);
      if (focused && shouldUpdateMapView()) {
        dispatch('mapMove', { options: getCurrentMapView() });
      }
    };
  });
</script>

<div {id} class="map" />

<style>
  .map {
    height: 100%;
  }
</style>
