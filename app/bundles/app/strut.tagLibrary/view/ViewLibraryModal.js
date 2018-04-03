define(["backbone", "lang", "datatable", "./ViewSingleLibraryItem", "strut/deck/Deck"], function(Backbone, lang, DataTable, ViewSingleLibraryItem, Deck)
{
	"use strict";
	return Backbone.View.extend(
	{
		attributes:
		{
			"data-backdrop": "static",
			"data-keyboard": false
		},
		className: "ViewLibraryModal modal hide",
		events:
		{
			'keyup input[data-id="searchParameter"]': 'searchOnKeyUp',
			'click button[data-id="searchButton"]': 'searchOnClick',
			'click button[data-id="resetButton"]': 'resetSearch',
			'click table[data-id="datatable"] td:not(:nth-child(5))': 'viewItem',
			'click a[data-id="deleteItem"]': 'deleteItem',
			'click a[data-id="previewItem"]': 'previewItem',
			'click a[data-id="closePreviewButton"]': 'previewClose'
		},

		// General Backbone View Functions

		dispose: function()
		{
			console.log("Exiting ViewLibraryModal");
		},
		constructor: function ViewLibraryModal()
		{
			Backbone.View.prototype.constructor.apply(this, arguments);
		},
		initialize: function()
		{
			this.editorModel = this.options.editorModel;
			this.electronLibraryInterface = this.options.electronLibraryInterface;
			this.mode = this.options.mode;
			this.allDatabaseRows = null;
			delete this.options.editorModel;
			delete this.options.electronLibraryInterface;
			delete this.options.mode;

			this.title = lang.tagLibrary.viewLibrary;
			this.template = JST["strut.tagLibrary/ViewLibraryModal"];

			this.render();
			if (this.mode == "browse")
			{
				this.initializeBrowseView();
			}
			else
			{
				this.initializeSuggestionsView();
			}
		},
		render: function()
		{
			this.$el.html(this.template(
			{
				title: this.title,
				file: lang.file,
				libraryItemTitle: lang.tagLibrary.title,
				tags: lang.tagLibrary.tags,
				history: lang.tagLibrary.history,
				search: lang.search,
				reset: lang.reset,
				searchBy: lang.tagLibrary.searchBy,
				previewMessage: lang.tagLibrary.previewMessage
			}));
		},
		show: function()
		{
			this.$el.modal("show");
		},

		initializeBrowseView: function()
		{
			let $targetDiv = this.$el.find('div[data-id="searchResultsView"]');
			let browseTemplate = JST["strut.tagLibrary/partials/DatatableView"];
			let browseHTML = browseTemplate();
			$targetDiv.html(browseHTML);
			this.allDatabaseRows = this.electronLibraryInterface.getAllLibraryItems();
			// console.log(this.allDatabaseRows);
			let $table = this.$el.find('table[data-id="datatable"]');
			$table.DataTable(
			{
				"data": this.allDatabaseRows,
				"pagingType": "numbers",
				"autoWidth": false,
				"dom": "tlp",
				"ordering": true,
				"stripeClasses": [],
				"searching": true,
				"columns": [
				{
					"data": "file",
					"width": "5vw",
					"render": function(data, type, row, meta)
					{
						if (data)
						{
							if (data.lastIndexOf(window.sessionMeta.pathSeparator) > -1)
							{
								return data.substring(data.lastIndexOf(window.sessionMeta.pathSeparator) + 1, data.length);
							}
							else
							{
								return data;
							}
						}
						else return "";
					}
				},
				{
					"data": "title",
					"width": "5vw"
				},
				{
					"data": "tags",
					"width": "10vw",
					"render": function(data, type, row, meta)
					{
						if (data)
						{
							let regex = new RegExp(",", 'g');
							return data.replace(regex, " , ");
						}
						else return "";
					}
				},
				{
					"data": "history",
					"width": "4vw",
					"render": function(data, type, row, meta)
					{
						if (data)
						{
							return data.split(",").length + " items";
						}
						else return "0 items";
					}
				},
				{
					"data": null,
					"width": "4vw"
				}],
				"columnDefs": [
				{
					"render": function(data, type, row, meta)
					{
						return `<a data-id="editItem" title="` + lang.edit + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-pencil"></i></a> 
						<a data-id="deleteItem" title="` + lang.delete + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-remove"></i></a> 
						<a data-id="previewItem" title="` + lang.preview + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-eye-open"></i></a>`;
					},
					"targets": 4,
					"sorting": false,
					"orderable": false,
					"searchable": false,
					"visible": true
				}]
			});
		},

		initializeSuggestionsView: function()
		{
			return;
		},

		// Modal Body Events

		searchOnKeyUp: function(evt)
		{
			let table = this.$el.find('table[data-id="datatable"]').DataTable();
			let columnToSearch = this.$el.find('select[data-id="searchCriteria"]')[0].selectedIndex;
			table.columns(columnToSearch).search(evt.currentTarget.value).draw();
		},

		searchOnClick: function()
		{
			let text = this.$el.find('input[data-id="searchParameter"]').val();
			let table = this.$el.find('table[data-id="datatable"]').DataTable();
			let columnToSearch = this.$el.find('select[data-id="searchCriteria"]')[0].selectedIndex;
			table.columns(columnToSearch).search(text).draw();
		},

		resetSearch: function()
		{
			let table = this.$el.find('table[data-id="datatable"]').DataTable();
			this.$el.find('select[data-id="searchCriteria"]')[0].selectedIndex = 0;
			table.columns(0).search("").draw();
		},

		viewItem: function(evt)
		{
			try
			{
				let table = this.$el.find('table[data-id="datatable"]').DataTable();
				let row = table.row($(evt.currentTarget).closest('tr'));
				let filename = table.cell(row, 0).data();
				let requiredDatabaseRow = null;
				for (let i = 0; i < this.allDatabaseRows.length; i++)
				{
					if (this.allDatabaseRows[i].file == filename)
					{
						requiredDatabaseRow = this.allDatabaseRows[i];
					}
				}
				if (requiredDatabaseRow !== null)
				{
					let templateData = {};
					templateData.details = lang.tagLibrary.details;
					templateData.filename = requiredDatabaseRow.file;
					templateData.presentationTitle = requiredDatabaseRow.title;
					let regex = new RegExp(",", 'g');
					templateData.tags = requiredDatabaseRow.tags ? requiredDatabaseRow.tags.replace(regex, " , ") : "";
					templateData.history = requiredDatabaseRow.history ? requiredDatabaseRow.history.replace(regex, "\r\n") : "";
					this.$el.find('.modal.ViewSingleLibraryItem').remove();
					let viewSingleLibraryItem = new ViewSingleLibraryItem(
					{
						templateData: templateData
					});
					this.$el.append(viewSingleLibraryItem.$el);
					viewSingleLibraryItem.show();
				}
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		deleteItem: function(evt)
		{
			try
			{
				let table = this.$el.find('table[data-id="datatable"]').DataTable();
				let row = table.row($(evt.currentTarget).closest('tr'));
				let filename = table.cell(row, 0).data();
				if (window.confirm("Delete Library Item '" + filename + "' ?"))
				{
					this.electronLibraryInterface.deleteLibraryItem(filename);
					this.allDatabaseRows = this.electronLibraryInterface.getAllLibraryItems();
					table.clear().rows.add(this.allDatabaseRows).draw();
				}
				else
				{
					return;
				}
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		showStrutInIFrame(filename)
		{
			let fs = require('fs');
			let remote = require('electron').remote;
			let win = remote.getCurrentWindow();
			win.webContents.session.clearCache(function()
			{
				//some callback.
			});
			let generators = this.editorModel.registry.getBest('strut.presentation_generator.GeneratorCollection');
			let required_generator = generators[0];
			let jsonString = fs.readFileSync(filename, "utf8");
			let rawobj = JSON.parse(jsonString);
			let deck = new Deck();
			deck.import(rawobj);
			let previewStr = required_generator.generate(deck);
			this.oldPreviewString = localStorage.getItem('preview-string');
			this.oldPreviewConfig = localStorage.getItem('preview-config');
			localStorage.setItem('preview-string', previewStr);
			localStorage.setItem('preview-config', JSON.stringify(
			{
				surface: deck.surface
			}));
			let url = 'preview_export/impress.html#/step-1?rand=' + Math.round(Math.random() * 10000);
			let iframe = this.$el.find('iframe[data-id="previewFrame"]')[0];
			var clone = iframe.cloneNode(false);
			clone.src = url;
			iframe.parentNode.replaceChild(clone, iframe);
		},

		previewItem: function(evt)
		{
			try
			{
				let table = this.$el.find('table[data-id="datatable"]').DataTable();
				let row = table.row($(evt.currentTarget).closest('tr'));
				let filename = table.cell(row, 0).data();
				this.$el.find('span[data-id="fileToPreview"]').text(filename);
				this.$el.find('p[data-id="previewMessageDiv"]').css("display", "none");
				this.$el.find('iframe[data-id="previewFrame"]').css("display", "inline");
				this.showStrutInIFrame(filename);
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		previewClose: function()
		{
			try
			{
				this.$el.find('span[data-id="fileToPreview"]').text("");
				let iframe = this.$el.find('iframe[data-id="previewFrame"]')[0];
				iframe.src = "empty.html";
				this.$el.find('iframe[data-id="previewFrame"]').css("display", "none");
				this.$el.find('p[data-id="previewMessageDiv"]').css("display", "block");
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		}
	});
});