var click_event = new MouseEvent('click', {
  'view': window, 'bubbles': true, 'cancelable': true
});

dispatchers['page_element']['actions']['click']['dispatcher'] = function(shortcut, sender) {
  $(shortcut['details']['selector']).first()[0].dispatchEvent(click_event);
};
