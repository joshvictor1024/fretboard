// b ^ i
// i >= 0
function expInt(b, i) {
  result = 1;
  for (let j = 0; j < i; j++) {
    result = result * b;
  }
  return result;
}

// 1 + r^1 + ... + r^n
// For r < 1
function geometricSum(r, n) {
  // r set to 1 if (1-r) < 0.001
  return r > 0.999 ? n : (1 - expInt(r, n)) / (1 - r);
}

const spec = {
  bound: {
    w: 3, // Change width-to-height ratio.
    h: 1 // Leave as 1.
  },
  string: {
    w: 0.8,
    h: 0.8,
    count: 6
  },
  fret: {
    ratioOctave: 2,
    wFirstFret: 0.4,
    count: 8
  },
  marking: {
    size: 0.12,
    margin: 0.04
  },
  getLeft: function () {
    return this.bound.w * ((1 - this.string.w) / 2);
  },
  getRight: function () {
    return this.bound.w * ((1 + this.string.w) / 2);
  },
  getTop: function () {
    return this.bound.h * ((1 - this.string.h) / 2);
  },
  getBottom: function () {
    return this.bound.h * ((1 + this.string.h) / 2);
  },
  getStringSpace: function () {
    return this.string.h / (this.string.count - 1);
  },
  getStringPosition: function (s) {
    return this.getTop() + s * this.getStringSpace();
  },
  getFretRatio: function () {
    return Math.exp(-Math.log(this.fret.ratioOctave) / 12);
  },
  getFretPosition: function (f) {
    return this.getLeft() + geometricSum(this.getFretRatio(), f) * this.fret.wFirstFret;
  }
};

function generateStrings() {
  const result = [];
  for (let i = 0; i < spec.string.count; i++) {
    result.push({
      x1: spec.getLeft(),
      x2: spec.getRight(),
      y: spec.getStringPosition(i)
    });
  }
  return result;
}

function generateFrets() {
  const result = [];
  for (let i = 0; i < spec.fret.count; i++) {
    result.push({
      y1: spec.getTop(),
      y2: spec.getBottom(),
      x: spec.getFretPosition(i)
    });
  }
  return result;
}

function drawFretboard(output) {
  output
    .selectAll('.string')
    .data(generateStrings())
    .join('line')
    .classed('string', true)
    .attr('x1', (s) => s.x1)
    .attr('x2', (s) => s.x2)
    .attr('y1', (s) => s.y)
    .attr('y2', (s) => s.y);

  output
    .selectAll('.fret')
    .data(generateFrets())
    .join('line')
    .classed('fret', true)
    .attr('x1', (f) => f.x)
    .attr('x2', (f) => f.x)
    .attr('y1', (f) => f.y1)
    .attr('y2', (f) => f.y2);
}

/**
 * @param {Marking[]} markings
 */
function drawMarkings(markings, output) {
  output.selectAll('.marking').remove(); // Lines may redraw, so markings may redraw even without data change.
  const m = output
    .selectAll('.marking')
    .data(markings)
    .join('g')
    .classed('marking', true)
    .classed('marking--highlighted', (m) => m.m === 'h')
    .classed('marking--textonly', (m) => m.m === 't')
    .attr('transform', function (m) {
      return `translate(${
        spec.getFretPosition(m.f) - spec.marking.size / 2 - spec.marking.margin
      },${spec.getStringPosition(m.s)})`;
    });

  m.selectAll('*').remove(); // No join() called on the markings, so we need to manually remove the children.
  m.append('circle').attr('r', spec.marking.size / 2);
  m.append('text').text((m) => m.t);
}

/**
 * @typedef {Object} Marking
 * @property {number} s string number
 * @property {number} f fret number
 * @property {number} m modification
 * @property {number} t text
 */

/**
 * @returns {Marking[]}
 */
function parseInput(text) {
  try {
    const result = [];
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const tokens = lines[i].split(',');

      const code = tokens[0];
      let currentTextI = 1;
      for (let j = 0; j < code.length; j++) {
        if (code[j] === 'o') {
          result.push({s: i, f: j, t: tokens[currentTextI] ?? null});
          currentTextI++;
        } else if (code[j] === 'h') {
          result.push({s: i, f: j, m: 'h', t: tokens[currentTextI] ?? null});
          currentTextI++;
        } else if (code[j] === 'x') {
          result.push({s: i, f: j, m: 't', t: tokens[currentTextI] ?? null});
          currentTextI++;
        } else if (code[j] === '-') {
          continue;
        } else {
          alert(`Unrecognized character ${code[j]} in input line ${i + 1}`);
          return result;
        }
      }
    }
    return result;
  } catch (e) {
    alert(e);
  }
}

function updateFretboard() {
  const fretboard = d3.select('#fretboard');
  const text = document.getElementById('input').value;
  drawFretboard(fretboard);
  drawMarkings(parseInput(text), fretboard);
}
