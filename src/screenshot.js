import html2canvas from 'html2canvas';

export const captureMapsScreenshot = async viewMode => {
  const mapsView = document.getElementsByClassName('maps')[0];

  let adjustedLabels = [
    ...document.getElementsByClassName('screenshot-label-transparent'),
  ];
  adjustedLabels.forEach(el => {
    el.classList.remove('screenshot-label-transparent');
    el.classList.add('screenshot-label');
  });

  let adjustedBorders = [];
  // Remove border on mirror mode screenshot
  if (viewMode === 'mirror') {
    adjustedBorders = [
      ...document.getElementsByClassName('map-container-border'),
    ];
    adjustedBorders.forEach(el => {
      el.classList.remove('map-container-border');
      el.classList.add('map-container-border-transparent');
    });
  }

  const ignoreElements = el => {
    if (el.className && typeof el.className === 'string') {
      return el.className.includes('map-label');
    }
    return false;
  };

  html2canvas(mapsView, { ignoreElements }).then(canvas => {
    canvas.toBlob(blob =>
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]),
    );
  });

  // Cleanup labels
  adjustedLabels.forEach(el => {
    el.classList.remove('screenshot-label');
    el.classList.add('screenshot-label-transparent');
  });

  // Cleanup for mirror mode border
  if (viewMode === 'mirror') {
    adjustedBorders.forEach(el => {
      el.classList.remove('map-container-border-transparent');
      el.classList.add('map-container-border');
    });
  }
};
