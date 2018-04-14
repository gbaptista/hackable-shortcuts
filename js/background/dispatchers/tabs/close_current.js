dispatchers['tabs']['actions']['close_current']['dispatcher'] = function(shortcut, sender) {
  if(sender.tab) { chrome.tabs.remove(sender.tab.id); }
};
