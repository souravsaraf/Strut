define(['backbone', 'lang', 'css!styles/widgets/fileBrowser.css'],
	function(Backbone, lang, empty)
	{
		return Backbone.View.extend(
		{
			events:
			{
				destroyed: 'dispose',
				'click li[data-filename]': '_fileClicked',
				'click button.close': '_deleteClicked',
				'dblclick li[data-filename]': '_fileChosen',
				'click button[data-id="browsePresentationFileButton"]': 'browseFile'
			},

			className: "fileBrowser",

			initialize: function()
			{
				this.render = this.render.bind(this);
				this.storageInterface.on("change:currentProvider", this.render);

				this.template = JST['tantaman.web.widgets/FileBrowserElectron'];

				this.renderListing = this.renderListing.bind(this);
			},

			render: function()
			{
				this.$el.html('<div class="browserContent">');
				if (this.storageInterface.providerReady(this.$el))
				{
					this.renderListing();
				}
				else
				{
					this.storageInterface.activateProvider(this.$el, this.renderListing);
				}

				return this;
			},

			dispose: function()
			{
				this.storageInterface.off(null, null, this);
			},

			_fileClicked: function(e)
			{
				this.$fileName.val(e.currentTarget.dataset.filename);
				this.$el.find('.active').removeClass('active');
				$(e.currentTarget).addClass('active');
			},

			_fileChosen: function(e)
			{
				this.$el.trigger('fileChosen', e.currentTarget.dataset.fileName);
			},

			_deleteClicked: function(e)
			{
				var $target = $(e.currentTarget);
				var $li = $target.parent().parent();
				this.storageInterface.remove($li.attr('data-filename'));
				$li.remove();

				e.stopPropagation();
				return false;
			},

			renderListing: function()
			{
				var self = this;
				let folder = "";
				if (window.isElectron() && self.storageInterface.currentProviderId() == "filestorage")
				{
					folder = window.electronConfig.storage.presentationFolder;
				}
				this.storageInterface.listPresentations(folder, function(list, err)
				{
					if (err)
					{
						self.$el.find('.browserContent').html(err);
					}
					else
					{
						self.$el.find('.browserContent').html(self.template(
						{
							browse: lang.browse,
							files: list
						}));
						self.$fileName = self.$el.find('.fileName');
						self.$fileName.val(folder);
					}
				});
			},

			browseFile: function()
			{
				const
				{
					dialog
				} = require("electron").remote;
				const path = require('path');
				if (this.action == "open")
				{
					let pathArray = dialog.showOpenDialog(
					{
						defaultPath: window.electronConfig.storage.presentationFolder,
						filters: [
						{
							name: "Strut Presentations",
							extensions: ['strut']
						}],
						properties: ["openFile"]
					});
					if (typeof pathArray != "undefined" && pathArray != null && pathArray.length != null && pathArray.length > 0)
					{
						this.$fileName.val(path.normalize(pathArray[0]));
					}
				}
				else
				{
					let saveFileName = dialog.showSaveDialog(
					{
						defaultPath: window.electronConfig.storage.presentationFolder,
						filters: [
						{
							name: "Strut Presentations",
							extensions: ['strut']
						}],
					});
					if (saveFileName)
					{
						this.$fileName.val(path.normalize(saveFileName));
					}
				}
			},

			fileName: function()
			{
				return this.$fileName.val();
			},

			constructor: function ProviderTab(storageInterface, editorModel)
			{
				this.storageInterface = storageInterface;
				this.editorModel = editorModel;
				Backbone.View.prototype.constructor.call(this);
			}
		});
	});