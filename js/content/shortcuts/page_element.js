chrome.runtime.onMessage.addListener(function(message, _sender) {
  if(message.action == 'dispatch_shortcut') {
    var shortcut = JSON.parse(message.shortcut);

    if(shortcut['kind'] == 'page_element') {
      if(shortcut['details']['action'] == 'click') {
        if($(shortcut['details']['selector']).length > 0) {

          var click_event = new MouseEvent('click', {
            'view': window, 'bubbles': true, 'cancelable': true
          });

          $(shortcut['details']['selector']).first()[0].dispatchEvent(
            click_event
          );

          // console.log('-------------------------------------');
          // console.log(document.location.href);
          // console.log(shortcut['details']['selector']);
          // console.log($(shortcut['details']['selector']));
          // console.log($(shortcut['details']['selector']).length);
          // console.log('-------------------------------------');
        } else {
          // console.log(shortcut['details']['selector']);
        }
      }
    }
  }
});
