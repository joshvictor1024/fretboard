window.addEventListener('load', async () => {
  // Tabs
  setupTabs();

  // Settings
  setupSettings();

  // Fretboard
  const output = d3.select('#fretboard');
  output.attr('viewBox', `0 0 ${spec.bound.w} ${spec.bound.h}`);

  // Input
  document.getElementById('input').value = patterns.mixed;
  updateFretboard();
  document.getElementById('input').addEventListener('input', () => {
    updateFretboard();
  });

  // Download
  document.getElementById('download-svg').addEventListener('click', () => {
    saveSvg(document.getElementById('fretboard'), 'image.svg');
  });
  document.getElementById('download-png').addEventListener('click', () => {
    savePng(document.getElementById('fretboard'), 'image.png');
  });

  // PNG dimension
  pngWidthEl = document.getElementById('png-width');
  pngWidthEl.addEventListener('change', function () {
    validatePngDimension();
    if (document.getElementById('png-keep-ratio').checked) {
      enforcePngRatio('w');
    }
    enforcePngDimensionRange();
  });
  pngHeightEl = document.getElementById('png-height');
  pngHeightEl.addEventListener('change', function () {
    validatePngDimension();
    if (document.getElementById('png-keep-ratio').checked) {
      enforcePngRatio('h');
    }
    enforcePngDimensionRange();
  });
});
