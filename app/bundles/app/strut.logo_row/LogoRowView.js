define(['backbone',
		'./LogoRowModel',
		'css!styles/logo_row/logo.css'],
function(Backbone, LogoRowModel) {
	'use strict';
	return Backbone.View.extend({

		initialize: function() {
			// Decide Template based on Web App or Electron App.
			if(isElectron())
			{
				this._template = JST['strut.logo_row/LogoRowElectron'];
			}
			else
			{
				this._template = JST['strut.logo_row/LogoRow'];
			}
			this.model = new LogoRowModel(this.options.editorModel);
			delete this.options.editorModel;
		},

		render: function() {
			this.$el.html(this._template());
			
			// this.model.items contains all the 12 menu entries 
			// (New , open , save , saveas , undo , redo , cut , copy , paste , delete , import , export). 
			// It contains the button UI as well as the action to perform when these events are triggered. 
			// Now, to distributing  all the above menu items into their categories : 
			// We add the first 4 menu items into 'File' category.
			var $file_dropdown = this.$el.find('.dropdown-menu[data-menu_item="file"]');
			for(var i = 0; i < 4; i++)
			{
				var item = this.model.items[i];
				$file_dropdown.append(item.render().$el);
			}
			
			// The next 7 menu items go into 'Edit' category. (the count 7 comes because we have to count the deviders as an apparent menu item)
			var $edit_dropdown = this.$el.find('.dropdown-menu[data-menu_item="edit"]');
			for(var i = 4; i < 11; i++)
			{
				var item = this.model.items[i];
				$edit_dropdown.append(item.render().$el);
			}
			
			// The next 2 menu items go into 'Slideshow' category.
			var $slideshow_dropdown = this.$el.find('.dropdown-menu[data-menu_item="slideshow"]');
			for(var i = 11; i < 13; i++)
			{
				var item = this.model.items[i];
				$slideshow_dropdown.append(item.render().$el);
			}
			
			if(isElectron())
			{
				var $config_menu_item = this.$el.find('li[data-menu_item="configuration"]');
				var item = this.model.items[13];
				// console.log("The li tag where stuff will be appended : \n" + $config_menu_item.prop("outerHTML"));
				// console.log("The Electron Config Menu Item");
				// console.dir(item);
				// console.log("The appended stuff is : \n" + item.render().$el.prop("outerHTML"));
				$config_menu_item.append(item.render().$el);
			}

			return this;
		},

		constructor: function LogoRowView() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});