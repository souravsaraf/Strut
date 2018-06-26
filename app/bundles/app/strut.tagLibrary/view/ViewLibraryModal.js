define(["backbone", "lang", "datatable", "./ViewSingleLibraryItem", "./EditLibraryModal", "strut/deck/Deck"], function(Backbone, lang, DataTable, ViewSingleLibraryItem, EditLibraryModal, Deck)
{
	"use strict";
	return Backbone.View.extend(
	{
		attributes:
		{
			"data-backdrop": false,
			"data-keyboard": false
		},
		className: "ViewLibraryModal modal hide",
		events:
		{
			'click button[data-dismiss="modal"]': function(evt)
			{
				// COMPLETELY UNBIND THE VIEW
				this.undelegateEvents();
				this.$el.removeData().unbind();

				// Remove view from DOM
				this.remove();
				Backbone.View.prototype.remove.call(this);
			},
			'change select[data-id="searchCriteria"]': 'searchCriteriaChanged',
			'click button[data-id="searchButton"]': 'searchOnClick',
			'click button[data-id="resetButton"]': 'resetSearch',
			'click a[data-id="displayTableView"]': 'displayTableView',
			'click a[data-id="displayGridView"]': 'displayGridView',
			'click table[data-id="datatable"] td:not(:nth-child(5))': 'viewItemInTable',
			'click a[data-id="editItemInTable"]': 'editItemInTable',
			'click a[data-id="deleteItemInTable"]': 'deleteItemInTable',
			'click a[data-id="previewItemInTable"]': 'previewItemInTable',
			'click a[data-id="closePreviewButton"]': 'previewClose',
			'click a[data-id="editItemInGrid"]': 'editItemInGrid',
			'click a[data-id="deleteItemInGrid"]': 'deleteItemInGrid',
			'click a[data-id="previewItemInGrid"]': 'previewItemInGrid',
			'click img[data-id="slideThumbnail"]': 'viewItemInGrid'
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

			this.template = JST["strut.tagLibrary/ViewLibraryModal"];

			let remote = require('electron').remote;
			let win = remote.getCurrentWindow();
			/*
			win.webContents.session.clearStorageData(
				{
					storages: "filesystem"
				},
				function()
				{
					console.log("filesystem storage cleared");
				});
			*/
			win.webContents.session.clearCache(function()
			{
				console.log("Cache cleared");
			});
			this.render();
			if (this.mode == "browse")
			{
				this.initializeTableView();
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
				title: lang.tagLibrary.viewLibrary,
				file: lang.file,
				libraryItemTitle: lang.tagLibrary.title,
				tags: lang.tagLibrary.tags,
				history: lang.tagLibrary.history,
				search: lang.search,
				reset: lang.reset,
				tableView: lang.tableView,
				gridView: lang.gridView,
				searchBy: lang.tagLibrary.searchBy,
				previewMessage: lang.tagLibrary.previewMessage,
				enterValueToSearch: lang.tagLibrary.enterValueToSearch
			}));
		},
		show: function()
		{
			this.$el.modal("show");
		},

		initializeTableView: function()
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
				"order": [],
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
						return `<a data-id="editItemInTable" title="` + lang.edit + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-pencil"></i></a> 
						<a data-id="deleteItemInTable" title="` + lang.delete + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-remove"></i></a> 
						<a data-id="previewItemInTable" title="` + lang.preview + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-eye-open"></i></a>`;
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

		initializeGridView: function()
		{
			let $targetDiv = this.$el.find('div[data-id="searchResultsView"]');
			let browseTemplate = JST["strut.tagLibrary/partials/GridView"];
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
				"order": [],
				"stripeClasses": [],
				"searching": true,
				"drawCallback": function(settings)
				{
					let tableDOMElement = this[0];
					tableDOMElement.tBodies[0].style.display = 'none';
					if (tableDOMElement.querySelectorAll('div.GridView.GridContainer').length > 0)
					{
						tableDOMElement.removeChild(tableDOMElement.querySelectorAll('div.GridView.GridContainer')[0]);
					}
					let gridContainerDiv = document.createElement('div');
					gridContainerDiv.className = 'GridView GridContainer';
					gridContainerDiv.setAttribute('data-id', 'GridContainerDiv');
					tableDOMElement.appendChild(gridContainerDiv);
					let boxDiv = document.createElement('div');
					boxDiv.style.height = "";
					boxDiv.className = 'box';
					boxDiv.innerHTML = `
						<img src="" data-id="slideThumbnail" style="width: 100%; object-fit: fill; object-position: left top;">
						<p data-id="slideNamePara"></p>
						<p>
							<a data-id="editItemInGrid" title="` + lang.edit + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-pencil"></i></a> 
							<a data-id="deleteItemInGrid" title="` + lang.delete + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-remove"></i></a> 
							<a data-id="previewItemInGrid" title="` + lang.preview + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-eye-open"></i></a>
						</p>`;
					let allDataRows = Array.from(this[0].rows).slice(1, this[0].rows.length); // removing the <th> row by slicing. this[0] variable is the DOM HTMLTableElement corredsponds to the <table>
					$(allDataRows).each(function()
					{
						let fullFilename = $(this).find("td:first").text();
						let title = $(this).find("td:nth-child(2)").text();
						let fileNameToDisplay = "";
						if (fullFilename)
						{
							if (fullFilename.lastIndexOf(window.sessionMeta.pathSeparator) > -1)
							{
								fileNameToDisplay = fullFilename.substring(fullFilename.lastIndexOf(window.sessionMeta.pathSeparator) + 1, fullFilename.length);
							}
							else
							{
								fileNameToDisplay = fullFilename;
							}
						}
						let clonedBoxDiv = boxDiv.cloneNode(true);
						clonedBoxDiv.setAttribute('data-fullFileNamme', fullFilename);
						clonedBoxDiv.getElementsByTagName('p')[0].innerText = fileNameToDisplay;
						const path = require('path');
						const fs = require('fs');
						let imagePath = path.join(window.sessionMeta.thumbnailsFolder, fileNameToDisplay.replace('strut', 'png'));
						let stat = fs.statSync(imagePath);
						let mtime = stat.mtimeMs;
						clonedBoxDiv.getElementsByTagName('img')[0].src = imagePath + '?' + mtime;
						clonedBoxDiv.getElementsByTagName('img')[0].title = fileNameToDisplay + "\n" + title;
						gridContainerDiv.appendChild(clonedBoxDiv);
						// $(this).remove();
					});
					// if (tableDOMElement.tBodies[0]) tableDOMElement.tBodies[0].remove();
				},
				"columns": [
				{
					"data": "file",
					"width": "5vw",
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
				}],
				"columnDefs": [
				{
					"render": function(data, type, row, meta)
					{
						return `<a data-id="editItemInTable" title="` + lang.edit + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-pencil"></i></a> 
						<a data-id="deleteItemInTable" title="` + lang.delete + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-remove"></i></a> 
						<a data-id="previewItemInTable" title="` + lang.preview + `" style="border: solid 1px; padding: 1px; margin: 1px;"><i class="icon-eye-open"></i></a>`;
					},
					"targets": 4,
					"sorting": false,
					"orderable": false,
					"searchable": false,
					"visible": true
				}]
			});
		},

		// Modal Body Events

		searchCriteriaChanged: function(evt)
		{
			if ($(evt.currentTarget)[0].selectedIndex == 2)
			{
				if (typeof window.sessionMeta.allTags == 'undefined' || window.sessionMeta.allTags.length == 0)
				{
					window.sessionMeta.allTags = this.electronLibraryInterface.getAllTags();
				}
				let w = this.$el.find('#libraryItemSearchInput').width();
				w = w - 50;
				this.$el.find('#libraryItemSearchInput').css('flex-grow', '0');
				this.$el.find('#libraryItemSearchInput').width(w);
				this.$el.find('#libraryItemSearchInput').addClass("flexdatalist");
				this.$el.find('#libraryItemSearchInput').flexdatalist(
				{
					minLength: 1,
					searchDisabled: false,
					multiple: true,
					maxShownResults: 5,
					searchIn: 'tag',
					data: window.sessionMeta.allTags,
					visibleProperties: ['tag']
				});
				this.$el.find('ul.flexdatalist-multiple').css("border", "1px solid #cccccc");
				this.$el.find('#libraryItemSearchInput-flexdatalist').css("margin-bottom", "0px");
				this.$el.find('#libraryItemSearchInput-flexdatalist').css("width", "300px");
				this.$el.find('#libraryItemSearchInput-flexdatalist').attr('placeholder', "Search tags separated by space");
			}
			else
			{
				this.$el.find('#libraryItemSearchInput').removeClass("flexdatalist");
				this.$el.find('#libraryItemSearchInput').flexdatalist('destroy');
			}
		},

		searchOnClick: function()
		{
			try
			{
				let text = this.$el.find('#libraryItemSearchInput').val();
				let table = this.$el.find('table[data-id="datatable"]').DataTable();
				let columnToSearch = this.$el.find('select[data-id="searchCriteria"]')[0].selectedIndex;
				if (columnToSearch == 0)
				{
					let searchResult = this.electronLibraryInterface.searchAndDisplayItemsByFile(text);
					table.clear().rows.add(searchResult).draw();
					return;
				}
				if (columnToSearch == 1)
				{
					let searchResult = this.electronLibraryInterface.searchAndDisplayItemsByTitle(text);
					table.clear().rows.add(searchResult).draw();
					return;
				}
				if (columnToSearch == 2)
				{
					let tagsArray = text.split(/[ ,]+/).filter(Boolean);
					let searchResult = this.electronLibraryInterface.searchAndDisplayItemsByTags(tagsArray);
					table.clear().rows.add(searchResult).draw();
					return;
				}
				if (columnToSearch == 3)
				{
					let searchResult = this.electronLibraryInterface.searchAndDisplayItemsByHistory(text);
					table.clear().rows.add(searchResult).draw();
					return;
				}
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		resetSearch: function()
		{
			let table = this.$el.find('table[data-id="datatable"]').DataTable();
			this.allDatabaseRows = this.electronLibraryInterface.getAllLibraryItems();
			table.clear().rows.add(this.allDatabaseRows).draw();
		},

		displayTableView: function()
		{
			this.initializeTableView();
		},

		displayGridView: function()
		{
			this.initializeGridView();
		},

		viewItemInTable: function(evt)
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
					templateData.thumbnailSlide = requiredDatabaseRow.thumbnailSlide;
					let regex = new RegExp(",", 'g');
					templateData.tags = requiredDatabaseRow.tags ? requiredDatabaseRow.tags.replace(regex, " , ") : "";
					templateData.history = requiredDatabaseRow.history ? requiredDatabaseRow.history.replace(regex, "\r\n") : "";
					this.$el.find('.modal.ViewSingleLibraryItem').remove();
					let viewSingleLibraryItem = new ViewSingleLibraryItem(
					{
						parent: this,
						templateData: templateData
					});
					this.$el.append(viewSingleLibraryItem.$el);
					this.$el.append($('<div class="modal-backdrop"></div>'));
					viewSingleLibraryItem.show();
				}
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		editItemInTable: function(evt)
		{
			try
			{
				let table = this.$el.find('table[data-id="datatable"]').DataTable();
				let row = table.row($(evt.currentTarget).closest('tr'));
				let filename = table.cell(row, 0).data();
				let rowData = this.electronLibraryInterface.getAllDataForThisFile(filename);
				if (rowData)
				{
					this.$el.find('.modal.EditLibraryModal').remove();
					let editModal = new EditLibraryModal(
					{
						editorModel: this.editorModel,
						electronLibraryInterface: this.electronLibraryInterface,
						rowToEdit: rowData,
						parent: this
					});
					this.$el.append(editModal.$el);
					this.$el.append($('<div class="modal-backdrop"></div>'));
					editModal.show();
				}
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		deleteItemInTable: function(evt)
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

		editItemInGrid: function(evt)
		{
			try
			{
				let $boxdiv = $(evt.currentTarget).closest('div.box');
				let filename = $boxdiv.attr("data-fullFileNamme");
				let rowData = this.electronLibraryInterface.getAllDataForThisFile(filename);
				if (rowData)
				{
					this.$el.find('.modal.EditLibraryModal').remove();
					let editModal = new EditLibraryModal(
					{
						editorModel: this.editorModel,
						electronLibraryInterface: this.electronLibraryInterface,
						rowToEdit: rowData,
						parent: this
					});
					this.$el.append(editModal.$el);
					this.$el.append($('<div class="modal-backdrop"></div>'));
					editModal.show();
				}
			}
			catch (error)
			{
				console.log(error);
				alert(error);
			}
		},

		deleteItemInGrid: function(evt)
		{
			try
			{
				let table = this.$el.find('table[data-id="datatable"]').DataTable();
				let $boxdiv = $(evt.currentTarget).closest('div.box');
				let filename = $boxdiv.attr("data-fullFileNamme");
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
			return;
		},

		previewItemInGrid: function(evt)
		{
			try
			{
				let $boxdiv = $(evt.currentTarget).closest('div.box');
				let filename = $boxdiv.attr("data-fullFileNamme");
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

		viewItemInGrid: function(evt)
		{
			try
			{
				let $boxdiv = $(evt.currentTarget).closest('div.box');
				let filename = $boxdiv.attr("data-fullFileNamme");
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
					templateData.thumbnailSlide = requiredDatabaseRow.thumbnailSlide;
					let regex = new RegExp(",", 'g');
					templateData.tags = requiredDatabaseRow.tags ? requiredDatabaseRow.tags.replace(regex, " , ") : "";
					templateData.history = requiredDatabaseRow.history ? requiredDatabaseRow.history.replace(regex, "\r\n") : "";
					this.$el.find('.modal.ViewSingleLibraryItem').remove();
					let viewSingleLibraryItem = new ViewSingleLibraryItem(
					{
						parent: this,
						templateData: templateData
					});
					this.$el.append(viewSingleLibraryItem.$el);
					this.$el.append($('<div class="modal-backdrop"></div>'));
					viewSingleLibraryItem.show();
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
			// let remote = require('electron').remote;
			// let win = remote.getCurrentWindow();
			// win.webContents.session.clearCache(function()
			// {
			// 	//some callback.
			// });
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

		previewItemInTable: function(evt)
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