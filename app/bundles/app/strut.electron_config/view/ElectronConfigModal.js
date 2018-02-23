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
			'click a[data-setting="monitor"]': 'showMonitorSettings',
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
			// this.monitorSettingsPartialTemplate =  JST['strut.electron_config/partials/LogoRowElectronConfigMonitorSettings'];
			// this.othersSettingsPartialTemplate =  JST['strut.electron_config/partials/LogoRowElectronConfigOthersSettings'];
			
			this.template = JST['strut.electron_config/ElectronConfigModal'];
			this.partialTemplateToShow = 'strut.electron_config/partials/LogoRowElectronConfigStorageSettings';
		},
		
		render: function()
		{
			this.$el.html(this.template(
			{
				title: this.title,
				storage: lang.electron_config_settings.storage,
				monitor: lang.electron_config_settings.monitor,
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
		
		fillPartialDivWithStorageSettings: function()
		{
			let $targetDiv = this.$el.find('div[data-name="sidebarDependentContent"]');
			let storageTemplate = JST['strut.electron_config/partials/LogoRowElectronConfigStorageSettings'];
			let templateData = 
			{
				storage: lang.electron_config_settings.storage,
				appDataFolder: lang.electron_config_settings.appDataFolder,
				presentationFolder: lang.electron_config_settings.presentationFolder,
				recentFileCount: lang.electron_config_settings.recentFileCount
			};
			let storageHTML = storageTemplate(templateData);
			$targetDiv.html(storageHTML);
		},
		
		fillPartialDivWithMonitorSettings: function()
		{
			let $targetDiv = this.$el.find('div[data-name="sidebarDependentContent"]');
			let monitorTemplate = JST['strut.electron_config/partials/LogoRowElectronConfigMonitorSettings'];
			let monitorHTML = monitorTemplate(
			{
				monitor: lang.electron_config_settings.monitor,
				controlMonitor: lang.electron_config_settings.controlMonitor,
				presentationMonitor: lang.electron_config_settings.presentationMonitor,
				resolution: lang.electron_config_settings.resolution
			});
			$targetDiv.html(monitorHTML);
		},
		
		showStorageSettings: function(evt)
		{
			this.$el.find('a[data-setting]').removeClass('current');
			$(evt.currentTarget).addClass('current');
			// console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			// console.log("Storage Settings was clicked");
			this.fillPartialDivWithStorageSettings();
		},
		
		showMonitorSettings: function(evt)
		{
			this.$el.find('a[data-setting]').removeClass('current');
			$(evt.currentTarget).addClass('current');
			// console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			// console.log("Monitor Settings was clicked");
			this.fillPartialDivWithMonitorSettings();
		},
		
		showOthersSettings: function(evt)
		{
			this.$el.find('a[data-setting]').removeClass('current');
			$(evt.currentTarget).addClass('current');
			// console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			// console.log("Others Settings was clicked");
			this.fillPartialDivWithStorageSettings();
		},
		
		saveConfig: function()
		{
			// console.log("Save Config was clicked");
		},
		
		cancelConfig: function()
		{
			// console.log("Cancel Config was clicked");
		}
	});
});