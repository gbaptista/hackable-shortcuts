var Shortcuts = {
  instance: function (target) {
    var self = this;

    self.context_time = 1500;
    self.time_to_dispatch = 180;
    self.recording = false;
    self.recorded_dispatches = [];
    self.contexts = [];

    self.last_key_down_code = undefined;
    self.last_modifer_code = undefined;

    self.keys_sequence = [];
    self.modifier_keys = {};

    self.recording_timer = undefined;

    self.listeners = {};

    self.on_dispatch_callback = function(_shortcut) {};
    self.on_modifier_keys_change_callback = function(_modifier_keys) {};
    self.on_keys_sequence_change_callback = function(_keys_sequence) {};
    self.on_contexts_change_callback = function(_contexts) {};

    self.keys_sequence_without_modifiers = function() {
      var keys = [];

      for(i in self.keys_sequence) {
        if(!self.modifier_keys[self.keys_sequence[i]['code']]) {
          keys.push(self.keys_sequence[i]);
        }
      }

      return keys;
    }
    self.object_to_sorted_array = function(object_to_sort) {
      var keys = [];

      for(key in object_to_sort) {
        if (object_to_sort.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      keys.sort();

      var sorted_array = [];

      for(i in keys) {
        sorted_array.push(object_to_sort[keys[i]]);
      }

      return sorted_array;
    };

    self.initialize = function(target) {
      var element_target = target || document;
      var focus_target = target || window;

      focus_target.addEventListener('focus', self.clear_keys);

      element_target.addEventListener('keydown', self.keydown_handler);
      element_target.addEventListener('keyup', self.keyup_handler);
    };

    self.clear_keys = function(event) {
      self.keys_sequence = [];
      self.modifier_keys = {};

      self.on_modifier_keys_change_callback(
        self.object_to_sorted_array(self.modifier_keys)
      );

      self.on_keys_sequence_change_callback(self.keys_sequence);
    };

    self.remove_all_listeners = function() {
      self.listeners = {};
    };

    self.add_listener = function(id, callback) {
      if(!self.listeners[id]) {
        self.listeners[id] = [];
      }

      self.listeners[id].push(callback);
    };

    self.keydown_handler = function(event) {
      if(self.recording) {
        event.stopPropagation();
        event.preventDefault();
      }

      if(self.last_key_down_code != event.code || !self.modifier_keys[event.code]) {
        var key_object = {
          charCode: event.charCode,
          code: event.code,
          key: event.key,
          keyCode: event.keyCode,
          which: event.which
        };

        self.keys_sequence.push(key_object);

        self.modifier_keys[event.code] = key_object;

        self.last_key_down_code = event.code;

        self.on_modifier_keys_change_callback(
          self.object_to_sorted_array(self.modifier_keys)
        );

        self.on_keys_sequence_change_callback(self.keys_sequence);
      }
    };

    self.dispatch_timer = undefined;
    self.context_timer = undefined;

    self.dispatch_shortcut_event = function(shortcut_event) {
      var some_match = false;

      if(self.recording) {
        shortcut_event['recording'] = self.recording;

        self.recorded_dispatches.push(shortcut_event);

        if(Object.keys(self.modifier_keys).length == 0) {
          clearTimeout(self.recording_timer);
          self.recording_timer = setTimeout(function() {
            self.recording = false;
            self.record_target.removeEventListener('keydown', self.keydown_handler);
            self.record_target.removeEventListener('keyup', self.keyup_handler);

            self.recorded_dispatches.reverse();

            self.record_on_complete(self.recorded_dispatches);
          }, self.context_time);
        }
      } else {
        if(self.listeners[shortcut_event['id']]) {
          for(i in self.listeners[shortcut_event['id']]) {
            some_match = true;
            self.listeners[shortcut_event['id']][i](shortcut_event);
          }
        }
      }

      self.on_dispatch_callback(shortcut_event);

      return some_match;
    };

    self.keyup_handler = function(event) {
      if(self.recording) {
        event.stopPropagation();
        event.preventDefault();
      }

      delete self.modifier_keys[event.code];

      var current_last_modifier = self.object_to_sorted_array(
        self.modifier_keys
      );

      current_last_modifier = current_last_modifier[
        current_last_modifier.length - 1
      ];

      if(current_last_modifier) {
        self.last_modifer_code = current_last_modifier['code'];
      }

      if(self.last_modifer_code != event['code']) {
        clearTimeout(self.dispatch_timer);

        self.dispatch_timer = setTimeout(function(modifier_keys_list, keys_sequence_list) {
          var shortcut_event = {
            context: null,
            modifier_keys: modifier_keys_list,
            keys_sequence: keys_sequence_list
          };

          var modifier_keys_id = [];
          var keys_sequence_id = [];

          for(i in shortcut_event['modifier_keys']) {
            modifier_keys_id.push(shortcut_event['modifier_keys'][i]['code'])
          }

          for(i in shortcut_event['keys_sequence']) {
            keys_sequence_id.push(shortcut_event['keys_sequence'][i]['code'])
          }

          if(modifier_keys_id.length > 0) {
            shortcut_event['id'] = modifier_keys_id.join(
              '+'
            ) + ':' + keys_sequence_id.join('+');
          } else {
            shortcut_event['id'] = keys_sequence_id.join('+');
          }

          if(shortcut_event['id'] != '' && keys_sequence_id.length > 0) {
            var some_match = false;
            for(i in self.contexts) {
              if(!some_match) {
                some_match = self.dispatch_shortcut_event({
                  id: self.contexts[i]['id'] + ',' + shortcut_event['id'],
                  context: self.contexts[i],
                  modifier_keys: shortcut_event['modifier_keys'],
                  keys_sequence: shortcut_event['keys_sequence']
                });
              }
            }

            if(!some_match) {
              some_match = self.dispatch_shortcut_event(shortcut_event);
            }

            // TODO unique ids!
            self.contexts.reverse();
            self.contexts.push(shortcut_event);
            self.contexts.reverse();

            if(self.contexts.length > 3) {
              self.contexts = self.contexts.slice(0, 3);
            }

            self.on_contexts_change_callback(self.contexts);

            clearTimeout(self.context_timer);

            self.context_timer = setTimeout(function() {
              self.contexts = [];
              self.on_contexts_change_callback(self.contexts);
            }, self.context_time);
          }

          self.keys_sequence = self.object_to_sorted_array(self.modifier_keys);

          self.on_keys_sequence_change_callback(self.keys_sequence);
        }, self.time_to_dispatch,
          self.object_to_sorted_array(self.modifier_keys),
          [].concat(self.keys_sequence_without_modifiers())
        );
      } else {
        if(Object.keys(self.modifier_keys).length == 0) {
          self.last_modifer_code = undefined;
          self.keys_sequence = self.object_to_sorted_array(self.modifier_keys);
        }
      }

      self.on_modifier_keys_change_callback(
        self.object_to_sorted_array(self.modifier_keys)
      );

      self.on_keys_sequence_change_callback(self.keys_sequence);
    }

    self.on_dispatch = function(callback) {
      self.on_dispatch_callback = callback;
    }

    self.on_modifier_keys_change = function(callback) {
      self.on_modifier_keys_change_callback = callback;
    }

    self.on_keys_sequence_change = function(callback) {
      self.on_keys_sequence_change_callback = callback;
    }

    self.on_contexts_change = function(callback) {
      self.on_contexts_change_callback  = callback;
    };

    self.record = function(target, on_complete) {
      self.recorded_dispatches = [];
      self.recording = true;
      self.record_target = target;

      self.record_on_complete = on_complete;

      self.record_target.addEventListener('keydown', self.keydown_handler);
      self.record_target.addEventListener('keyup', self.keyup_handler);

      self.record_target.focus();
    }

    self.initialize(target);
  }
}
