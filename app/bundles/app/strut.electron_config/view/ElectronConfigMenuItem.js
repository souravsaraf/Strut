define(['backbone' , 'lang'] , 
function(Backbone , lang)
{
	'use strict';
	return Backbone.View.extend(
	{
		events: 
		{
			click: 'displayElectronConfigModal'
		},
		
		constructor: function ElectronConfigMenuItem(modal)
		{
			Backbone.View.prototype.constructor.call(this);
			this.electronConfigModal = modal;
		},
		
		render: function()
		{
			// OLD CODE : 
			// this.$el.html('<a href="#" class="dropdown-toggle">' + lang.configuration + '</a>');
			// return this;
			// The below replacing is done to remove the wrapping of $el with a div element which is done by Backbone Views.
			let html = '<a href="#" class="dropdown-toggle">' + lang.configuration + '</a>';
			let newElement = $(html);
			this.$el.replaceWith(newElement);
			this.setElement(newElement);
			return this;
		},
		
		displayElectronConfigModal: function()
		{
			this.electronConfigModal.show();
		}
	});
});