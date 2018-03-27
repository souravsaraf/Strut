define(["backbone", "lang"], function(Backbone, lang)
{
	"use strict";
	return Backbone.View.extend(
	{
		className: "ViewLibraryModal modal hide",
		events:
		{},

		// General Backbone View Functions

		dispose: function() {},
		constructor: function ViewLibraryModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},
		initialize: function()
		{
			this.editorModel = this.options.editorModel;
			this.electronLibraryInterface = this.options.electronLibraryInterface;
			delete this.options.editorModel;
			delete this.options.electronLibraryInterface;

			this.title = lang.tagLibrary.viewLibrary;
			this.template = JST["strut.tagLibrary/ViewLibraryModal"];
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
			var Database = require('better-sqlite3');
			var db = new Database('C:\\Users\\SouravSaraf\\AppData\\Roaming\\Strut\\strutTagLibrary.db');

			let results = db.prepare('Select * from Presentations').all();
			console.log("Presentations Table : \n");
			console.dir(results);

			results = db.prepare('Select * from Presentations_History').all();
			console.log("Presentations_History Table : \n");
			console.dir(results);

			results = db.prepare('Select * from Presentations_Tags').all();
			console.log("Presentations_Tags Table : \n");
			console.dir(results);

			results = db.prepare('Select * from Tags').all();
			console.log("Tags Table : \n");
			console.dir(results);

			db.close();
		}
	});
});