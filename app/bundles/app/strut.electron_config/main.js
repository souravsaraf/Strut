define(['framework/ServiceCollection',
		'./view/ElectronConfigModal',
		'./view/ElectronConfigMenuItem',
		'./model/ElectronConfigInterface',
		'lang'],
function(ServiceCollection, ElectronConfigModal, ElectronConfigMenuItem , ElectronConfigInterface, lang)
{
	'use strict';
	
	var electronConfigInterface = null;
	var electronConfigModal = null;
	var $modals = $('#modals');
	
	var service = 
	{
		createMenuItems: function() 
		{
			var menuItems = [];

			if (electronConfigModal == null) 
			{
				electronConfigModal = new ElectronConfigModal
				({
					electronConfigInterface: electronConfigInterface
				});
				electronConfigModal.render();
				$modals.append(electronConfigModal.$el);
			}

			menuItems.push(new ElectronConfigMenuItem(electronConfigModal));
			return menuItems;
		}
	};
	
	return {
		initialize: function(registry)
		{
			electronConfigInterface = new ElectronConfigInterface();
			registry.register
			({
				interfaces: 'strut.LogoMenuItemProvider'
			}, service);
			
			registry.register
			({
				interfaces: 'strut.ElectronConfigInterface'
			}, electronConfigInterface);
		}
	}
});