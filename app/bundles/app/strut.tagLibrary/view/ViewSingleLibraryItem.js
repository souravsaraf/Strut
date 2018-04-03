define(["backbone", "lang"], function(Backbone, lang)
{
	"use strict";
	return Backbone.View.extend(
	{
		className: "ViewSingleLibraryItem modal hide fade",
		attributes:
		{
			"data-backdrop": "static",
			"data-keyboard": false
		},
		events:
		{
			'click button[data-dismiss="modal_inner"]': function(evt)
			{
				this.$el.modal("hide");
				$(evt.target).data('modal', null);
			}
		},

		// General Backbone View Functions

		dispose: function() {},
		constructor: function ViewLibraryModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},
		initialize: function()
		{
			this.templateData = this.options.templateData;
			delete this.options.templateData;
			this.template = JST["strut.tagLibrary/ViewSingleLibraryItem"];
			this.render();
		},
		render: function()
		{
			this.$el.html(this.template(this.templateData));
		},
		show: function()
		{
			this.$el.modal("show");
		},
	});
});