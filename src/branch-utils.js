const branchToken = '{branch}';
const styleToken = '{style}';

const createBranchUrl = (pattern, branchName, selectedStyle) => {
  return pattern
    .replace(branchToken, branchName)
    .replace(styleToken, selectedStyle);
};

export { createBranchUrl };
