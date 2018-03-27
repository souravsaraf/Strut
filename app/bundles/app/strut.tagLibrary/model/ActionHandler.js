define(
	function()
	{
		return {
			viewLibrary: function(storageInterface, model, filename)
			{
				console.log("Inside ActionHandler.js , Save or SaveAs presentation was called");
			},

			addLibrary: function(storageInterface, model, filename)
			{
				window.sessionMeta.isNewPresentation = 0;
				let generators = this._editorModel.registry.getBest('strut.presentation_generator.GeneratorCollection');
				let required_generator = generators[0];
				let previewStr = generator.generate(this._editorModel.deck());
			},

			exportLibrary: function(model) {},

			importLibrary: function(model) {}
		};
	});