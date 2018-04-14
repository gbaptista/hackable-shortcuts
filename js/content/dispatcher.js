chrome.runtime.onMessage.addListener(function(message, sender) {
  if(message.action == 'dispatch_shortcut_to_content') {
    var shortcut = message.shortcut;

    dispatchers[shortcut['kind']]['actions'][shortcut['details']['action']]['dispatcher'](
      shortcut, sender
    );
  }
});
