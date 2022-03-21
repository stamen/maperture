import { branchPattern } from './config';

const isBranchUrl = url => {
  const { pattern, styles } = branchPattern;
  const sections = pattern.split('{branch}');
  const knownUrl = sections.find(s => !s.includes('{style}'));
  const unknownUrl = sections.find(s => s.includes('{style}'));

  return (
    url.includes(knownUrl) &&
    styles.some(s => url.includes(unknownUrl.replace('{style}', s)))
  );
};

const parseBranchUrl = url => {
  const { pattern } = branchPattern;
  if (!isBranchUrl(url)) return null;
  let branch = '';
  let styleId = '';
  const urlPath = url.split('/');
  pattern.split('/').forEach((section, i) => {
    if (section === '{branch}') {
      branch = urlPath[i];
      return;
    }
    if (section === '{style}') {
      styleId = urlPath[i];
      return;
    }
    if (section !== urlPath[i]) {
      console.error('Problem parsing url.');
    }
  });
  return { styleId, branch };
};

const createBranchUrl = (branchName, selectedStyle) => {
  const { pattern } = branchPattern;
  return pattern
    .replace('{branch}', branchName)
    .replace('{style}', selectedStyle);
};

export { isBranchUrl, parseBranchUrl, createBranchUrl };
