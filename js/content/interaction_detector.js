$(document).ready(function() {
  var last_selector = undefined;

  $('*').on('click', function(event) {
    var selector = best_selector_for_element(event.target);

    if(selector['key'] != last_selector) {
      last_selector = selector['key'];

      chrome.runtime.sendMessage({
        action: 'detected_interaction',
        selector: JSON.stringify({
          target: $(selector['target']).prop('tagName').toLowerCase(),
          selector: selector['selector'],
          precision: selector['precision']
        })
      });
    }

    setTimeout(function() {
      last_selector = undefined;
    }, 0);
  });
});
