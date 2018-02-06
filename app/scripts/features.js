define([
	'framework/ServiceRegistry',
	'strut/etch_extension/main',
	'strut/storage/main',
	'strut/logo_row/main',
	'strut/startup/main',
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
	],
function(ServiceRegistry) {
	var registry = new ServiceRegistry();

	var args = Array.prototype.slice.call(arguments, 0);
	
	// LOAD ALL MODULES EXCEPT THE LAST MODULE ie, 'strut/startup/main'.
	// Loading Strut's core modules which are required for both website and desktop app.
	var i = 0;
	for (var i = 1; i < args.length; ++i) {
		args[i].initialize(registry);
	}
	
	// Loading Strut's  modules which are specific to desktop app.
	if(window.isElectron())
	{
		var electronModules = 
		[
			'tantaman/web/file_storage/main',
			'strut/electron_config/main'
		];
		for(var i=0; i<electronModules.length; i++)
		{
			let x = require(electronModules[i]);
			x.initialize(registry);
		}
	}
	
	// Load the remaining Strut modules which are needed for both scenearios (Web app and desktop app).
	var remainingStrutModules = 
	[
	];
	for(var i=0; i<remainingStrutModules.length; i++)
	{
		let x = remainingStrutModules[i];
		let y = [x];
		require(y, function()
		{
			arguments[0].initialize(registry);
		});
	}
	
	return registry;
});