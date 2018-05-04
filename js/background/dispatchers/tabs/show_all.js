dispatchers['tabs']['actions']['show_all']['dispatcher'] = function(shortcut, sender) {
  chrome.tabs.query({}, function(tabs) {
    for(i in tabs) {
      var tab = tabs[i];
      if(tab) { chrome.tabs.show(tab.id); }
    }
  });
};
