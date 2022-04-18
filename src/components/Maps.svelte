<script>
  import { createEventDispatcher } from 'svelte';
  import Map from './Map.svelte';
  import MapsMirrorLayout from './MapsMirrorLayout.svelte';
  import MapsPhoneLayout from './MapsPhoneLayout.svelte';
  import MapsSwipeLayout from './MapsSwipeLayout.svelte';

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
    case 'swipe':
    default:
      LayoutComponent = MapsSwipeLayout;
  }

  const handleMapMove = event => {
    dispatch('mapState', { options: event.detail.options });
  };
</script>

<svelte:component
  this={LayoutComponent}
  {maps}
  {mapState}
  on:mapMove={handleMapMove}
/>
