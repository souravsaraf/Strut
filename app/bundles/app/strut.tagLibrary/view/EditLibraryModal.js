define(["backbone", "lang", "lodash", "datatable", "strut/deck/Deck"], function(Backbone, lang, _, Datatable, Deck)
{
	"use strict";
	return Backbone.View.extend(
	{
		className: "EditLibraryModal modal fade hide",
		attributes:
		{
			"data-backdrop": false,
			"data-keyboard": false
		},
		events:
		{
			// Header Events
			'click button[data-dismiss="modal_inner"]': function(evt)
			{
				if (this.parent == document.body)
				{
					this.parent.querySelectorAll('.modal-backdrop')[0].remove();
				}
				else
				{
					this.parent.$el.find('.modal-backdrop').remove();
				}
				this.$el.modal("hide");
				this.$el.data('modal', null);
			},

			// Body events
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
		constructor: function EditLibraryModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},

		initialize: function()
		{
			this.editorModel = this.options.editorModel;
			this.electronLibraryInterface = this.options.electronLibraryInterface;
			this.rowToEdit = this.options.rowToEdit;
			this.parent = this.options.parent;
			delete this.options.editorModel;
			delete this.options.electronLibraryInterface;
			delete this.options.rowToEdit;
			delete this.options.parent;

			this.template = JST["strut.tagLibrary/EditLibraryModal"];

			this.formInvalidMessage = lang.invalid_form_input;
			this.min3TagsMessage = lang.tagLibrary.min3Tags;
			this.insertSuccessMessage = lang.insert_successful;
			this.editSuccessMessage = lang.update_successful;

			this.render();
			this.initializeEditLibrary();
		},

		initializeEditLibrary: function()
		{
			// use this.this.rowToEdit here;
			this.$el.find('input[data-id="PresentationFileNameTextBox"]')[0].value = this.rowToEdit.file;
			this.$el.find('input[data-id="PresentationFileNameTextBox"]').prop('readonly', false);
			this.$el.find('input[data-id="PresentationTitleTextBox"]').val(this.rowToEdit.title);
			this.$el.find('input[data-id="thumbnailSlideInput"]').val(this.rowToEdit.thumbnailSlide);
			let h = this.$el.find('label[data-id="historyLabel"]').text();
			if (this.rowToEdit.history)
			{
				h = h.replace("_", "" + this.rowToEdit.history.split(",").length + "");
			}
			else
			{
				h = h.replace("_", "0");
			}
			this.$el.find('label[data-id="historyLabel"]').text(h);
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
			this.$el.find('#tagsInput').flexdatalist('value', this.rowToEdit.tags);
			this.$el.find('ul.flexdatalist-multiple').css("border", "1px solid #cccccc");
			this.$el.find('#tagsInput-flexdatalist').css("margin-bottom", "0px");
			this.$el.find('#tagsInput-flexdatalist').css("width", "initial");
			this.$el.find('#tagsInput-flexdatalist').attr('placeholder', lang.tagLibrary.addTagsMessage);
			this.$el.find('ul.flexdatalist-multiple > li.input-container').css('width', 'auto');
			this.configureAlertBox(this.insertSuccessMessage, "success", "hidden");
		},

		render: function()
		{
			this.$el.html(this.template(
			{
				title: lang.tagLibrary.editLibrary,
				filename: lang.tagLibrary.filename,
				presentationtitle: lang.tagLibrary.presentationtitle,
				thumbnailSlide: lang.tagLibrary.thumbnailSlide,
				tags: lang.tagLibrary.tags,
				clearAllTags: lang.tagLibrary.clearAllTags,
				autoGenerateTags: lang.tagLibrary.autoGenerateTags,
				history: lang.tagLibrary.history,
				historyContains: lang.tagLibrary.historyContains,
				delete: lang.delete,
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
			// let optionsHTML = "";
			// for (let i = 0; i < window.sessionMeta.allTags.length; i++)
			// {
			// 	optionsHTML += '<options value="' + window.sessionMeta.allTags[i].tag + '"></options>';
			// }
			// this.$el.find('#allTags').html(optionsHTML);
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
				let fs = require('fs');
				let jsonString = fs.readFileSync(this.rowToEdit.file, "utf8");
				let rawobj = JSON.parse(jsonString);
				let generators = this.editorModel.registry.getBest('strut.presentation_generator.GeneratorCollection');
				let required_generator = generators[0];
				let deck = new Deck();
				deck.import(rawobj);
				let htmlString = required_generator.generate(deck);
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

		writeThumbnailImage: function(slidefileName, slideNumber)
		{
			const fs = require('fs');
			const path = require('path');
			let slideAsString = fs.readFileSync(slidefileName, 'utf8');
			let slideAsObject = JSON.parse(slideAsString);
			let basename = path.basename(slidefileName);
			let imageBasename = basename.replace('strut', 'png');
			let imagePath = path.join(window.sessionMeta.thumbnailsFolder, imageBasename);

			let deck = new Deck();
			deck.import(slideAsObject);
			let generators = this.editorModel.registry.getBest('strut.presentation_generator.GeneratorCollection');
			let required_generator = generators[0];
			let previewString = required_generator.generate(deck);
			let tempFilename = path.join(window.sessionMeta.appPath, 'previewString.txt');
			fs.writeFileSync(tempFilename, previewString);
			let previewConfig = JSON.stringify(
			{
				surface: deck.get('surface')
			});

			let partialUrl = 'preview_export/impress.html#step-' + slideNumber;
			let url1 = 'file://' + path.join(__dirname, 'preview_export/impress.html');
			let url2 = 'file://' + path.join(__dirname, partialUrl);
			let scriptLocation = path.join(require.toUrl(''), requirejs.s.contexts._.config.paths['strut/tagLibrary'], 'view', 'nightmareScreenShot.js');
			let code = 'node "' + scriptLocation + '" "' + tempFilename + '" "' + previewConfig + '" "' + url1 + '" "' + url2 + '" "' + imagePath + '"';
			let child_process = require('child_process');
			console.log(child_process.execSync(code).toString());
		},

		updateLibraryItem: function()
		{
			try
			{
				let currentForm = this.$el.find('form[data-id="editLibraryForm"]')[0];
				let totalTagsLength = this.$el.find('#tagsInput').flexdatalist('value').length;
				if (currentForm.reportValidity() && totalTagsLength > 2)
				{
					// Update Item here
					let libraryItem = {};
					libraryItem.filename = this.$el.find('input[data-id="PresentationFileNameTextBox"]').val();
					libraryItem.title = this.$el.find('input[data-id="PresentationTitleTextBox"]').val();
					libraryItem.thumbnailSlide = this.$el.find('input[data-id="thumbnailSlideInput"]').val();
					libraryItem.tags = this.$el.find('#tagsInput').flexdatalist('value');
					libraryItem.deleteHistory = this.$el.find('input[data-id="deleteHistoryCheckbox"]').prop('checked');
					let oldFileName = this.rowToEdit.file;
					this.writeThumbnailImage(libraryItem.filename, libraryItem.thumbnailSlide);
					this.electronLibraryInterface.updateLibraryItem(libraryItem, oldFileName);
					this.rowToEdit.file = libraryItem.file;
					this.rowToEdit.title = libraryItem.title;
					this.rowToEdit.thumbnailSlide = libraryItem.thumbnailSlide;
					this.rowToEdit.tags = libraryItem.tags;
					this.rowToEdit.deleteHistory = libraryItem.deleteHistory;
					if (this.parent != $('body'))
					{
						let table = this.parent.$el.find('table[data-id="datatable"]').DataTable();
						this.parent.allDatabaseRows = this.electronLibraryInterface.getAllLibraryItems();
						table.clear().rows.add(this.parent.allDatabaseRows).draw();
					}
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
			}
			catch (error)
			{

				console.dir(error);
				alert(error);
			}
		},

		save: function()
		{
			this.updateLibraryItem();
			this.updateDataListWithCurrentTags();
		},

		cancel: function()
		{
			this.$el.modal("hide");
		}
	});
});