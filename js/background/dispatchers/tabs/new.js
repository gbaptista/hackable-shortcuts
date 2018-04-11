dispatchers['tabs']['new'] = function(shortcut, sender) {
  chrome.tabs.create({ active: true });
};
