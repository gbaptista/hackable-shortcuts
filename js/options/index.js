$(document).ready(function() {

  load_template('html/options/templates/index/categories.html', function(categories_template) {
    load_template('html/options/templates/index/shortcuts.html', function(shortcuts_template) {
      chrome.storage.sync.get(null, function(sync_data) {
        var shortcuts = {};

        for(id in sync_data) {
          var id_data = id.split('-');
          if(id_data[0] == 's') {
            var category = id_data[1];

            if(!shortcuts[category]) {
              shortcuts[category] = [];
            }

            var shortcut = sync_data[id];
            shortcut['id'] = id;

            shortcut['is_tabs'] = (shortcut['kind'] == 'tabs');

            shortcuts[category].push(shortcut);
          }
        }

        var categories = Object.keys(shortcuts);

        var load_category = function(category) {
          var categories_objects = [];

          for(i in categories) {
            var category_object = {
              title: categories[i]
            }

            if(categories[i] == category) {
              category_object['active'] = true;
            }

            categories_objects.push(category_object);
          };

          $('nav.navbar').html(Mustache.render(categories_template, {
            categories: categories_objects
          }));

          $('nav.navbar a').click(function(event) {
            event.stopPropagation();
            event.preventDefault();

            load_category($(this).data('category'));
          });

          $('.shortcuts-container').html(Mustache.render(shortcuts_template, {
            shortcuts: shortcuts[category]
          }));

          $('.shortcuts-container button.remove').click(function(_event) {
            var element = this;
            if(confirm('are you sure?')) {
              chrome.storage.sync.remove($(element).data('id'), function(_) {
                $('#' + $(element).data('id')).remove(); // remove row
              });
            }
          });

          tippy('.tippy', { animation: 'shift-toward', arrow: true });
        }

        load_category(categories[0]);

        // ----------------------------------------------------------
        var shortcuts_intance = new Shortcuts.instance();

        var add_listener = function(shortcut) {
          shortcuts_intance.add_listener(shortcut['shortcut'], function() {

            $('#' + shortcut['id']).css('transition', 'background-color 200ms linear');
            $('#' + shortcut['id']).css('background-color', '#b22dff');

            $('.categories .c-' + shortcut['category']).css('transition', 'background-color 150ms linear');
            $('.categories .c-' + shortcut['category']).css('background-color', '#b13fdb');

            setTimeout(function() {
              $('.categories .c-' + shortcut['category']).css('background-color', '');
              $('#' + shortcut['id']).css('background-color', '');
            }, 150);

            // TODO should dispatch?
            // chrome.runtime.sendMessage({
            //   action: 'dispatch_shortcut', shortcut: JSON.stringify(shortcut)
            // });
          });
        }

        var add_listeners = function(sync_data) {
          shortcuts_intance.remove_all_listeners();

          for(id in sync_data) {
            var id_data = id.split('-');
            if(id_data[0] == 's') {
              var shortcut = sync_data[id];

              add_listener(shortcut);
            }
          }
        }

        add_listeners(sync_data);
        // ----------------------------------------------------------
      });
    });
  });
});
