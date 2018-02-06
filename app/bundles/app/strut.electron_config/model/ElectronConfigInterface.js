define([],
function()
{
	'use strict';
	function ElectronConfigInterface()
	{
		var temp = localStorage.getItem("Strut_electronConfig");
		try
		{
			this.localCopyOfElectronConfig = JSON.parse(temp);
		} catch (e) {}
		
		this.localCopyOfElectronConfig = this.localCopyOfElectronConfig || {};
		window.electronConfig = this.localCopyOfElectronConfig;
	}
	
	ElectronConfigInterface.prototype =
	{
		getConfig : function()
		{
			return this.localCopyOfElectronConfig;
		},
		
		setConfig : function(electronConfigJsonObject)
		{
			this.localCopyOfElectronConfig = electronConfigJsonObject;
			window.electronConfig = this.localCopyOfElectronConfig;
			localStorage.setItem('Strut_electronConfig' , JSON.stringify(window.electronConfig));
		}
		
		// Does not make sense to have to add, update or delete functions because the user can just manipulate the window.electronConfig object using Javascript.
	};
	
	return ElectronConfigInterface;
});