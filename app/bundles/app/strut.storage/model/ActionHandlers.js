define(
function() {
	return {
		save: function(storageInterface, model, filename, cb) {
			console.log("Inside ActionHandler.js , Save or SaveAs presentation was called");
			// As soon as "File-->SaveAs" is clicked , this is the first function that gets called. See 'strut.storage/main.js line 36'
			storageInterface.savePresentation(filename, model.exportPresentation(filename), cb);
			window.sessionMeta.isNewPresentation = 0;
		},

		open: function(storageInterface, model, filename, cb) {
			storageInterface.savePresentation(
				model.fileName(),
				model.exportPresentation(model.fileName()),
				function () {
					storageInterface.load(filename, function(data, err) {
						if (!err) {
							model.importPresentation(data);
						} else {
							console.log(err);
							console.log(err.stack);
						}

						cb(null, err);
					});
				});
			window.sessionMeta.isNewPresentation = 0;
		},

		new_: function(model) {
			// As soon as "File-->New" is clicked , this is the first function that gets called. Thus we can say it is the event listener or action handler (as the name ActionHandlers.js suggests) of the "File-->New" button. See 'strut.storage/main.js line 32'
			console.log("Inside ActionHandler.js , 'File-->New' was clicked");
			window.sessionMeta.isNewPresentation = 1;
			model.newPresentation();
		}
	};
});