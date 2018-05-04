var a_element = document.createElement('a');

chrome.runtime.onMessage.addListener(function (message, sender) {
  if(message.action == 'dispatch_shortcut_to_background') {
    var shortcut = JSON.parse(message.shortcut);

    dispatchers[shortcut['kind']]['actions'][shortcut['details']['action']]['dispatcher'](
      shortcut, sender
    );
  }
});
