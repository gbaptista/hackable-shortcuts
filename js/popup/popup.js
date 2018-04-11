load_template('html/popup/templates/tabs.html', function(tabs_template) {

  chrome.tabs.query({}, function(tabs) {
    document.getElementById('tabs').innerHTML = Mustache.render(tabs_template, {
      tabs: tabs
    });
  });
});
