import { config as configStore } from './stores';

let branchPattern;
configStore.subscribe(value => ({ branchPattern } = value));

const branchToken = '{branch}';
const styleToken = '{style}';

const createBranchUrl = (branchName, selectedStyle) => {
  const { pattern } = branchPattern;
  return pattern
    .replace(branchToken, branchName)
    .replace(styleToken, selectedStyle);
};

export { createBranchUrl };
