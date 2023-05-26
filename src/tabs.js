const defaultActiveTab = 'tab-settings'; // 'tab-settings', 'tab-download'
let activeTab = defaultActiveTab;
const panels = {
  'tab-settings': 'settings',
  'tab-download': 'download'
};

function setupTabs() {
  function setTabActive(tab) {
    activeTab = tab;
    d3.selectAll('#tabs > *').classed('tab--inactive', true);
    d3.select(`#${activeTab}`).classed('tab--inactive', false);
    d3.selectAll('.tab-panel').classed('tab-panel--hidden', true);
    d3.select(`#${panels[activeTab]}`).classed('tab-panel--hidden', false);
  }
  d3.selectAll('#tabs > *').on('click', function () {
    setTabActive(this.id);
  });
  setTabActive(defaultActiveTab); // Set it in HTML also to avoid repaint.
}
