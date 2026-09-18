// Builds the style-picker dropdown's options and figures out which one
// matches a given map's current url/type/branch.
//
// Each option gets a stable, deterministic key derived from config data
// (a preset's own `id`, or a branch pattern's id/index plus style name)
// rather than a random id regenerated every time the option list is
// rebuilt. That regenerate-and-rematch-by-id approach is what the original
// MapStyleInputWrapper did (via `hat()`), and it's the same class of
// fragility as the reactive loops elsewhere in this app: selection state
// keyed by something that changes out from under it for no functional
// reason.
import { createBranchUrl } from './branch-utils';

export const CUSTOM_KEY = 'custom';

const presetKey = id => `preset:${id}`;
const branchKey = (patternKey, style) => `branch:${patternKey}:${style}`;

// options: Map<key, optionData>. optionData always has `kind`
// ('preset' | 'branch' | 'custom') plus whatever fields that kind needs.
export const buildStyleOptions = ({
  stylePresets = [],
  branchPatterns = [],
}) => {
  const options = new Map();
  const groups = [];

  if (stylePresets.length) {
    const items = stylePresets.map(preset => {
      if (preset.type === 'sublist') {
        return {
          label: preset.name,
          sublist: (preset.presets ?? []).map(nested => {
            const key = presetKey(nested.id);
            options.set(key, { ...nested, key, kind: 'preset' });
            return { key, label: nested.name };
          }),
        };
      }
      const key = presetKey(preset.id);
      options.set(key, { ...preset, key, kind: 'preset' });
      return { key, label: preset.name };
    });
    groups.push({ header: 'Presets', items });
  }

  const branchGroups = branchPatterns
    .map((pattern, patternIndex) => {
      if (!pattern.styles?.length) return null;
      // Config authors are expected to give each branch pattern an id (it's
      // how a map round-trips back to its pattern), but fall back to its
      // index so a missing id can't collide two different patterns' keys.
      const patternKey = pattern.id ?? patternIndex;
      const label = pattern.name ?? pattern.id;
      const sublist = pattern.styles.map(style => {
        const key = branchKey(patternKey, style);
        options.set(key, {
          key,
          kind: 'branch',
          name: `${label}: ${style} on...`,
          screenshotName: `${label}: ${style} on`,
          branchId: pattern.id,
          branchStyle: style,
          type: pattern.type,
          pattern: pattern.pattern,
        });
        return { key, label: `${label}: ${style} on...` };
      });
      return { label, sublist };
    })
    .filter(Boolean);
  if (branchGroups.length) {
    groups.push({ header: 'Styles on a branch', items: branchGroups });
  }

  options.set(CUSTOM_KEY, {
    key: CUSTOM_KEY,
    kind: 'custom',
    name: 'Fetch URL at...',
    type: 'mapbox-gl',
    renderer: 'mapbox-gl',
  });
  groups.push({
    header: 'Custom',
    items: [{ key: CUSTOM_KEY, label: 'Fetch URL at...' }],
  });

  return { groups, options };
};

const optionMatchesMap = (option, map) => {
  if (option.kind === 'preset') {
    return map.url === option.url && map.type === option.type;
  }
  if (option.kind === 'branch') {
    return (
      !!map.branch &&
      createBranchUrl(option.pattern, map.branch, option.branchStyle) ===
        map.url &&
      option.type === map.type
    );
  }
  return false; // custom is only ever a fallback, never matched directly
};

// The key of the option matching the map's current url/type/branch, or the
// custom-URL option's key if nothing matches. Used to seed and reconcile a
// component's own "currently selected" state — it always reflects the map
// as it actually is, never a pending/unsubmitted pick.
export const resolveKeyForMap = ({ options, map }) => {
  for (const option of options.values()) {
    if (optionMatchesMap(option, map)) return option.key;
  }
  return CUSTOM_KEY;
};

// A given option (whichever one is currently selected — matched or a fresh,
// not-yet-applied pick) with `defaultText` filled in for whichever text
// input that option kind shows.
export const withDefaultText = ({ option, map }) => {
  if (option.kind === 'branch') {
    return { ...option, defaultText: map?.branch ?? '' };
  }
  if (option.kind === 'custom') {
    return { ...option, defaultText: map?.url ?? '', url: map?.url };
  }
  return { ...option, defaultText: '' };
};
