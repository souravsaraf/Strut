define([
		// Modules common to both web and desktop app, loaded and initialized
		'framework/ServiceRegistry',
		'strut/etch_extension/main',
		'strut/storage/main',
		'strut/logo_row/main',
		'strut/themes/main',
		'strut/editor/main',
		'strut/exporter/json/main',
		'strut/exporter/zip/browser/main',
		'strut/importer/json/main',
		'strut/importer/main',
		'strut/exporter/main',
		'strut/presentation_generator/impress/main',
		'strut/presentation_generator/bespoke/main',
		'strut/presentation_generator/handouts/main',
		'strut/presentation_generator/main',
		'tantaman/web/saver/main',
		'strut/slide_editor/main',
		'strut/transition_editor/main',
		'strut/slide_components/main',
		'strut/well_context_buttons/main',

		// Web app modules which are loaded , but initialized conditionally (via counter named "stopAt")
		'tantaman/web/local_storage/main',

		// Modules common to both web and desktop app, loaded but initialized later
		'strut/startup/main'
	],
	function(ServiceRegistry)
	{
		// Web app modules to be initialized later
		let webModuleNamesToBeInitializedLater = [
			'tantaman/web/local_storage/main'
		];

		// Modules common to both web and desktop app, loaded but initialized later
		let commonModuleNamesToBeInitializedLater = [
			'strut/startup/main'
		];

		let webLater = webModuleNamesToBeInitializedLater.length;
		let commonLater = commonModuleNamesToBeInitializedLater.length;
		let totalModulesCount = arguments.length;
		let stopAt = totalModulesCount - (webLater + commonLater);

		let registry = new ServiceRegistry();
		// var args = Array.prototype.slice.call(arguments, 0);

		// Load and Initialize in registry the core modules of Strut which are required for both website and desktop app.
		for (let i = 1; i < stopAt; i++)
		{
			arguments[i].initialize(registry);
		}

		// Loading Strut's  modules which are specific to desktop app.
		if (window.isElectron())
		{
			var electronModules = [
				'tantaman/web/file_storage/main',
				'strut/tagLibrary/main',
				'strut/electron_config/main'
			];
			for (let i = 0; i < electronModules.length; i++)
			{
				let x = require(electronModules[i]);
				x.initialize(registry);
			}

			// Skipping initialization of web modules which were supposed to be initialized later, coz we are running electron app.
			stopAt = stopAt + webLater;
		}

		// Initialize the remaining Strut modules which are needed for both scenearios(Web app and desktop app).
		for (let i = stopAt; i < totalModulesCount; i++)
		{
			arguments[i].initialize(registry);
		}

		return registry;
	});