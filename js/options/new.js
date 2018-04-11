$(document).ready(function() {

  var a_element = document.createElement('a');

  load_template('html/options/templates/new/interaction.html', function(interaction_template) {
    chrome.runtime.onMessage.addListener(function (message, sender) {
      if(message.action == 'detected_interaction') {

        if($('#action .interaction').length) {
          var selector = JSON.parse(message.selector);

          a_element.href = sender.url;
          var domain = a_element.hostname;

          $('#action .interaction').html(Mustache.render(interaction_template,{
            target: selector['target'],
            selector: selector['selector'],
            precision: selector['precision'],
            domain: domain
          }));
        }
      }
    });
  });

  var load_form_tabs = function(template) {
    $('#action .subform').html(Mustache.render(template,
      {}
    ));
  }

  var load_form_page_element = function(template) {
    $('#action .subform').html(Mustache.render(template,
      {}
    ));
  }

  load_template('html/options/templates/new/page_element.html', function(form_page_element_template) {
    load_template('html/options/templates/new/tabs.html', function(form_tabs_template) {

      $('input[name=kind]').change(function(event) {
        switch($(this).val()) {
          case 'page_element': load_form_page_element(form_page_element_template); break;
          case 'tabs': load_form_tabs(form_tabs_template); break;
        }
      });
    });
  });

  // -------------------------------------------------
  load_template('html/options/templates/new/shortcut_radio.html', function(shortcut_radio_template) {
    var shortcuts = new Shortcuts.instance();

    var recording_on_dispatch = function(shortcut) {
      shortcut['object'] = JSON.stringify(shortcut);

      $('#shortcut-radios').append(Mustache.render(
        shortcut_radio_template, shortcut
      ));

      shortcuts.add_listener(shortcut['id'], function() {
        console.log(shortcut['id']);
        var selector = 'label[for="s_' + shortcut['id'] + '"]';

        $(selector).css('background-color', '#F2C14E');

        setTimeout(function() {
          $(selector).css('background-color', '');
        }, 150);
      });

      tippy('.tippy', { animation: 'shift-toward', arrow: true });
    };

    shortcuts.on_dispatch(function(shortcut) {
      $('#shortcut-logs code').html(JSON.stringify(
        shortcut['id']
      ));

      if(shortcut['recording']) {
        recording_on_dispatch(shortcut);
      }
    });

    $('#save-shortcut').click(function(event) {
      event.stopPropagation();
      event.preventDefault();

      var shortcut = {
        title: $('#save-form input[name=title]').val(),
        category: $('#save-form input[name=category]').val(),
        shortcut: $('#shortcut form input[name=shortcut]:checked').val(),
        kind: $('#action form input[name=kind]:checked').val(),
        object: $('#shortcut form input[name=shortcut]:checked').data('object'),
        context: {
          domain: undefined
        }
      };

      var id = 's-' + shortcut['category'] + '-' + performance.now().toString().replace('.', '');

      var valid = true;
      var errors = [];

      if(!shortcut['kind'] || shortcut['kind'] == '') {
        errors.push('invalid action');
        valid = false;
      }

      if(shortcut['kind'] == 'page_element') {
        shortcut['details'] = {
          action: 'click',
          domain: $('#action form input[name=page_element_domain]').val(),
          selector: $('#action form input[name=page_element_selector]').val(),
          precision: $('#action form input[name=page_element_precision]').val()
        };

        if(!shortcut['details']['selector'] || shortcut['details']['selector'] == '') {
          errors.push('invalid selector');
          valid = false;
        }
      }

      if(shortcut['kind'] == 'tabs') {
        shortcut['details'] = {
          action: $('#action form input[name=tabs_action]:checked').val()
        }

        if(!shortcut['details']['action'] || shortcut['details']['action'] == '') {
          errors.push('invalid tab action');
          valid = false;
        }
      }

      if(!shortcut['shortcut'] || shortcut['shortcut'] == '') {
        errors.push('invalid shortcut');
        valid = false;
      }

      if(!shortcut['title'] || shortcut['title'] == '') {
        errors.push('invalid title');
        valid = false;
      }

      if(!shortcut['category'] || shortcut['category'] == '') {
        errors.push('invalid category');
        valid = false;
      }

      if(valid) {
        var data = {};
        data[id] = shortcut;
        chrome.storage.sync.set(data, function() {
          alert('saved');
        });
      } else {
        alert(errors.join("\n"));
      }
    });

    $('#record-shortcut').click(function() {
      $('#shortcut-radios').html('');
      $('#record-shortcut').attr('disabled', 'disabled');
      $('#record-shortcut').html('capturing...');

      shortcuts.remove_all_listeners();

      shortcuts.record(document.getElementById('shortcut-input'), function(recorded_dispatches) {
        $('#record-shortcut').removeAttr('disabled');
        $('#record-shortcut').html('capture shortcut');

      });
    });
  });
});
