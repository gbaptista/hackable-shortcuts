dispatchers['tabs']['hide_all'] = function(shortcut, sender) {
  chrome.tabs.query({}, function(tabs) {
    for(i in tabs) {
      var tab = tabs[i];
      if(tab) { chrome.tabs.hide(tab.id); }
    }
  });
};
