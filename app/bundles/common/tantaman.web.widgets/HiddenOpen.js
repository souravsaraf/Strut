define(['backbone'], function(Backbone) {
  return Backbone.View.extend({
    className: 'dispNone',
    events: {
      "change input[type='file']": '_fileChosen'
    },
    initialize: function(triggerElem, cb) {
      this._cb = cb;
      if (triggerElem != null) {
        return triggerElem.on('click', this.trigger.bind(this));
      }
    },
    trigger: function(cb) {
      if (cb != null) {
        this._cb = cb;
      }
      return this.$input.click();
    },
    _fileChosen: function(e) {
      var f;
      f = e.target.files[0];
	  e.target.value = ""; // clearing the value of the input file HTML element, so that it fires next time, even when the same file is chosen by user.
	  window.console.log("Inside hiddenOpen.js , File name is : " + f.name);
      return this._cb(f);
    },
    render: function() {
      this.$input = $('<input type="file"></input>');
      this.$el.html(this.$input);
      return this;
    }
  });
});
