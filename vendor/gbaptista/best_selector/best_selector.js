var best_selector_for_element = function(element) {
  var target_element = element;
  var continue_search = 50;
  var selectors_tree = [];

  while(--continue_search) {
    var possible_selectors = [];

    var tag = $(element).prop('tagName').toLowerCase();
    possible_selectors.push(tag);

    var id = $(element).attr('id');
    if(id) { possible_selectors.push('#' + id); }

    var classes = $(element).attr('class');
    if(classes) {
      classes = classes.split(/\s+/);
      if(selectors_tree.length == 0) {
        for(i in classes) { possible_selectors.push(tag + '.' + classes[i]); }
      } else {
        for(i in classes) { possible_selectors.push('.' + classes[i]); }
      }
    }

    for(i in possible_selectors) {
      var selector = possible_selectors[i];

      selectors_tree.push(selector);

      if($([].concat(selectors_tree).reverse().join(' ')).length == 1) {
        continue_search = 1;
        break;
      } else {
        selectors_tree.pop();
      }
    }

    if(continue_search > 1) {
      selectors_tree.push(
        possible_selectors[1] // id
        ||
        possible_selectors[2] // class
        ||
        possible_selectors[0] // tag
      );

      element = $(element).parent();

      if(!$(element).prop('tagName')) { continue_search = 1; }
    }
  }

  var selector = [].concat(selectors_tree).reverse().join(' ');
  var precision = 1 / $(selector).length;

  return {
    key: target_element + '^' + precision + '^' + selector,
    target: target_element,
    precision: precision,
    selector: selector
  }
};
