var a_element = document.createElement('a');

chrome.runtime.onMessage.addListener(function (message, sender) {
  if(message.action == 'dispatch_shortcut') {
    var shortcut = JSON.parse(message.shortcut);

    if(shortcut['kind'] == 'page_element') {
      chrome.tabs.query({}, function(tabs) {
        for(i in tabs) {
          var tab = tabs[i];

          if(tab) {
            a_element.href = tab.url;

            if(shortcut['details']['domain'] == a_element.hostname) {
              chrome.tabs.sendMessage(tab.id, {
                action: 'dispatch_shortcut', shortcut: message.shortcut
              });
            }
          }
        }
      });
    } else if(shortcut['kind'] == 'tabs') {
      if(shortcut['details']['action'] == 'new') {

        chrome.tabs.create({ active: true });

      } else if(shortcut['details']['action'] == 'close_current') {

        if(sender.tab) { chrome.tabs.remove(sender.tab.id); }

      } else if(shortcut['details']['action'] == 'hide_all') {

        chrome.tabs.query({}, function(tabs) {
          for(i in tabs) {
            var tab = tabs[i];
            if(tab) { chrome.tabs.hide(tab.id); }
          }
        });

      } else if(shortcut['details']['action'] == 'show_all') {

        chrome.tabs.query({}, function(tabs) {
          for(i in tabs) {
            var tab = tabs[i];
            if(tab) { chrome.tabs.show(tab.id); }
          }
        });

      }
    }
  }
});
