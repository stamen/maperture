export const loadPresetsFromUrl = async url => {
  const response = await fetch(url);
  const json = await response.json();

  console.log(isValidPresetsArray(json));
  if (!isValidPresetsArray(json)) {
    console.warn(`Style presets at ${url} is not valid, check the format`);
    return [];
  }

  return json;
};

const isValidPresetsArray = json => {
  if (!Array.isArray(json)) return false;

  const requiredKeys = ['id', 'name', 'type'];

  const isValid = preset => {
    const presetKeys = Object.keys(preset);
    const missingKeys = requiredKeys.filter(key => !presetKeys.includes(key));
    return missingKeys.length > 0;
  };

  const presetsMissingKeys = json.filter(preset => {
    if (preset.type === 'sublist') {
      return preset.presets.every(isValid);
    } else {
      return isValid(preset);
    }
  });

  if (presetsMissingKeys.length > 0) return false;
  return true;
};
