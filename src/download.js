/**
 * Taken from https://stackoverflow.com/a/46403589
 * and https://takuti.me/note/javascript-save-svg-as-image/
 */

const createStyleElementFromCSS = () => {
  const sheet = document.styleSheets[0];

  const styleRules = [];
  for (let i = 0; i < sheet.cssRules.length; i++) styleRules.push(sheet.cssRules.item(i).cssText);

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(styleRules.join(' ')));

  return style;
};

function createSvgUrl(svgEl) {
  const style = createStyleElementFromCSS();
  svgEl.insertBefore(style, svgEl.firstChild); // CSS must be explicitly embedded

  svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const svgData = svgEl.outerHTML;
  const preface = '<?xml version="1.0" standalone="no"?>\r\n';
  const svgBlob = new Blob([preface, svgData], {type: 'image/svg+xml;charset=utf-8'});

  style.remove(); // remove temporarily injected CSS

  return URL.createObjectURL(svgBlob);
}

function downloadUrl(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function saveSvg(svgEl, filename) {
  const svgUrl = createSvgUrl(svgEl);
  downloadUrl(svgUrl, filename);
  URL.revokeObjectURL(svgUrl);
}

function savePng(svgEl, filename) {
  const svgUrl = createSvgUrl(svgEl);
  const img = document.getElementById('img');

  const w = pngWidthEl?.value ?? 900;
  const h = pngHeightEl?.value ?? 300;
  img.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = w;
    canvas.height = h;

    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, w, h);

    downloadUrl(canvas.toDataURL(), filename);
    URL.revokeObjectURL(svgUrl);
  });
  img.src = svgUrl;
}

// ceil(n/k)*k
// k is integer
function toMultipleOf(n, k) {
  return Math.ceil(n / k) * k;
}

let pngWidthEl = null;
let pngHeightEl = null;
function validatePngDimension() {
  if (pngWidthEl == null || pngHeightEl == null) {
    return;
  }
  if (isNaN(Number(pngWidthEl.value)) && isNaN(Number(pngHeightEl.value))) {
    pngWidthEl.value = 900;
    pngHeightEl.value = 300;
  } else if (isNaN(Number(pngWidthEl.value))) {
    pngHeightEl.value = Math.ceil(Number(pngHeightEl.value));
    pngWidthEl.value = Number(pngHeightEl.value) * spec.bound.w;
  } else if (isNaN(Number(pngWidthEl.value))) {
    pngWidthEl.value = toMultipleOf(pngWidthEl.value, spec.bound.w);
    pngHeightEl.value = Number(pngWidthEl.value) / spec.bound.w;
  }
}

// Pass 'w' or 'h' to determine which is fixed.
function enforcePngRatio(fixed) {
  if (fixed === 'w') {
    pngWidthEl.value = toMultipleOf(pngWidthEl.value, spec.bound.w);
    pngHeightEl.value = Number(pngWidthEl.value) / spec.bound.w;
  }
  if (fixed === 'h') {
    pngWidthEl.value = Number(pngHeightEl.value) * spec.bound.w;
  }
}
