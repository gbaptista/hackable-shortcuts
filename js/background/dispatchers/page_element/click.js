dispatchers['page_element']['actions']['click']['dispatcher'] = function(shortcut, sender) {
  chrome.tabs.query({}, function(tabs) {
    for(i in tabs) {
      var tab = tabs[i];

      if(tab) {
        a_element.href = tab.url;

        if(shortcut['details']['domain'] == a_element.hostname) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'dispatch_shortcut_to_content', shortcut: shortcut
          });
        }
      }
    }
  });
};
