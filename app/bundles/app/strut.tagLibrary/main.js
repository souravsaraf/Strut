define(['tantaman/web/widgets/MenuItem',
		'./view/ViewLibraryModal',
		'./view/AddToLibraryModal',
		'./view/EditLibraryModal',
		'./view/ImportLibraryModal',
		'./view/ExportLibraryModal',
		'./model/ElectronLibraryInterface',
		'./model/ActionHandler',
		'lang',
	],
	function(MenuItem, ViewLibraryModal, AddToLibraryModal, EditLibraryModal, ImportLibraryModal, ExportLibraryModal, ElectronLibraryInterface, ActionHandler, lang)
	{
		'use strict';

		let viewLibraryModal = null;
		let addToLibraryModal = null;
		let importLibraryModal = null;
		let exportLibraryModal = null;
		let electronLibraryInterface = null;
		let $modals = $('#modals');

		let service = {
			createMenuItems: function(editorModel)
			{
				var menuItems = [];

				if (viewLibraryModal == null)
				{
					viewLibraryModal = new ViewLibraryModal(
					{
						editorModel: editorModel,
						electronLibraryInterface: electronLibraryInterface
					});
					viewLibraryModal.render();
					$modals.append(viewLibraryModal.$el);
				}

				if (importLibraryModal == null)
				{
					importLibraryModal = new ImportLibraryModal(
					{
						editorModel: editorModel,
						electronLibraryInterface: electronLibraryInterface
					});
					importLibraryModal.render();
					$modals.append(importLibraryModal.$el);
				}

				if (exportLibraryModal == null)
				{
					exportLibraryModal = new ExportLibraryModal(
					{
						editorModel: editorModel,
						electronLibraryInterface: electronLibraryInterface
					});
					exportLibraryModal.render();
					$modals.append(exportLibraryModal.$el);
				}

				menuItems.push(new MenuItem(
				{
					title: lang.tagLibrary.viewLibrary,
					handler: function()
					{
						$modals.find('.modal.ViewLibraryModal').remove();
						let viewLibraryModal = new ViewLibraryModal(
						{
							editorModel: editorModel,
							electronLibraryInterface: electronLibraryInterface,
							mode: "browse"
						});
						$modals.append(viewLibraryModal.$el);
						viewLibraryModal.show();
					}
				}));

				menuItems.push(new MenuItem(
				{
					title: lang.tagLibrary.addToLibrary,
					handler: function()
					{
						let filename = editorModel.fileName();
						if (window.sessionMeta.isNewPresentation == 1)
						{
							alert("Please Save the file before adding to Library");
							return;
						}
						let rowData = electronLibraryInterface.getAllDataForThisFile(filename);
						if (rowData)
						{
							$modals.find('.modal.EditLibraryModal').remove();
							let editModal = new EditLibraryModal(
							{
								editorModel: this.editorModel,
								electronLibraryInterface: this.electronLibraryInterface,
								rowToEdit: rowData,
								parent: document.body
							});
							$modals.append(editModal.$el);
							$('body').append($('<div class="modal-backdrop"></div>'));
							editModal.show();
						}
						else
						{
							$modals.find('.modal.AddLibraryModal').remove();
							let addToLibraryModal = new AddToLibraryModal(
							{
								editorModel: editorModel,
								electronLibraryInterface: electronLibraryInterface,
								mode: "add"
							});
							$modals.append(addToLibraryModal.$el);
							addToLibraryModal.show();
						}
					}
				}));

				menuItems.push(new MenuItem(
				{
					title: lang.tagLibrary.importLibrary,
					modal: importLibraryModal,
				}));

				menuItems.push(new MenuItem(
				{
					title: lang.tagLibrary.exportLibrary,
					modal: exportLibraryModal,
				}));

				return menuItems;
			}
		};

		return {
			initialize: function(registry)
			{
				electronLibraryInterface = new ElectronLibraryInterface();
				registry.register(
				{
					interfaces: 'strut.LogoMenuItemProvider'
				}, service);

				registry.register(
				{
					interfaces: 'strut.ElectronLibraryInterface'
				}, electronLibraryInterface);
			}
		}
	});