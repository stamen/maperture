<script>
  import { createEventDispatcher } from 'svelte';
  import { config as configStore } from '../stores';

  export let bearing;
  export let center;
  export let pitch;
  export let zoom;

  const dispatch = createEventDispatcher();

  let gazetteer;
  configStore.subscribe(value => ({ gazetteer } = value));

  const setDecimal = (num, len) => {
    return Number.parseFloat(num).toFixed(len);
  };

  const findSelectedFromProps = props => {
    if (!gazetteer) return '';
    const options = Object.keys(gazetteer).reduce((acc, heading) => {
      acc = acc.concat(gazetteer[heading]);
      return acc;
    }, []);

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

    const nextValue = selectedValue ? JSON.stringify(selectedValue) : '';

    return nextValue;
  };

  let selected = findSelectedFromProps({ zoom, center, pitch, bearing });

  const parseSelected = selectedValue => {
    if (!selectedValue) return {};
    try {
      const value = JSON.parse(selectedValue);
      const label = Object.keys(value)[0];
      const options = value[label];
      dispatch('mapState', { options });
      return { label, options };
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  const handleChangeLocation = () => {
    const { options } = parseSelected(selected);

    if (options) {
      dispatch('mapState', { options });
    }
  };

  const checkSelectedValue = props => {
    const nextSelected = findSelectedFromProps(props);
    if (selected !== nextSelected) {
      selected = nextSelected ?? '';
    }
  };

  $: checkSelectedValue({ zoom, center, pitch, bearing });

  $: handleChangeLocation(selected);
</script>

{#if gazetteer}
  <select id="locations" bind:value={selected}>
    {#each Object.keys(gazetteer) as locationHeader}
      <optgroup label={locationHeader}>
        <option value="" disabled selected hidden>Go to...</option>
        {#each gazetteer[locationHeader] as location}
          <option value={JSON.stringify(location)}
            >{Object.keys(location)[0]}</option
          >
        {/each}
      </optgroup>
    {/each}
  </select>
{/if}

<style>
</style>
