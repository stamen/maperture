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

  $: switch (viewMode) {
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

  $: {
    if (viewMode !== 'responsive' && (mapState.height || mapState.width)) {
      handleSetDimensions({
        detail: { options: { height: null, width: null } },
      });
    }
  }

  const handleMapMove = event => {
    dispatch('mapState', { options: event.detail.options });
  };

  const handleSetDimensions = event => {
    dispatch('setDimensions', { ...event.detail.options });
  };
</script>

<svelte:component
  this={LayoutComponent}
  {maps}
  {mapState}
  on:mapMove={handleMapMove}
  on:mapSetDimensions={handleSetDimensions}
/>
