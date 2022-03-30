import { branchPattern } from "./config";

const branchToken = "{branch}";
const styleToken = "{style}";

const isBranchUrl = (url) => {
  const { pattern, styles } = branchPattern || {};
  if (!pattern || !styles) return false;
  const sections = pattern.split(branchToken).filter(Boolean);
  const knownUrlParts = sections.filter((s) => !s.includes(styleToken));
  const unknownUrlParts = sections.filter((s) => s.includes(styleToken));

  return (
    knownUrlParts.every((part) => url.includes(part)) &&
    unknownUrlParts.every((part) =>
      styles.some((s) => url.includes(part.replace(styleToken, s)))
    )
  );
};

const parseBranchUrl = (url) => {
  if (!isBranchUrl(url)) return null;
  const { pattern } = branchPattern;

  const splitToken = (str, token) => {
    const arr = str.split(token);
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 !== 0) {
        arr.splice(i, 0, token);
      }
    }
    return arr;
  };

  let patternParts = splitToken(pattern, branchToken);
  patternParts = patternParts
    .map((section) => {
      let nextSection = section;
      if (section.includes(styleToken)) {
        nextSection = splitToken(section, styleToken);
      }
      return nextSection;
    })
    .flat()
    .filter(Boolean);

  let urlTokenValues = [url];
  // This will leave us with an array of all parts of url that are token values
  patternParts.forEach((part) => {
    urlTokenValues = urlTokenValues
      .map((section) => section.split(part))
      .flat()
      .filter(Boolean);
  });

  const tokenOrder = patternParts.filter(
    (item) => item.startsWith("{") && item.endsWith("}")
  );

  if (tokenOrder.length !== urlTokenValues.length) {
    console.error("Trying to parse a url that does not fit the pattern.");
  }

  const parsed = tokenOrder.reduce((acc, token, i) => {
    let key = token.replace("{", "").replace("}", "");
    // Change key name to have better variable
    if (key === "style") {
      key = "styleId";
    }
    acc[key] = urlTokenValues[i];
    return acc;
  }, {});

  return parsed;
};

const createBranchUrl = (branchName, selectedStyle) => {
  const { pattern } = branchPattern;
  return pattern
    .replace(branchToken, branchName)
    .replace(styleToken, selectedStyle);
};

export { isBranchUrl, parseBranchUrl, createBranchUrl };
