define([],
	function() {
		'use strict';

		/* 
			Idea Behind this Interface: 
			
			We have an object called "Strut_electronConfig" in the localStorage (basically stored in a file).
			We create a copy of that object and store it in window.electronConfig for faster processing (so we dont have to read it from file everytime).
			Next, we haved to provide a functionality called "SaveConfig" and "Cancel" on this object.
			For this purpose, we maintain an object called "ElectronConfigInterface.localCopyOfElectronConfig". We will do the saving of temporary values in this object and when the user calls SaveConfig() we will just write this value to both window.electronConfig and "localStorage.Strut_electronConfig".
			If user calls Cancel() we dont touch the objects "window.electronConfig" and "localStorage.Strut_electronConfig" AND we revert back "ElectronConfigInterface.localCopyOfElectronConfig" = "window.electronConfig".
		*/

		/*
			At the beginning or after every setConfig() call , we have 
			this.localCopyOfElectronConfig = window.electronConfig = localStorage.getItem("Strut_electronConfig");
			
			The expected structure of the object this.localCopyOfElectronConfig is ---->
			{
				"storage": {
								"presentationFolder": "path/to/presentation/folder",
								"recentFilesCount": 5
						   },
				"monitor": {
								"controlMonitor": "controlMonitorName",
								"controlMonitorResolution": "1368x768",
								"presentationMonitor": "presentationMonitorName",
								"presentationMonitorResolution": "2048 × 1080"
						   }
			}
		*/

		function ElectronConfigInterface() {
			if (!(this instanceof ElectronConfigInterface)) {
				throw new TypeError("ElectronConfigInterface constructor cannot be called as any regular function, u have to use the 'new' keyword.");
			}

			if (ElectronConfigInterface._instance) {
				//this allows the constructor to be called multiple times
				//and refer to the same instance. Another option is to
				//throw an error.
				return ElectronConfigInterface._instance;
			}
			ElectronConfigInterface._instance = this;
			//ElectronConfigInterface initialization code

			let electron_config_settings = require('electron').remote.require('electron-settings');
			this.localCopyOfElectronConfig = JSON.parse(JSON.stringify(electron_config_settings.getAll()));
			window.electronConfig = this.localCopyOfElectronConfig;
		}

		ElectronConfigInterface.prototype = {
			constructor: ElectronConfigInterface,
			getConfig: function() {
				return this.localCopyOfElectronConfig;
			},

			setConfig: function(electronConfigJsonObject) {
				this.localCopyOfElectronConfig = electronConfigJsonObject;
				window.electronConfig = this.localCopyOfElectronConfig;
				let electron_config_settings = require('electron').remote.require('electron-settings');
				electron_config_settings.setAll(electronConfigJsonObject);
			}

			// Does not make sense to have to add, update or delete functions because the user can just manipulate the ElectronConfigInterface.localCopyOfElectronConfig object using Javascript.
		};

		return ElectronConfigInterface;
	});