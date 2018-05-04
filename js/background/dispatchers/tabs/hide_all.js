dispatchers['tabs']['actions']['hide_all']['dispatcher'] = function(shortcut, sender) {
  chrome.tabs.query({}, function(tabs) {
    for(i in tabs) {
      var tab = tabs[i];
      if(tab) { chrome.tabs.hide(tab.id); }
    }
  });
};
