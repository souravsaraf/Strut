define(['backbone', '../model/ActionHandlers', 'tantaman/web/widgets/ErrorModal', 'lang'],
function(Backbone, ActionHandlers, ErrorModal, lang) {
	return Backbone.View.extend({
		tagName: 'li',
		events: {
			click: 'save'
		},

		constructor: function SaveMenuItem(modal, model, storageInterface) {
			Backbone.View.prototype.constructor.call(this);
			this.model = model;
			this.saveAsModal = modal;
			this.storageInterface = storageInterface;
		},

		save: function() {
			// console.log("Inside SaveMenuItem.js , Save or SaveAs was called");
			// As soon as "File-->Save" is clicked , this is the first function that gets called. See 'strut.storage/main.js line 35'
			fileName = this.model.fileName();
			if ((fileName == null)||(window.sessionMeta.isNewPresentation == 1)) {
				this.saveAsModal.show(ActionHandlers.save, lang.save_as);
			} else {
				ActionHandlers.save(this.storageInterface, this.model, fileName, ErrorModal.show);
			}
		},

		render: function() {
			this.$el.html('<a>' + lang.save + '</a>');
			return this;
		}
	});
});