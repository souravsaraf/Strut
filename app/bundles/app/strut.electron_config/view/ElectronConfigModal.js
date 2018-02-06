define(['backbone','lang'],
function(Backbone,lang)
{
	'use strict';
	return Backbone.View.extend({
		className: "ElectronConfigModal modal hide",
		events:
		{
			'click .ok': 'saveConfig',
			'destroyed': 'dispose'
		},
		
		dispose: function()
		{
		},
		
		constructor: function ElectronConfigModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
			this.title = lang.configuration;
		},
		
		initialize: function()
		{
			this.electronConfigInterface = this.options.electronConfigInterface;
			delete this.options.electronConfigInterface;
			
			this.template = JST['strut.electron_config/ElectronConfigModal'];
		},
		
		render: function()
		{
			this.$el.html(this.template(
			{
				title: this.title
			}
			));
		},
		
		show: function()
		{
			this.$el.modal('show');
		}
	});
});