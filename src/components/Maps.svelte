<script>
  import MapsMirrorLayout from './MapsMirrorLayout.svelte';
  import MapsPhoneLayout from './MapsPhoneLayout.svelte';
  import MapsSwipeLayout from './MapsSwipeLayout.svelte';
  import MapsResponsiveLayout from './MapsResponsiveLayout.svelte';

  let { maps, mapState, viewMode, onMapState, onSetDimensions } = $props();

  const LAYOUTS = {
    phone: MapsPhoneLayout,
    mirror: MapsMirrorLayout,
    responsive: MapsResponsiveLayout,
    swipe: MapsSwipeLayout,
  };

  // Let our layout component handle arranging the maps on the page
  let LayoutComponent = $derived(LAYOUTS[viewMode] ?? MapsSwipeLayout);

  const handleMapMove = ({ options }) => {
    onMapState({ options });
  };

  const handleMapSetDimensions = ({ options }) => {
    onSetDimensions(options);
  };

  $effect(() => {
    if (viewMode !== 'responsive' && (mapState.height || mapState.width)) {
      handleMapSetDimensions({ options: { height: null, width: null } });
    }
  });
</script>

<LayoutComponent
  {maps}
  {mapState}
  onMapMove={handleMapMove}
  onMapSetDimensions={handleMapSetDimensions}
/>
