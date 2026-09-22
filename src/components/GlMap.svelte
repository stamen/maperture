<script>
  import deepEqual from 'deep-equal';
  import throttle from 'lodash.throttle';
  import { onMount, onDestroy } from 'svelte';
  import { config as configStore } from '../stores';
  import { buildPopupHtml } from '../map-popup';

  let {
    id,
    bearing,
    center,
    pitch,
    showCollisions,
    showBoundaries,
    zoom,
    mapStyle,
    numberOfMaps,
    onMapMount,
    onMapMove,
    mapRenderer,
  } = $props();

  let renderer;
  let map = $state();
  let popup = null;
  let isPopupOpen = false;

  // RTL plugin setup lives here (rather than eagerly at app startup) so it
  // stays scoped to whichever renderer library a map actually ends up
  // dynamically importing — setting it up front in App.svelte would force
  // both mapbox-gl and maplibre-gl to be statically bundled, defeating the
  // dynamic imports below (Vite can't code-split a module that's also
  // imported statically elsewhere). getRTLTextPluginStatus() guards each of
  // these against running more than once.
  const setRtlPlugin = lib => {
    if (lib.getRTLTextPluginStatus() !== 'unavailable') return;
    if (mapRenderer === 'maplibre-gl') {
      lib.setRTLTextPlugin(
        'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      );
    } else {
      lib.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.0/mapbox-gl-rtl-text.js',
      );
    }
  };

  // Mapbox and MapLibre share a Map component since they are so similar and utilize the same methods
  const importRenderer = async () => {
    if (mapRenderer === 'maplibre-gl') {
      await import('maplibre-gl/dist/maplibre-gl.css');
      renderer = await import('maplibre-gl');
      setRtlPlugin(renderer);
    } else if (mapRenderer === 'maptiler-sdk') {
      await import('@maptiler/sdk/dist/maptiler-sdk.css');
      renderer = await import('@maptiler/sdk');
      renderer.config.apiKey = $configStore.maptilerApiKey;
    } else {
      await import('mapbox-gl/dist/mapbox-gl.css');
      const mapboxModule = await import('mapbox-gl');
      // mapbox-gl is CJS with a single `export default`, so a dynamic
      // import()'s namespace object is an empty wrapper around it — Vite's
      // dev-time interop happens to expose things like `Map` directly on
      // that wrapper too, but plain property assignment (accessToken,
      // baseApiUrl) isn't one of them, and silently sets a property nothing
      // reads. `.default` is the actual mapbox-gl object every property
      // read/write needs to target.
      renderer = mapboxModule.default ?? mapboxModule;
      renderer.accessToken = $configStore.mapboxGlAccessToken;
      setRtlPlugin(renderer);

      // Set if your Mapbox flavored style uses a different server than `api.mapbox.com`.
      if ($configStore.mapboxBaseApiUrl) {
        renderer.baseApiUrl = $configStore.mapboxBaseApiUrl;
      }
    }
  };

  let style = $derived(mapStyle.style);
  let url = $derived(mapStyle.url);

  // We group map-view props here as they are useful in a few contexts
  let mapViewProps = $derived({ bearing, center, pitch, zoom });

  const getCurrentMapView = () => ({
    bearing: map.getBearing(),
    center: map.getCenter(),
    pitch: map.getPitch(),
    zoom: map.getZoom(),
  });

  const shouldUpdateMapView = mapView =>
    !deepEqual(getCurrentMapView(), mapView);

  onMount(() => {
    let resizeObserver;

    (async () => {
      await importRenderer();
      const glLibrary = renderer;

      map = new glLibrary.Map({
        container: id,
        style: url || style,
        canvasContextAttributes: { preserveDrawingBuffer: true },
        preserveDrawingBuffer: true,
        ...mapViewProps,
      });

      onMapMount(map);

      // Clicking (e.g. to drag-pan) focuses the canvas automatically, but
      // scrolling to zoom doesn't — so a zoom-only interaction would
      // otherwise never satisfy handleMove's isFocused check below, and its
      // resulting 'move' event would silently fail to sync to the other maps.
      const throttledWheelHandler = throttle(() => {
        document
          .getElementById(id)
          ?.querySelector('canvas[tabindex="0"]')
          ?.focus();
      }, 250);
      document
        .getElementById(id)
        ?.addEventListener('wheel', throttledWheelHandler, { passive: true });

      const handleMove = ({ origin }) => {
        const isFocused =
          document.getElementById(id)?.contains(document.activeElement) ??
          false;
        if (isFocused) {
          onMapMove({ options: getCurrentMapView() });
        }
      };

      map.on('move', e => {
        if (!e?.resize) {
          handleMove(e);
        }
      });

      map.on('click', e => {
        let renderedFeatures = map.queryRenderedFeatures(e.point);
        if (!renderedFeatures.length) return;
        if (!isPopupOpen) {
          popup = new glLibrary.Popup()
            .setLngLat(e.lngLat)
            .setHTML(buildPopupHtml(renderedFeatures))
            .setMaxWidth(360)
            .addTo(map);

          isPopupOpen = true;

          popup.on('close', () => {
            isPopupOpen = false;
          });
        } else {
          popup.remove();
          popup = null;
        }
      });

      // As of v3.0.0 maplibre no longer needs this resizing:
      // https://github.com/maplibre/maplibre-gl-js/blob/main/CHANGELOG.md#potentially-breaking-changes
      if (mapRenderer !== 'maplibre-gl' && mapRenderer !== 'maptiler-sdk') {
        map.once('render', () => {
          const container = document.getElementById(id);
          if (!container) return;
          resizeObserver = new ResizeObserver(() => {
            map.resize({ resize: true });
          });
          resizeObserver.observe(container);
        });
      }
    })();

    return () => resizeObserver?.disconnect();
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  $effect(() => {
    if (!map || !shouldUpdateMapView(mapViewProps)) return;
    map.jumpTo(mapViewProps);
  });

  $effect(() => {
    if (!map) return;
    map.setStyle(url || style);
  });

  // Show collisions on the map as desired
  $effect(() => {
    if (map) map.showCollisionBoxes = showCollisions;
  });

  // Show tile boundaries on the map as desired
  $effect(() => {
    if (map) map.showTileBoundaries = showBoundaries;
  });
</script>

<div {id} class="map"></div>

<style>
  .map {
    height: 100%;
  }

  :global(.popup-label-heading) {
    font-size: 14px;
    color: #666;
    font-weight: 200;
    font-style: italic;
  }

  :global(.popup) {
    min-width: 180px;
    padding-right: 12px;
    max-height: 240px;
    overflow: auto;
  }

  :global(.popup-feature) {
    margin-top: 18px;
    margin-left: 3px;
  }

  :global(.popup-feature):first-child {
    margin-top: 0;
  }

  :global(.popup-layer-id) {
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    margin-bottom: 6px;
  }

  :global(.popup-source) {
    font-weight: 600;
  }

  :global(.popup-source-layer) {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 6px;
    color: #666;
  }

  :global(.popup-property) {
    line-height: 6px;
    margin-top: 6px;
    margin-bottom: 3px;
    width: 100%;
    padding-bottom: 6px;
    border-bottom: 1px solid lightgray;
  }

  :global(.popup-no-properties) {
    border-bottom: 0px !important;
    color: lightgray;
  }

  :global(.popup-property-id) {
    font-weight: bold;
  }

  :global(.popup-property-value) {
    float: right;
  }

  :global(.mapboxgl-control-container .mapboxgl-ctrl-logo) {
    display: none;
  }
</style>
