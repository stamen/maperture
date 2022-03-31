import { branchPattern } from './config';

const branchToken = '{branch}';
const styleToken = '{style}';

const createBranchUrl = (branchName, selectedStyle) => {
  const { pattern } = branchPattern;
  return pattern
    .replace(branchToken, branchName)
    .replace(styleToken, selectedStyle);
};

export { createBranchUrl };
