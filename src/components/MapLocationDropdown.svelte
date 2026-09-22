<script>
  import { untrack } from 'svelte';
  import { config as configStore } from '../stores';
  import Dropdown from './inputs/Dropdown/Dropdown.svelte';

  let { bearing, center, pitch, zoom, onMapState } = $props();

  let gazetteer = $derived($configStore.gazetteer);

  const setDecimal = (num, len) => Number.parseFloat(num).toFixed(len);

  const findSelectedFromProps = (gazetteer, props) => {
    if (!gazetteer) return '';
    const options = Object.keys(gazetteer).reduce(
      (acc, heading) => acc.concat(gazetteer[heading]),
      [],
    );

    const selectedValue = options.find(v => {
      const optionLoc = Object.values(v)[0];
      return Object.keys(optionLoc).every(k => {
        if (k === 'center' && props.center) {
          const { lng: optionLng, lat: optionLat } = optionLoc.center;
          const { lng, lat } = props.center;
          return (
            setDecimal(optionLng, 4) === setDecimal(lng, 4) &&
            setDecimal(optionLat, 4) === setDecimal(lat, 4)
          );
        }
        return setDecimal(optionLoc[k], 2) === setDecimal(props[k], 2);
      });
    });

    return selectedValue ? JSON.stringify(selectedValue) : '';
  };

  const parseSelected = selectedValue => {
    if (!selectedValue) return {};
    try {
      const value = JSON.parse(selectedValue);
      const label = Object.keys(value)[0];
      const options = value[label];
      return { label, options };
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  let selected = $state(
    findSelectedFromProps(gazetteer, { zoom, center, pitch, bearing }),
  );

  // Reconciles `selected` with the map's actual position whenever it
  // changes for a reason other than picking a dropdown entry here (a direct
  // pan, linked-map sync, etc). Reads `selected` via untrack() so this
  // depends only on the position props, never on its own output — the same
  // class of bug as https://svelte.dev/e/effect_update_depth_exceeded.
  // Deliberately never calls onMapState itself — only a genuine user pick
  // (onSelect below) should command a move; this only reflects where the
  // map already is.
  $effect(() => {
    const nextSelected = findSelectedFromProps(gazetteer, {
      zoom,
      center,
      pitch,
      bearing,
    });
    if (untrack(() => selected) !== nextSelected) {
      selected = nextSelected;
    }
  });

  const onSelect = v => {
    selected = v;
    const { options } = parseSelected(v);
    if (options) {
      onMapState({ options });
    }
  };

  let selectionOptions = $derived.by(() => {
    if (!gazetteer) return [];
    return Object.entries(gazetteer).reduce(
      (acc, [locationHeader, locations]) => {
        acc.push({ header: locationHeader });
        for (const location of locations) {
          const [label] = Object.entries(location)[0];
          acc.push({ label, value: JSON.stringify(location) });
        }
        return acc;
      },
      [],
    );
  });
</script>

{#if gazetteer}
  <div class="dropdown-container">
    <Dropdown
      placeholder={'Go to...'}
      options={selectionOptions}
      activeValue={selected}
      {onSelect}
      direction="down"
    />
  </div>
{/if}

<style>
  .dropdown-container {
    min-width: 140px;
  }
</style>
