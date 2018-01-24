define(['tantaman/web/widgets/MenuItem',
		'framework/ServiceCollection',
		'tantaman/web/widgets/HiddenOpen',
		'framework/Iterator',
		'lang',],
function(MenuItem, ServiceCollection, HiddenOpen, Iterator, lang) {
	'use strict';

	// Very boiler-platey.  Need to get
	// some dynamic dependency injection to declarative
	// wire all this type of stuff up
	var importerCollection = null;
	var hiddenOpen = new HiddenOpen();
	window.console.log('Inside strut.importer/main.js , Before Appending HiddenOpen to body');
	$('body').append(hiddenOpen.render().$el);
	window.console.log('Inside strut.importer/main.js , After Appending HiddenOpen to body');
	
	function fileBrowserLauncher(editorModel) {
		// Launch the file browser
		// forward the file chosen event off to the various registered services...
		window.console.log("Inside strut.importer/main.js fileBrowserLauncher function");
		
		hiddenOpen.trigger(function(file) {
			window.console.log("Inside strut.importer/main.js fileBrowserLauncher function , inside trigger");
			fileChosen(file, editorModel);
			window.console.log("Inside strut.importer/main.js fileBrowserLauncher function , exitting trigger");
		});
	}

	function fileChosen(file, editorModel) {
		var iter = new Iterator(importerCollection);
		window.console.log("Inside strut.importer/main.js fileChosen function");
		
		function next() {
			if (iter.hasNext()) {
				window.console.log("Inside strut.importer/main.js fileChosen'next() function");
				window.console.log("Importing a single file named : " + file.name);
				iter.next().import(file, editorModel, next);
			}
		}

		next();
	}

	var menuProvider = {
		createMenuItems: function(editorModel) {
			return new MenuItem({ title: lang.import, handler: fileBrowserLauncher, model: editorModel});	
		}
	};

	return {
		initialize: function(registry) {
			importerCollection = new ServiceCollection(
					registry, 'strut.importer',
					ServiceCollection.toServiceConverter
				);

			registry.register({
				interfaces: 'strut.LogoMenuItemProvider'
			}, menuProvider);
		}
	};
});