var shortcuts = new Shortcuts.instance();

var add_listener = function(shortcut) {
  shortcuts.add_listener(shortcut['shortcut'], function() {
    chrome.runtime.sendMessage({
      action: 'dispatch_shortcut_to_background', shortcut: JSON.stringify(shortcut)
    });
  });
}

var add_listeners = function(sync_data) {
  shortcuts.remove_all_listeners();

  for(id in sync_data) {
    var id_data = id.split('-');
    if(id_data[0] == 's') {
      var shortcut = sync_data[id];

      add_listener(shortcut);
    }
  }
}

var load_shortcuts = function() {
  chrome.storage.sync.get(null, function(sync_data) {
    add_listeners(sync_data);
  });
}

load_shortcuts();
