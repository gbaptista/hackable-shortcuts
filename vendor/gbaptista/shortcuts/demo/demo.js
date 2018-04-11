var shortcuts = new Shortcuts.instance();

var on_dispatch_list = [];

shortcuts.on_contexts_change(function(contexts) {
  var keys = [];

  for(key in contexts) {
    keys.push(contexts[key]['id']);
  }

  document.getElementById('contexts').innerHTML = keys.join('<br>');
});

shortcuts.on_modifier_keys_change(function(modifier_keys) {
  var keys = [];

  for(key in modifier_keys) {
    keys.push(modifier_keys[key]['code']);
  }

  document.getElementById('modifier_keys').innerHTML = keys.join('<br>');
});

shortcuts.on_keys_sequence_change(function(keys_sequence) {
  var keys = [];

  for(i in keys_sequence) {
    keys.push(keys_sequence[i].code);
  }

  document.getElementById('keys_sequence').innerHTML = keys.join('<br>');
});

shortcuts.on_dispatch(function(shortcut) {
  if(on_dispatch_list.length > 20) {
    on_dispatch_list = on_dispatch_list.slice(0, 20);
  }

  var modifiers = [];

  for(i in shortcut['modifier_keys']) {
    var key_code = shortcut['modifier_keys'][i]['code'];
    modifiers.push(key_code);
  }

  var keys = [];

  for(i in shortcut['keys_sequence']) {
    var key_code = shortcut['keys_sequence'][i]['code'];
    keys.push(key_code);
  }

  on_dispatch_list.reverse();
  on_dispatch_list.push('<span class="line">--------------------------------------------------------------------</span>');

  var details = [];

  if(shortcut['context']) {
    details.push(
      '<code class="context" title="context">' + shortcut['context']['id'] + '</code>'
    );
  }

  if(modifiers.length > 0) {
    details.push(
      '<code class="modifier" title="modifier">' + modifiers.join(' + ') + '</code>'
    );
  }

  details.push(
    '<code title="keys_sequence">' + keys.join(' + ') + '</code>'
  );

  var line = details.join(' | ');

  if(shortcut['recording']) {
    var content = document.getElementById('record').innerHTML;

    content += '<input type="radio" id="s_' + shortcut['id'] + '" name="shortcut" value="' + shortcut['id'] + '"> ' +
               '<label for="s_' + shortcut['id'] + '">' + line
               + '<br>';

    document.getElementById('record').innerHTML = content;
  }

  on_dispatch_list.push(
    '<strong title="id">' + shortcut['id'] + ':</strong> ' + line
  );

  on_dispatch_list.reverse();

  var content = '';

  for(i in on_dispatch_list) {
    content += on_dispatch_list[i] + '<br>';
  }

  document.getElementById('on_dispatch').innerHTML = content;
});

document.getElementById('save-button').addEventListener('click', function(_event) {
  var options = document.getElementsByName('shortcut');

  var selected = null;

  if (options) {
    for (var i = 0; i < options.length; i++) {
      if(options[i].checked) { selected = options[i].value; }
    }
  }

  if(selected) {
    if(!document.getElementById(selected)) {
      var current_content = document.getElementById('add_listener').innerHTML;

      var new_line = '<span id="' + selected + '">' + selected + '</span>';

      document.getElementById('add_listener').innerHTML = current_content + '<br>' + new_line;

      shortcuts.add_listener(selected, function(event) {
        document.getElementById(event['id']).style.background = 'yellow';
        setTimeout(function() {
          document.getElementById(event['id']).style.background = '';
        }, 200);
      });
    }
  }
});

document.getElementById('record-button').addEventListener('click', function(_event) {
  document.getElementById('record-button').setAttribute('disabled', 'disabled');
  document.getElementById('record-button').innerHTML = 'recording...';
  document.getElementById('record').innerHTML = '';

  shortcuts.record(document.getElementById('record-input'), function(_recorded_dispatches) {
    document.getElementById('record-button').innerHTML = 'record';
    document.getElementById('record-button').removeAttribute('disabled');
  })
});
