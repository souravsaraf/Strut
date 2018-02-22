define([
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
	'tantaman/web/local_storage/main',
	// 'tantaman/web/remote_storage/main',
	// The modules below will be loaded , but not initialized right now.
	'strut/startup/main'
	],
function(ServiceRegistry) {
	// Below we have an array of module names which will be loaded , but initialized later.
	let moduleNamesToBeInitializedLater = 
	[
		'strut/startup/main'
	];
	let laterCount = moduleNamesToBeInitializedLater.length;
	let totalModulesCount = arguments.length;
	let stopAt = totalModulesCount - laterCount;
	
	let registry = new ServiceRegistry();
	// var args = Array.prototype.slice.call(arguments, 0);
	
	// Load and Initialize in registry the core modules of Strut which are required for both website and desktop app.
	for (let i=1; i<stopAt; i++)
	{
		arguments[i].initialize(registry);
	}
	
	// Loading Strut's  modules which are specific to desktop app.
	if(window.isElectron())
	{
		var electronModules = 
		[
			'strut/electron_config/main',
			'tantaman/web/file_storage/main',
		];
		for(let i=0; i<electronModules.length; i++)
		{
			let x = require(electronModules[i]);
			x.initialize(registry);
		}
	}
	
	// Initialize the remaining Strut modules which are needed for both scenearios(Web app and desktop app).
	for(let i=stopAt; i<totalModulesCount; i++)
	{
		arguments[i].initialize(registry);
	}
	
	return registry;
});