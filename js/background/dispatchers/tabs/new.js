dispatchers['tabs']['actions']['new']['dispatcher'] = function(shortcut, sender) {
  chrome.tabs.create({ active: true });
};
