<script>
  import { createEventDispatcher } from 'svelte';
  import MapsMirrorLayout from './MapsMirrorLayout.svelte';
  import MapsPhoneLayout from './MapsPhoneLayout.svelte';
  import MapsSwipeLayout from './MapsSwipeLayout.svelte';
  import MapsResponsiveLayout from './MapsResponsiveLayout.svelte';

  export let maps;
  export let mapState;
  export let viewMode;

  const dispatch = createEventDispatcher();

  // Let our layout component handle arranging the maps on the page
  let LayoutComponent;

  $: height = mapState.height;
  $: width = mapState.width;

  const setLayoutComponent = mode => {
    switch (mode) {
      case 'phone':
        LayoutComponent = MapsPhoneLayout;
        break;
      case 'mirror':
        LayoutComponent = MapsMirrorLayout;
        break;
      case 'responsive':
        LayoutComponent = MapsResponsiveLayout;
        break;
      case 'swipe':
      default:
        LayoutComponent = MapsSwipeLayout;
    }
  };

  const handleMapMove = event => {
    dispatch('mapState', { options: event.detail.options });
  };

  const handleSetDimensions = event => {
    dispatch('setDimensions', { ...event.detail.options });
  };

  $: setLayoutComponent(viewMode);

  $: if (viewMode !== 'responsive' && (height || width)) {
    handleSetDimensions({
      detail: { options: { height: null, width: null } },
    });
  }
</script>

<svelte:component
  this={LayoutComponent}
  {maps}
  {mapState}
  on:mapMove={handleMapMove}
  on:mapSetDimensions={handleSetDimensions}
/>
