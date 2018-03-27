define(["backbone", "lang", "lodash"], function(Backbone, lang, _)
{
	"use strict";
	return Backbone.View.extend(
	{
		className: "AddLibraryModal modal hide",
		events:
		{
			'keyup #tagsInput-flexdatalist': "validateTags",
			'click button[data-id="clearAllTagsButton"]': "clearTags",
			'click button[data-id="autoGenerateTagsButton"]': "autoGenerateTags",

			// Footer Events
			"click .modal-footer button.close": function()
			{
				this.$el.find(".modal-footer div.alert").css("visibility", "hidden");
			},
			'click a[data-button_name="save"]': "save",
			'click a[data-button_name="cancel"]': "cancel"
		},

		// General Backbone View Functions

		dispose: function() {},
		constructor: function AddToLibraryModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},

		initialize: function()
		{
			this.editorModel = this.options.editorModel;
			this.electronLibraryInterface = this.options.electronLibraryInterface;
			this.mode = this.options.mode;
			delete this.options.editorModel;
			delete this.options.electronLibraryInterface;
			delete this.options.mode;

			this.title = lang.tagLibrary.addToLibrary;
			this.template = JST["strut.tagLibrary/AddToLibraryModal"];

			this.formInvalidMessage = lang.invalid_form_input;
			this.min3TagsMessage = lang.tagLibrary.min3Tags;
			this.insertSuccessMessage = lang.insert_successful;
			this.editSuccessMessage = lang.update_successful;

			if (this.mode == "add")
			{
				this.initializeAddLibrary();
			}
			else
			{
				this.initializeEditLibrary();
			}
		},

		initializeAddLibrary: function()
		{
			this.render();
			this.$el.find('input[data-id="PresentationFileNameTextBox"]')[0].value = this.editorModel.fileName();
			this.$el.find('input[data-id="PresentationFileNameTextBox"]').prop('readonly', true);
			this.$el.find('input[data-id="PresentationTitleTextBox"]').val("");
			this.$el.find('div[data-id="historyDiv"]').hide();
			this.populateDataList();
			this.$el.find('#tagsInput').flexdatalist(
			{
				minLength: 1,
				searchDisabled: false,
				multiple: true,
				maxShownResults: 5,
				searchIn: 'tag',
				data: window.sessionMeta.allTags,
				visibleProperties: ['tag']
			});
			// this.$el.find('#tagsInput').flexdatalist('data', window.sessionMeta.allTags);
			this.$el.find('ul.flexdatalist-multiple').css("border", "1px solid #cccccc");
			this.$el.find('#tagsInput-flexdatalist').css("margin-bottom", "0px");
			this.$el.find('#tagsInput-flexdatalist').css("width", "initial");
			this.$el.find('#tagsInput-flexdatalist').attr('placeholder', lang.tagLibrary.addTagsMessage);
			this.configureAlertBox(this.insertSuccessMessage, "success", "hidden");
		},

		initializeEditLibrary: function()
		{
			this.configureAlertBox("", "success", "hidden");
		},

		render: function()
		{
			this.$el.html(this.template(
			{
				title: this.title,
				filename: lang.tagLibrary.filename,
				presentationtitle: lang.tagLibrary.presentationtitle,
				tags: lang.tagLibrary.tags,
				clearAllTags: lang.tagLibrary.clearAllTags,
				autoGenerateTags: lang.tagLibrary.autoGenerateTags,
				history: lang.tagLibrary.history,
				clear: lang.clear,
				save: lang.save,
				cancel: lang.cancel
			}));
		},

		populateDataList: function()
		{
			if (typeof window.sessionMeta.allTags == 'undefined' || window.sessionMeta.allTags.length == 0)
			{
				window.sessionMeta.allTags = this.electronLibraryInterface.getAllTags();
			}
			let optionsHTML = "";
			for (let i = 0; i < window.sessionMeta.allTags.length; i++)
			{
				optionsHTML += '<options value="' + window.sessionMeta.allTags[i].tag + '"></options>';
			}
			this.$el.find('#allTags').html(optionsHTML);
			// this.$el.find('#tagsInput').flexdatalist('data', window.sessionMeta.allTags);
			// console.dir(this.$el.find('#allTags'));
			// this.$el.find('#tagsInput-flexdatalist').prop("list", "allTags");
		},

		clearTags: function()
		{
			let x = [];
			this.$el.find('#tagsInput').flexdatalist('value', x);
			this.$el.find('#tagsInput-flexdatalist').focus();
		},

		// Converts all characters to lowercase and removes all characters not in [0-9a-z_-]
		processTags: function(tagsArray)
		{
			let processedTagsArray = [];
			for (let i = 0; i < tagsArray.length; i++)
			{
				let currentTag = tagsArray[i];
				currentTag = currentTag.toLowerCase();
				let processedTag = currentTag.replace(/[^a-z0-9_-]/g, '');
				processedTagsArray[i] = processedTag;
			}
			return processedTagsArray;
		},

		autoGenerateTags: function()
		{
			try
			{
				let x = [];
				this.$el.find('#tagsInput').flexdatalist('value', x);
				let generators = this.editorModel.registry.getBest('strut.presentation_generator.GeneratorCollection');
				let required_generator = generators[0];
				let htmlString = required_generator.generate(this.editorModel.deck());
				let text = this.electronLibraryInterface.getTextFromHTML(htmlString);
				let tags = this.electronLibraryInterface.getTagsFromText(text);
				tags = _.uniq(tags);
				tags = this.processTags(tags);
				this.$el.find('#tagsInput').flexdatalist('value', tags);
			}
			catch (error)
			{
				alert(error);
			}
			this.$el.find('#tagsInput-flexdatalist').focus();
		},

		validateTags: function(e)
		{
			if (e.keyCode == 13)
			{
				let values_array = this.$el.find('#tagsInput').flexdatalist('value');
				let new_values = [];
				for (let i = 0; i < values_array.length; i++)
				{
					let current_value = values_array[i].toLowerCase();
					let regex = new RegExp('[^a-z0-9_-]', 'g');
					let match_array = current_value.split(regex);
					if (current_value !== match_array[0])
					{
						for (let j = 0; j < match_array.length; j++)
						{
							new_values[i + j] = match_array[j];
						}
					}
					else
					{
						new_values[i] = current_value;
					}
				}
				this.$el.find('#tagsInput').flexdatalist('value', new_values);
			}
		},

		show: function()
		{
			this.$el.modal("show");
		},

		// FOOTER EVENTS HANDLER

		configureAlertBox: function(message, status, visibility)
		{
			let correctClass = "alert-" + status;
			let $alert_box_div = this.$el.find(".modal-footer div.alert");
			$alert_box_div.removeClass("alert-error alert-success");
			$alert_box_div.addClass(correctClass);
			$alert_box_div.contents()[0].nodeValue = message;
			$alert_box_div.css("visibility", visibility);
		},

		updateDataListWithCurrentTags: function()
		{
			try
			{
				let newTags = this.$el.find('#tagsInput').flexdatalist('value');
				let windowTags = window.sessionMeta.allTags;
				windowTags = _.pluck(windowTags, 'tag');
				windowTags = windowTags.concat(newTags);
				windowTags = _.uniq(windowTags);
				windowTags = $.map(windowTags, function(val, i)
				{
					return {
						tag: val
					}
				});
				window.sessionMeta.allTags = windowTags;
				this.$el.find('#tagsInput').flexdatalist('data', window.sessionMeta.allTags);
			}
			catch (error)
			{
				console.dir(error);
				alert(error);
			}
		},

		insertLibraryItem: function()
		{
			let currentForm = this.$el.find('form[data-id="addToLibraryForm"]')[0];
			let totalTagsLength = this.$el.find('#tagsInput').flexdatalist('value').length;
			if (currentForm.reportValidity() && totalTagsLength > 2)
			{
				let libraryItem = [];
				libraryItem[0] = this.$el.find('input[data-id="PresentationFileNameTextBox"]').val();
				libraryItem[1] = this.$el.find('input[data-id="PresentationTitleTextBox"]').val();
				libraryItem[2] = this.$el.find('#tagsInput').flexdatalist('value');
				libraryItem[3] = ""; // history is empty string at start
				try
				{
					this.electronLibraryInterface.insertNewLibraryItem(libraryItem);
					this.configureAlertBox(this.insertSuccessMessage, "success", "visible");
					return;
				}
				catch (error)
				{
					alert(error);
				}
			}
			else
			{
				if (totalTagsLength < 3)
				{
					this.$el.find('#tagsInput-flexdatalist').focus();
					this.configureAlertBox(this.min3TagsMessage, "error", "visible");
					return;
				}
				this.configureAlertBox(this.formInvalidMessage, "error", "visible");
				return;
			}
		},

		updateLibraryItem: function()
		{
			let currentForm = this.$el.find('form[data-id="addToLibraryForm"]')[0];
			let totalTagsLength = this.$el.find('#tagsInput').flexdatalist('value').length;
			if (currentForm.reportValidity() && totalTagsLength > 2)
			{
				this.configureAlertBox(this.editSuccessMessage, "success", "visible");
				return;
			}
			else
			{
				if (totalTagsLength < 3)
				{
					this.$el.find('#tagsInput-flexdatalist').focus();
					this.configureAlertBox(this.min3TagsMessage, "error", "visible");
					return;
				}
				this.configureAlertBox(this.formInvalidMessage, "error", "visible");
				return;
			}
		},

		save: function()
		{
			if (this.mode == "add")
			{
				this.insertLibraryItem();
				this.updateDataListWithCurrentTags();
			}
			else
			{
				this.updateLibraryItem();
				this.updateDataListWithCurrentTags();
			}
		},

		cancel: function()
		{
			this.$el.modal("hide");
		}
	});
});