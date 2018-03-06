define(["backbone", "lang", "handlebars"], function(
	Backbone,
	lang,
	Handlebars
)
{
	"use strict";
	return Backbone.View.extend(
	{
		className: "ElectronConfigModal modal hide logoRow_configMenuItem",
		events:
		{
			// Header Events
			destroyed: "dispose",

			// Body Events
			'click a[data-setting="storage"]': "showStorageSettings",
			'click a[data-setting="monitor"]': "showMonitorSettings",
			'click a[data-setting="others"]': "showOthersSettings",

			// Footer Events
			"click .modal-footer button.close": function()
			{
				this.$el.find(".modal-footer div.alert").css(
				{
					visibility: "hidden"
				});
			},
			'click a[data-button_name="save"]': "saveConfig",
			'click a[data-button_name="cancel"]': "cancelConfig",

			// Inside Body , Common Validation Events

			// 'blur div[data-name="sidebarDependentContent"] input': 'validateInputs',

			// Inside Body , Storage Events
			'click div[data-name="sidebarDependentContent"] button[data-id="selectStrutPresentationsFolderButton"]': "selectStrutPresentationDataFolder",
			'input div[data-name="sidebarDependentContent"] input[data-id="RecentFilesCount"]': "onInputRecentFilesCount"

			// Inside Body , Monitor Events
		},

		dispose: function() {},

		constructor: function ElectronConfigModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},

		initialize: function()
		{
			this.electronConfigInterface = this.options.electronConfigInterface;
			delete this.options.electronConfigInterface;
			this.electronConfigInterface.setConfig(window.electronConfig);

			// this.storageSettingsPartialTemplate = JST['strut.electron_config/partials/LogoRowElectronConfigStorageSettings'];
			// this.monitorSettingsPartialTemplate =  JST['strut.electron_config/partials/LogoRowElectronConfigMonitorSettings'];
			// this.othersSettingsPartialTemplate =  JST['strut.electron_config/partials/LogoRowElectronConfigOthersSettings'];

			this.template = JST["strut.electron_config/ElectronConfigModal"];
			this.partialTemplateToShow = "strut.electron_config/partials/LogoRowElectronConfigStorageSettings";
			this.currentFormID = "storageForm";
			this.error_msg = lang.electron_config_settings.invalid_form_input;
			this.success_msg = lang.electron_config_settings.config_saved_success;
		},

		render: function()
		{
			this.$el.html(
				this.template(
				{
					title: lang.title,
					storage: lang.electron_config_settings.storage,
					monitor: lang.electron_config_settings.monitor,
					save: lang.save,
					cancel: lang.cancel,
					alert_msg: this.error_msg,
					partialTemplateToShow: this.partialTemplateToShow
				})
			);
		},

		show: function()
		{
			this.$el.modal("show");
			this.$el.find(".modal-footer .alert").css(
			{
				visibility: "hidden"
			});
			let $storageAnchor = this.$el.find('a[data-setting="storage"]');
			$storageAnchor.trigger("click");
		},

		configureAlertBox: function() {},

		// Restore Config State if form is invalid
		checkFormValidity: function()
		{
			let currentForm = this.$el.find('form[data-id="' + this.currentFormID + '"]')[0];
			if (currentForm && !currentForm.reportValidity())
			{
				this.$el
					.find(".modal-footer .alert")
					.css(
					{
						visibility: "visible"
					});
				return false;
			}
			this.$el.find(".modal-footer .alert").css(
			{
				visibility: "hidden"
			});
			return true;
		},

		validateInputs: function(evt)
		{
			let currentInput = evt.currentTarget;
			currentInput.checkValidity();
		},

		// SIDEBAR NAVIGATION EVENTS

		showStorageSettings: function(evt)
		{
			if (!this.checkFormValidity())
			{
				return;
			}
			this.$el.find("a[data-setting]").removeClass("current");
			$(evt.currentTarget).addClass("current");
			// console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			// console.log("Storage Settings was clicked");
			this.currentFormID = "storageForm";
			this.fillPartialDivWithStorageSettings();
		},

		showMonitorSettings: function(evt)
		{
			if (!this.checkFormValidity())
			{
				return;
			}
			this.$el.find("a[data-setting]").removeClass("current");
			$(evt.currentTarget).addClass("current");
			// console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			// console.log("Monitor Settings was clicked");
			this.currentFormID = "monitorForm";
			this.fillPartialDivWithMonitorSettings();
		},

		showOthersSettings: function(evt)
		{
			if (!this.checkFormValidity())
			{
				return;
			}
			this.$el.find("a[data-setting]").removeClass("current");
			$(evt.currentTarget).addClass("current");
			// console.log("CURRENT ELEMENT = " + $(evt.currentTarget).prop("outerHTML"));
			// console.log("Others Settings was clicked");
			this.currentFormID = "othersForm";
			this.fillPartialDivWithStorageSettings();
		},

		fillPartialDivWithStorageSettings: function()
		{
			let $targetDiv = this.$el.find(
				'div[data-name="sidebarDependentContent"]'
			);
			let storageTemplate =
				JST[
					"strut.electron_config/partials/LogoRowElectronConfigStorageSettings"
				];
			let templateData = {
				storage: lang.electron_config_settings.storage,
				browse: lang.browse,
				presentationFolder: lang.electron_config_settings.presentationFolder,
				recentFileCount: lang.electron_config_settings.recentFileCount
			};
			let storageHTML = storageTemplate(templateData);
			$targetDiv.html(storageHTML);
			this.initializeStorageForm();
		},

		fillPartialDivWithMonitorSettings: function()
		{
			let $targetDiv = this.$el.find(
				'div[data-name="sidebarDependentContent"]'
			);
			let monitorTemplate =
				JST[
					"strut.electron_config/partials/LogoRowElectronConfigMonitorSettings"
				];
			let monitorHTML = monitorTemplate(
			{
				monitor: lang.electron_config_settings.monitor,
				controlMonitor: lang.electron_config_settings.controlMonitor,
				presentationMonitor: lang.electron_config_settings.presentationMonitor,
				resolution: lang.electron_config_settings.resolution
			});
			$targetDiv.html(monitorHTML);
			this.initializeMonitorForm();
		},

		initializeStorageForm()
		{
			// Initialize the fields present in the Storage Form with values (from the last Configuration Settings or Default ones)
			let currentConfig = this.electronConfigInterface.getConfig();
			let currentForm = this.$el.find(
				'form[data-id="' + this.currentFormID + '"]'
			);
			currentForm
				.find('input[data-id="StrutPresentationsFolderTextBox"]')
				.val(currentConfig.storage.presentationFolder);
			currentForm
				.find('input[data-id="RecentFilesCount"]')
				.val(currentConfig.storage.recentFilesCount);
		},

		initializeMonitorForm()
		{
			// Initialize the fields present in the Monitor Form with values (from the last Configuration Settings or Default ones)
			let currentConfig = this.electronConfigInterface.getConfig();
			let currentForm = this.$el.find(
				'form[data-id="' + this.currentFormID + '"]'
			);

			currentForm
				.find('input[data-id="controlMonitorName"]')
				.val(currentConfig.monitor.controlMonitor);
			currentForm
				.find('input[data-id="controlMonitorWidth"]')
				.val(
					currentConfig.monitor.controlMonitorResolution.split("x")[0]
				);
			currentForm
				.find('input[data-id="controlMonitorHeight"]')
				.val(
					currentConfig.monitor.controlMonitorResolution.split("x")[1]
				);

			currentForm
				.find('input[data-id="presentationMonitorName"]')
				.val(currentConfig.monitor.presentationMonitor);
			currentForm
				.find('input[data-id="presentationMonitorWidth"]')
				.val(
					currentConfig.monitor.presentationMonitorResolution.split(
						"x"
					)[0]
				);
			currentForm
				.find('input[data-id="presentationMonitorHeight"]')
				.val(
					currentConfig.monitor.presentationMonitorResolution.split(
						"x"
					)[1]
				);
		},

		// STORAGE SETTINGS EVENT HANDLERS:

		selectStrutPresentationDataFolder: function()
		{
			const
			{
				dialog
			} = require("electron").remote;
			let pathArray = dialog.showOpenDialog(
			{
				properties: ["openDirectory"]
			});
			if (
				typeof pathArray != "undefined" &&
				pathArray != null &&
				pathArray.length != null &&
				pathArray.length > 0
			)
			{
				let selectedFolder = pathArray[0];
				let currentForm = this.$el.find(
					'form[data-id="' + this.currentFormID + '"]'
				);
				currentForm
					.find('input[data-id="StrutPresentationsFolderTextBox"]')
					.val(selectedFolder);
				let tempConfig = this.electronConfigInterface.getConfig();
				tempConfig.storage.presentationFolder = selectedFolder;
			}
		},

		onInputRecentFilesCount: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				let tempConfig = this.electronConfigInterface.getConfig();
				tempConfig.storage.recentFilesCount = evt.currentTarget.value;
			}
			console.log(
				"Recent Files Count = " + tempConfig.storage.recentFilesCount
			);
		},

		// FOOTER EVENTS HANDLER

		saveConfig: function()
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			console.log("Temporary config object inside cancelConfig is : \n");
			console.dir(tempConfig);
			if (!this.checkFormValidity())
			{
				return;
			}
			else
			{
				this.electronConfigInterface.setConfig(tempConfig);
				console.log("Config was saved");
				console.dir(window.electronConfig);
			}
		},

		cancelConfig: function()
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			console.log("Temporary config object inside cancelConfig is : \n");
			console.dir(tempConfig);
			this.electronConfigInterface.setConfig(window.electronConfig);
			console.log("Cancel Config was clicked");
			console.dir(window.electronConfig);
			this.$el.modal("hide");
		}
	});
});