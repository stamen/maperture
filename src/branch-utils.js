import { branchPattern } from "./config";

const isBranchUrl = (url) => {
  const { pattern, styles } = branchPattern;
  const sections = pattern.split("{branch}").filter(Boolean);
  const knownUrlParts = sections.filter((s) => !s.includes("{style}"));
  const unknownUrlParts = sections.filter((s) => s.includes("{style}"));

  return (
    knownUrlParts.every((part) => url.includes(part)) &&
    unknownUrlParts.every((part) =>
      styles.some((s) => url.includes(part.replace("{style}", s)))
    )
  );
};

const parseBranchUrl = (url) => {
  const { pattern } = branchPattern;
  if (!isBranchUrl(url)) return null;

  const splitToken = (str, token) => {
    const arr = str.split(token);
    for (let i = 0; i < arr.length; i++) {
      if (i % 2 !== 0) {
        arr.splice(i, 0, token);
      }
    }
    return arr;
  };

  let patternParts = splitToken(pattern, "{branch}");
  patternParts = patternParts
    .map((section) => {
      let nextSection = section;
      if (section.includes("{style}")) {
        nextSection = splitToken(section, "{style}");
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
    .replace("{branch}", branchName)
    .replace("{style}", selectedStyle);
};

export { isBranchUrl, parseBranchUrl, createBranchUrl };
