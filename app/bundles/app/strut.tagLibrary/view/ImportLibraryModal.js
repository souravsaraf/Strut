define(["backbone", "lang"], function(Backbone, lang)
{
	"use strict";
	return Backbone.View.extend(
	{
		className: "ImportLibraryModal modal hide",
		events:
		{},

		// General Backbone View Functions

		dispose: function() {},
		constructor: function ImportLibraryModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},
		initialize: function()
		{
			this.editorModel = this.options.editorModel;
			this.electronLibraryInterface = this.options.electronLibraryInterface;
			delete this.options.editorModel;
			delete this.options.electronLibraryInterface;

			this.title = lang.tagLibrary.importLibrary;
			this.template = JST["strut.tagLibrary/ImportLibraryModal"];
		},
		render: function()
		{
			this.$el.html(this.template(
			{
				title: this.title
			}));
		},
		show: function()
		{
			this.$el.modal("show");
		}
	});
});