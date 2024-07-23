<script>
  import hat from 'hat';
  import {
    maps as mapsStore,
    stylePresets as stylePresetsStore,
    config as configStore,
  } from '../stores';
  import { createBranchUrl } from '../branch-utils';
  import { getRenderers } from '../renderers';
  import MapStyleInput from './MapStyleInput.svelte';

  export let index;
  export let stylesheet;

  let branchPatterns;
  configStore.subscribe(value => ({ branchPatterns } = value));

  let map;
  let branch;
  let renderer;
  let type;
  let url;
  let stylePresets = [];
  mapsStore.subscribe(maps => {
    map = maps.find(m => m.index === index);
    if (map) {
      branch = map.branch;
      renderer = map.renderer;
      type = map.type;
      url = map.url;
    }
  });

  // Used to create dropdown display with headings
  let dropdownDisplayOptions = {};
  // Actual values selected from dropdown matched by id
  let dropdownValues = [];

  let selectedValue;

  let rendererOptions = [];
  let rendererValue;

  // Selects the appropriate value from dropdownValues and adds any necessary key
  const setSelectedValue = () => {
    let nextValue;

    for (const dropdownValue of dropdownValues) {
      if (!!dropdownValue?.selected) {
        nextValue = dropdownValue;
      }
      if (dropdownValue?.type === 'sublist') {
        for (const dv of dropdownValue?.presets) {
          if (!!dv?.selected) {
            nextValue = dv;
          }
        }
      }
    }

    if (!nextValue) return;

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

  // Set renderer options based on the selected map's type
  const setRendererOptions = () => {
    rendererOptions = getRenderers(selectedValue, stylesheet?.sources);
    setRendererValue();
  };

  // Set renderer value based on the selected map's renderer or type if no
  // renderer is set
  const setRendererValue = () => {
    let updatedRenderer = renderer;

    const validRenderers = getRenderers(selectedValue, stylesheet?.sources).map(
      r => r.value
    );

    if (!updatedRenderer || !validRenderers.includes(updatedRenderer)) {
      updatedRenderer = validRenderers.includes(selectedValue.type)
        ? selectedValue.type
        : validRenderers[0];
    }

    rendererValue = updatedRenderer;
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
        selected: url === item?.url && type === item?.type,
        dropdownId: hat(),
        ...(item.type === 'sublist' && {
          presets: item.presets.map(v => ({
            ...v,
            dropdownType: 'preset',
            selected: url === v?.url && type === v?.type,
            dropdownId: hat(),
          })),
        }),
      }));

      dropdownValues = dropdownValues.concat(stylePresetValues);

      dropdownDisplayOptions['Presets'] = stylePresetValues.map(item => {
        return {
          text: item.name,
          ...(item.type !== 'sublist' && { dropdownId: item.dropdownId }),
          ...(item.type === 'sublist' && {
            type: 'sublist',
            presets: item.presets.map(v => ({
              text: v.name,
              dropdownId: v.dropdownId,
            })),
          }),
        };
      });
    }

    if (branchPatterns) {
      let patterns = [];
      for (const pattern of branchPatterns) {
        let preset = {
          name: pattern.name ?? pattern.id,
          type: 'sublist',
          dropdownId: hat(),
          presets: [],
        };

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
                pattern.type === type
              ),
              pattern: pattern.pattern,
              dropdownId: hat(),
            };
          });

          preset.presets = preset.presets.concat(branchValues);
        }

        patterns.push(preset);

        dropdownValues = dropdownValues.concat(patterns);

        dropdownDisplayOptions[`Styles on a branch`] = patterns.map(item => {
          return {
            text: item.name,
            ...(item.type !== 'sublist' && { dropdownId: item.dropdownId }),
            ...(item.type === 'sublist' && {
              type: 'sublist',
              presets: item.presets.map(v => ({
                text: v.name,
                dropdownId: v.dropdownId,
              })),
            }),
          };
        });
      }
    }

    // If no option has matched the URL, then it is custom
    const hasSelectedOption = dropdownValues.some(
      item => !!item?.selected || item?.presets?.some(v => !!v.selected)
    );

    // Create a custom value and display option
    const customValues = [
      {
        name: 'Fetch URL at...',
        dropdownType: 'custom',
        selected: !hasSelectedOption,
        type: 'mapbox-gl',
        renderer: 'mapbox-gl',
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
    setRendererOptions();
  });

  // On fetching a custom URL, update renderer options
  const onSetUrl = e => {
    selectedValue.url = e.detail.value;
    setRendererOptions();
  };

  const onSelectOption = e => {
    // TODO needs to handle nesting
    const { dropdownId } = e.detail;

    dropdownValues = dropdownValues.reduce((acc, v) => {
      let next = v;
      if (next?.type === 'sublist') {
        next.presets = next.presets.map(v => ({
          ...v,
          selected: v.dropdownId === dropdownId,
        }));
      } else {
        next = {
          ...next,
          selected: v.dropdownId === dropdownId,
        };
      }
      acc.push(next);
      return acc;
    }, []);

    setSelectedValue();
    setRendererOptions();
  };

  // Update map renderer in store
  const updateMapRenderer = renderer => {
    mapsStore.update(current => {
      return current.map((m, i) => (i !== index ? m : { ...m, renderer }));
    });
  };

  const onSelectRenderer = e => {
    rendererValue = e.detail.value;
  };

  // Handle updating the map store
  const onUpdateMapStore = e => {
    const { value } = e.detail;
    if (!value.isPolling) {
      const nextMap = { ...value, index, renderer };
      delete nextMap.dropdownId;
      mapsStore.update(current => {
        return current.map((m, i) => (i === index ? nextMap : m));
      });
    } else {
      mapsStore.update(current => {
        return current.map((m, i) => (i === index ? { ...m, ...value } : m));
      });
    }
  };

  const updateSelectedMapFromProps = nextValue => {
    const hasUnsetBranch =
      selectedValue?.dropdownType === 'branch' && !selectedValue?.url;

    // isPolling lets us continue polling while in the unset branch mode while letting
    // us reset this on a history change as isPolling is never saved in the hash
    if (!nextValue || (hasUnsetBranch && map.isPolling)) return;
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

  $: updateSelectedMapFromProps(map);

  $: updateMapRenderer(rendererValue);
</script>

<div class="map-style-input-wrapper">
  {#if dropdownValues}
    <MapStyleInput
      dropdownValue={selectedValue}
      {dropdownDisplayOptions}
      {rendererOptions}
      {rendererValue}
      {index}
      activeUrl={url}
      on:setUrl={onSetUrl}
      on:selectOption={onSelectOption}
      on:selectRenderer={onSelectRenderer}
      on:updateMapStore={onUpdateMapStore}
    />
  {/if}
</div>

<style>
  .map-style-input-wrapper {
    margin-top: 6px;
  }
</style>
