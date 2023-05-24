const settings = {
  bound: {
    title: 'Boundary',
    items: {
      whr: {
        type: 'slider',
        title: 'Width-Height Ratio',
        desc: 'Width-height ratio of the whole figure.',
        min: 1.5,
        max: 4.5,
        step: 0.1,
        get: () => spec.bound.w,
        set: (v) => {
          spec.bound.w = Number(v);
          const output = d3.select('#fretboard');
          output.attr('viewBox', `0 0 ${spec.bound.w} ${spec.bound.h}`);
        }
      }
    }
  },
  lines: {
    title: 'Lines',
    items: {
      sWidth: {
        type: 'slider',
        title: 'String Length',
        desc: 'String length with respect to the width of the whole figure. Frets and markings may exceed string length',
        min: 0.2,
        max: 0.9,
        step: 0.1,
        get: () => spec.string.w,
        set: (v) => (spec.string.w = Number(v))
      },
      sHeight: {
        type: 'slider',
        title: 'String Total Spacing',
        desc: 'Vertical spacing from first to last string, with respect to the height of the whole figure.',
        min: 0.5,
        max: 0.9,
        step: 0.1,
        get: () => spec.string.h,
        set: (v) => (spec.string.h = Number(v))
      },
      sCount: {
        type: 'slider',
        title: 'String Count',
        desc: 'The number of strings in the figure.',
        min: 4,
        max: 8,
        step: 1,
        get: () => spec.string.count,
        set: (v) => (spec.string.count = Number(v))
      },
      fWidthBase: {
        type: 'slider',
        title: 'First Fret Length',
        desc: 'Length of the first fret.',
        min: 0.2,
        max: 0.6,
        step: 0.05,
        get: () => spec.fret.wFirstFret,
        set: (v) => (spec.fret.wFirstFret = Number(v))
      },
      fWidthRatioOctave: {
        type: 'slider',
        title: 'Fret Length Shrink Factor',
        desc: 'In reality, fret length shrinks by a factor of 2 when going up an octave. Smaller values make fret lengths more even.',
        min: 1,
        max: 2,
        step: 0.1,
        get: () => spec.fret.ratioOctave,
        set: (v) => (spec.fret.ratioOctave = Number(v))
      },
      fCount: {
        type: 'slider',
        title: 'Fret Count',
        desc: 'The number of frets in the figure. Frets exceeding the strings are still drawn.',
        min: 1,
        max: 12,
        step: 1,
        get: () => spec.fret.count,
        set: (v) => (spec.fret.count = Number(v))
      }
    }
  },
  markings: {
    title: 'Markings',
    items: {
      size: {
        type: 'slider',
        title: 'Size',
        desc: 'Size of the markings.',
        min: 0.08,
        max: 0.16,
        step: 0.01,
        get: () => spec.marking.size,
        set: (v) => (spec.marking.size = Number(v))
      },
      margin: {
        type: 'slider',
        title: 'Margin to Next Fret',
        desc: 'The distance from the edge of the marking to the next fret.',
        min: 0,
        max: 0.08,
        step: 0.01,
        get: () => spec.marking.margin,
        set: (v) => (spec.marking.margin = Number(v))
      }
    }
  }
};

function setupSettings() {
  const settingsEl = d3.select('#settings');

  // Settings
  Object.keys(settings).forEach((s, _) => {
    // Settings section
    const section = settingsEl.append('section').attr('id', s).classed('settings__section', true);
    section.append('h3').text(settings[s].title);

    Object.keys(settings[s].items).forEach((i) => {
      // Settings item
      const item = section.append('div').attr('id', i).classed('settings__item', true);
      const label = item
        .append('label')
        .text(settings[s].items[i].title)
        .attr('title', settings[s].items[i].desc);
      switch (settings[s].items[i].type) {
        case 'toggle':
          item.classed('settings__item--toggle', true);
          label
            .append('input')
            .attr('type', 'checkbox')
            .property('checked', settings[s].items[i].get())
            .on('change', function () {
              settings[s].items[i].set(d3.select(this).property('checked'));
              updateFretboard();
            });
          break;
        case 'slider':
          item.classed('settings__item--slider', true);
          label.style('display', 'flex').style('flex-direction', 'column');
          const slider = label.append('div').classed('slider', true);
          slider
            .append('output')
            .classed('slider__indicator', true)
            .html(settings[s].items[i].get());
          slider
            .append('input')
            .style('flex', '1 1 auto')
            .attr('type', 'range')
            .attr('min', settings[s].items[i].min)
            .attr('max', settings[s].items[i].max)
            .attr('step', settings[s].items[i].step)
            .attr('value', settings[s].items[i].get())
            .on('change', function () {
              this.previousElementSibling.value = this.value;
              settings[s].items[i].set(d3.select(this).property('value'));
              updateFretboard();
            });
          break;
      }
    });
  });
}
