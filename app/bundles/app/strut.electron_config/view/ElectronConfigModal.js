define(["backbone", "lang"], function(Backbone, lang)
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
				this.$el.find(".modal-footer div.alert").css("visibility", "hidden");
			},
			'click a[data-button_name="save"]': "saveConfig",
			'click a[data-button_name="cancel"]': "cancelConfig",

			// Inside Body , Common Validation Events
			// 'blur div[data-name="sidebarDependentContent"] input': 'validateInputs',

			// Inside Body , Storage Events
			'click div[data-name="sidebarDependentContent"] button[data-id="selectStrutPresentationsFolderButton"]': "selectStrutPresentationDataFolder",
			'input div[data-name="sidebarDependentContent"] input[data-id="RecentFilesCount"]': "onInputRecentFilesCount",

			// Inside Body , Monitor Events
			'input div[data-name="sidebarDependentContent"] input[data-id="controlMonitorName"]': "onInputControlMonitorName",
			'input div[data-name="sidebarDependentContent"] input[data-id="controlMonitorWidth"]': "onInputControlMonitorWidth",
			'input div[data-name="sidebarDependentContent"] input[data-id="controlMonitorHeight"]': "onInputControlMonitorHeight",
			'input div[data-name="sidebarDependentContent"] input[data-id="presentationMonitorName"]': "onInputPresentationMonitorName",
			'input div[data-name="sidebarDependentContent"] input[data-id="presentationMonitorWidth"]': "onInputPresentationMonitorWidth",
			'input div[data-name="sidebarDependentContent"] input[data-id="presentationMonitorHeight"]': "onInputPresentationMonitorHeight",
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
			this.error_msg = lang.invalid_form_input;
			this.success_msg = lang.electron_config_settings.config_saved_success;
		},
		render: function()
		{
			this.$el.html(this.template(
			{
				title: lang.title,
				storage: lang.electron_config_settings.storage,
				monitor: lang.electron_config_settings.monitor,
				save: lang.save,
				cancel: lang.cancel,
				alert_msg: this.error_msg,
				partialTemplateToShow: this.partialTemplateToShow
			}));
		},
		show: function()
		{
			this.$el.modal("show");
			this.configureAlertBox("success", "hidden");
			let $storageAnchor = this.$el.find('a[data-setting="storage"]');
			$storageAnchor.trigger("click");
		},
		configureAlertBox: function(status, visibility)
		{
			let correctClass = "alert-" + status;
			let message = status == "success" ? this.success_msg : this.error_msg;
			let $alert_box_div = this.$el.find(".modal-footer .alert");
			$alert_box_div.removeClass("alert-error alert-success");
			$alert_box_div.addClass(correctClass);
			$alert_box_div.contents()[0].nodeValue = message;
			$alert_box_div.css("visibility", visibility);
		},
		// Restore Config State if form is invalid
		checkFormValidityBeforeSwitchingForms: function()
		{
			let currentForm = this.$el.find('form[data-id="' + this.currentFormID + '"]')[0];
			if (currentForm && !currentForm.reportValidity())
			{
				this.configureAlertBox("error", "visible");
				return false;
			}
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
			if (!this.checkFormValidityBeforeSwitchingForms())
			{
				return;
			}
			this.$el.find("a[data-setting]").removeClass("current");
			$(evt.currentTarget).addClass("current");
			this.currentFormID = "storageForm";
			this.fillPartialDivWithStorageSettings();
		},
		showMonitorSettings: function(evt)
		{
			if (!this.checkFormValidityBeforeSwitchingForms())
			{
				return;
			}
			this.$el.find("a[data-setting]").removeClass("current");
			$(evt.currentTarget).addClass("current");
			this.currentFormID = "monitorForm";
			this.fillPartialDivWithMonitorSettings();
			const electron = require('electron');
			let screenElectron = electron.screen;
			let mainScreen = screenElectron.getPrimaryDisplay();
			let allScreens = screenElectron.getAllDisplays();
			console.log("SCREENS INFO : \n");
			console.dir(mainScreen);
			console.dir(allScreens);
		},
		showOthersSettings: function(evt)
		{
			if (!this.checkFormValidityBeforeSwitchingForms())
			{
				return;
			}
			this.$el.find("a[data-setting]").removeClass("current");
			$(evt.currentTarget).addClass("current");
			this.currentFormID = "othersForm";
			this.fillPartialDivWithStorageSettings();
		},
		fillPartialDivWithStorageSettings: function()
		{
			let $targetDiv = this.$el.find('div[data-name="sidebarDependentContent"]');
			let storageTemplate = JST["strut.electron_config/partials/LogoRowElectronConfigStorageSettings"];
			let templateData = {
				storage: lang.electron_config_settings.storage,
				browse: lang.browse,
				presentationFolder: lang.electron_config_settings.presentationFolder,
				recentFilesCount: lang.electron_config_settings.recentFilesCount
			};
			let storageHTML = storageTemplate(templateData);
			$targetDiv.html(storageHTML);
			this.initializeStorageForm();
		},
		fillPartialDivWithMonitorSettings: function()
		{
			let $targetDiv = this.$el.find('div[data-name="sidebarDependentContent"]');
			let monitorTemplate = JST["strut.electron_config/partials/LogoRowElectronConfigMonitorSettings"];
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
			let currentForm = this.$el.find('form[data-id="' + this.currentFormID + '"]');
			currentForm.find('input[data-id="StrutPresentationsFolderTextBox"]').val(currentConfig.storage.presentationFolder);
			currentForm.find('input[data-id="RecentFilesCount"]').val(currentConfig.storage.recentFilesCount);
		},
		initializeMonitorForm()
		{
			// Initialize the fields present in the Monitor Form with values (from the last Configuration Settings or Default ones)
			let currentConfig = this.electronConfigInterface.getConfig();
			let currentForm = this.$el.find('form[data-id="' + this.currentFormID + '"]');
			currentForm.find('input[data-id="controlMonitorName"]').val(currentConfig.monitor.controlMonitor);
			currentForm.find('input[data-id="controlMonitorWidth"]').val(currentConfig.monitor.controlMonitorResolution.split("x")[0]);
			currentForm.find('input[data-id="controlMonitorHeight"]').val(currentConfig.monitor.controlMonitorResolution.split("x")[1]);
			currentForm.find('input[data-id="presentationMonitorName"]').val(currentConfig.monitor.presentationMonitor);
			currentForm.find('input[data-id="presentationMonitorWidth"]').val(currentConfig.monitor.presentationMonitorResolution.split("x")[0]);
			currentForm.find('input[data-id="presentationMonitorHeight"]').val(currentConfig.monitor.presentationMonitorResolution.split("x")[1]);
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
			if (typeof pathArray != "undefined" && pathArray != null && pathArray.length != null && pathArray.length > 0)
			{
				let selectedFolder = pathArray[0];
				selectedFolder = require('path').normalize(selectedFolder);
				let currentForm = this.$el.find('form[data-id="' + this.currentFormID + '"]');
				currentForm.find('input[data-id="StrutPresentationsFolderTextBox"]').val(selectedFolder);
				let tempConfig = this.electronConfigInterface.getConfig();
				tempConfig.storage.presentationFolder = selectedFolder;
			}
			// console.log("Presentation folder = " + tempConfig.storage.presentationFolder);
		},
		onInputRecentFilesCount: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				tempConfig.storage.recentFilesCount = evt.currentTarget.value;
			}
			console.log("Recent File Count = " + tempConfig.storage.recentFilesCount);
		},

		// Monitor Settings Event Handlers : 

		onInputControlMonitorName: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				tempConfig.monitor.controlMonitor = evt.currentTarget.value;
			}
			console.log("Control monitor = " + tempConfig.monitor.controlMonitor);
		},

		onInputControlMonitorWidth: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				let height = tempConfig.monitor.controlMonitorResolution.split("x")[1];
				let width = evt.currentTarget.value;
				tempConfig.monitor.controlMonitorResolution = width + "x" + height;
			}
			console.log("Control monitor Resolution = " + tempConfig.monitor.controlMonitorResolution);
		},

		onInputControlMonitorHeight: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				let width = tempConfig.monitor.controlMonitorResolution.split("x")[0];
				let height = evt.currentTarget.value;
				tempConfig.monitor.controlMonitorResolution = width + "x" + height;
			}
			console.log("Control monitor Resolution = " + tempConfig.monitor.presentationMonitor);
		},

		onInputPresentationMonitorName: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				tempConfig.monitor.presentationMonitor = evt.currentTarget.value;
			}
			console.log("Presentation monitor = " + tempConfig.monitor.presentationMonitorResolution);
		},

		onInputPresentationMonitorWidth: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				let height = tempConfig.monitor.controlMonitorResolution.split("x")[1];
				let width = evt.currentTarget.value;
				tempConfig.monitor.presentationMonitorResolution = width + "x" + height;
			}
			console.log("Presentation monitor Resolution = " + tempConfig.monitor.presentationMonitorResolution);
		},

		onInputPresentationMonitorHeight: function(evt)
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			if (evt.currentTarget.checkValidity())
			{
				let width = tempConfig.monitor.controlMonitorResolution.split("x")[0];
				let height = evt.currentTarget.value;
				tempConfig.monitor.presentationMonitorResolution = width + "x" + height;
			}
			console.log("Presentation monitor Resolution = " + tempConfig.monitor.presentationMonitorResolution);
		},

		// FOOTER EVENTS HANDLER
		saveConfig: function()
		{
			let tempConfig = this.electronConfigInterface.getConfig();
			let currentForm = this.$el.find('form[data-id="' + this.currentFormID + '"]')[0];
			if (currentForm.reportValidity())
			{
				this.configureAlertBox("success", "visible");
				this.electronConfigInterface.setConfig(tempConfig);
				return;
			}
			else
			{
				this.configureAlertBox("error", "visible");
				return;
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