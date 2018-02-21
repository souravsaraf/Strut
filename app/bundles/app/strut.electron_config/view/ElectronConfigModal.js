define(['backbone','lang','handlebars'],
function(Backbone,lang,Handlebars)
{
	'use strict';
	return Backbone.View.extend({
		className: "ElectronConfigModal modal hide logoRow_configMenuItem",
		events:
		{
			'destroyed': 'dispose',
			'click a[data-setting="storage"]': 'showStorageSettings',
			'click a[data-setting="window"]': 'showWindowSettings',
			'click a[data-setting="others"]': 'showOthersSettings',
			'click a[data-button_name="save"]': 'saveConfig',
			'click a[data-button_name="cancel"]': 'cancelConfig',
		},
		
		dispose: function()
		{
		},
		
		constructor: function ElectronConfigModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
			this.title = lang.configuration;
			this.save = lang.save;
			this.cancel = lang.cancel;
		},
		
		initialize: function()
		{
			this.electronConfigInterface = this.options.electronConfigInterface;
			delete this.options.electronConfigInterface;
			
			// this.storageSettingsPartialTemplate = JST['strut.electron_config/partials/LogoRowElectronConfigStorageSettings'];
			// this.windowSettingsPartialTemplate =  JST['strut.electron_config/partials/LogoRowElectronConfigWindowSettings'];
			// this.othersSettingsPartialTemplate =  JST['strut.electron_config/partials/LogoRowElectronConfigOthersSettings'];
			
			this.template = JST['strut.electron_config/ElectronConfigModal'];
			this.partialTemplateToShow = 'strut.electron_config/partials/LogoRowElectronConfigStorageSettings';
		},
		
		render: function()
		{
			this.$el.html(this.template(
			{
				title: this.title,
				save: this.save,
				cancel: this.cancel,
				partialTemplateToShow: this.partialTemplateToShow
			}
			));
		},
		
		show: function()
		{
			this.$el.modal('show');
			let $storageAnchor = this.$el.find('a[data-setting="storage"]');
			$storageAnchor.trigger("click");
		},
		
		fillPartialDiv: function()
		{
			let $targetDiv = this.$el.find('div[data-name="sidebarDependentContent"]');
			let initialDivTemplateString = "{{> (lookup . 'partialTemplateToShow') }}";
			let divTemplate = Handlebars.compile(initialDivTemplateString);
			let finalDivHTML = divTemplate({'partialTemplateToShow': this.partialTemplateToShow});
			$targetDiv.html(finalDivHTML);
		},
		
		showStorageSettings: function(evt)
		{
			this.$el.find('a[data-setting]').removeClass('current');
			$(evt.currentTarget).addClass('current');
			console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			console.log("Storage Settings was clicked");
			this.partialTemplateToShow = 'strut.electron_config/partials/LogoRowElectronConfigStorageSettings';
			this.fillPartialDiv();
		},
		
		showWindowSettings: function(evt)
		{
			this.$el.find('a[data-setting]').removeClass('current');
			$(evt.currentTarget).addClass('current');
			console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			console.log("Window Settings was clicked");
			this.partialTemplateToShow = 'strut.electron_config/partials/LogoRowElectronConfigWindowSettings';
			this.fillPartialDiv();
		},
		
		showOthersSettings: function(evt)
		{
			// this.partialTemplateToShow = 'strut.electron_config/partials/LogoRowElectronConfigOthersSettings';
			// this.render();
			this.$el.find('a[data-setting]').removeClass('current');
			$(evt.currentTarget).addClass('current');
			console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			console.log("Others Settings was clicked");
			this.partialTemplateToShow = 'strut.electron_config/partials/LogoRowElectronConfigOthersSettings';
			this.fillPartialDiv();
		},
		
		saveConfig: function()
		{
			console.log("Save Config was clicked");
		},
		
		cancelConfig: function()
		{
			console.log("Cancel Config was clicked");
		}
	});
});