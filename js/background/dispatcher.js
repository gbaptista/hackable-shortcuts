var a_element = document.createElement('a');

chrome.runtime.onMessage.addListener(function (message, sender) {
  if(message.action == 'dispatch_shortcut') {
    var shortcut = JSON.parse(message.shortcut);

    dispatchers[shortcut['kind']][shortcut['action']](shortcut, sender);
  }
});
