<script>
  import hat from 'hat';
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
    config as configStore,
  } from '../stores';
  import { createBranchUrl } from '../branch-utils';
  import MapStyleInput from './MapStyleInput.svelte';

  export let index;

  let branchPatterns;
  configStore.subscribe(value => ({ branchPatterns } = value));

  let map;
  let url;
  let branch;
  let stylePresets = [];
  mapsStore.subscribe(maps => {
    map = maps.find(m => m.index === index);
    if (map) {
      branch = map.branch;
      url = map.url;
    }
  });

  // Used to create dropdown display with headings
  let dropdownDisplayOptions = {};
  // Actual values selected from dropdown matched by id
  let dropdownValues = [];

  let selectedValue;

  // Selects the appropriate value from dropdownValues and adds any necessary key
  const setSelectedValue = () => {
    let nextValue = dropdownValues.find(item => !!item.selected);

    // Don't mutate the dropdown values
    nextValue = JSON.parse(JSON.stringify(nextValue));

    // Set default text for the selected item's text input
    switch (nextValue.dropdownType) {
      case 'preset': {
        nextValue = { ...nextValue, defaultText: '' };
        break;
      }
      case 'branch': {
        nextValue = { ...nextValue, defaultText: branch ?? '' };
        break;
      }
      case 'custom': {
        nextValue = { ...nextValue, defaultText: url, url };
      }
    }

    selectedValue = nextValue;
  };

  // Creates dropdown values and display options for the style dropdown linked by ids
  const setInitialDropdownOptions = () => {
    // This can be called multiple times on load, so always start fresh to prevent
    // accidental persistance of stale ids
    dropdownDisplayOptions = {};
    dropdownValues = [];

    // Create values and displays for style presets
    if (stylePresets.length) {
      const stylePresetValues = stylePresets.map(item => ({
        ...item,
        dropdownType: 'preset',
        selected: url === item?.url && map.type === item?.type,
        dropdownId: hat(),
      }));

      dropdownValues = dropdownValues.concat(stylePresetValues);

      dropdownDisplayOptions['Presets'] = stylePresetValues.map(item => ({
        text: item.name,
        dropdownId: item.dropdownId,
      }));
    }

    // Create values and displays for branch options
    if (branchPatterns) {
      for (const pattern of branchPatterns) {
        if (pattern?.styles?.length) {
          const branchValues = pattern?.styles.map(s => {
            return {
              name: `${s.charAt(0).toUpperCase() + s.slice(1)} on...`,
              id: s,
              type: pattern.type,
              dropdownType: 'branch',
              selected: !!(
                branch &&
                createBranchUrl(pattern.pattern, branch, s) === url &&
                pattern.type === map.type
              ),
              pattern: pattern.pattern,
              dropdownId: hat(),
            };
          });

          dropdownValues = dropdownValues.concat(branchValues);

          dropdownDisplayOptions[
            `Styles on a branch${pattern.name ? `: ${pattern.name}` : ''}`
          ] = branchValues.map(item => ({
            text: item.name,
            dropdownId: item.dropdownId,
          }));
        }
      }
    }

    // If no option has matched the URL, then it is custom
    const hasSelectedOption = dropdownValues.some(item => !!item.selected);

    // Create a custom value and display option
    const customValues = [
      {
        name: 'Fetch URL at...',
        dropdownType: 'custom',
        selected: !hasSelectedOption,
        type: 'mapbox-gl',
        dropdownId: hat(),
      },
    ];

    dropdownValues = dropdownValues.concat(customValues);

    dropdownDisplayOptions['Custom'] = customValues.map(item => ({
      text: item.name,
      dropdownId: item.dropdownId,
    }));
  };

  const setInitialSelectedOption = () => {
    setInitialDropdownOptions();
    setSelectedValue();
  };

  // We can't do this onMount because the stylePresets store will
  // update more than once if there's style preset URLs
  stylePresetsStore.subscribe(value => {
    stylePresets = value;
    setInitialSelectedOption();
  });

  const onSelectOption = e => {
    const { dropdownId } = e.detail;
    // Set selected property on value
    dropdownValues = dropdownValues.map(v => ({
      ...v,
      selected: v.dropdownId === dropdownId,
    }));

    setSelectedValue();
  };

  // Handle updating the map store
  const onUpdateMapStore = e => {
    const { value } = e.detail;
    const nextMap = { ...value, index };
    delete nextMap.dropdownId;
    mapsStore.update(current => {
      return current.map((m, i) => (i === index ? nextMap : m));
    });
  };

  const updateSelectedFromProps = nextValue => {
    // Normally selectedValue should change map, but via props it's reversed
    // So that the bound selectedValue displays correctly
    if (
      nextValue.type !== selectedValue.type ||
      nextValue.url !== selectedValue.url
    ) {
      // Reset all selected options
      setInitialSelectedOption();
    }
  };

  $: updateSelectedFromProps(map);
</script>

<div class="map-style-input">
  {#if dropdownValues}
    <MapStyleInput
      dropdownValue={selectedValue}
      {dropdownDisplayOptions}
      activeUrl={url}
      on:selectOption={onSelectOption}
      on:updateMapStore={onUpdateMapStore}
    />
  {/if}
</div>

<style>
  .map-style-input {
    margin-top: 6px;
  }
</style>
