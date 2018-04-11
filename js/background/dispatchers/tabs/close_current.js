dispatchers['tabs']['close_current'] = function(shortcut, sender) {
  if(sender.tab) { chrome.tabs.remove(sender.tab.id); }
};
