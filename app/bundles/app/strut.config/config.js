define(function()
{
	var config = {
		slide:
		{
			size:
			{
				width: 1024,
				height: 768
			},
			overviewSize:
			{
				width: 75,
				height: 50
			}
		}
	};

	var temp = localStorage.getItem("Strut_sessionMeta");
	try
	{
		var sessionMeta = JSON.parse(temp);
	}
	catch (e)
	{}

	var sessionMeta = sessionMeta ||
	{
		generator_index: 0
	};

	window.config = config;
	window.sessionMeta = sessionMeta;

	// ADDING ELECTRON BASED CONFIGURATIONS TO THE SESSION META
	if (isElectron())
	{
		const
		{
			remote
		} = require('electron');
		const path = require('path');
		const os = require('os');
		const fs = require('fs');

		window.sessionMeta.appPath = remote.app.getPath('userData');

		let filename = "strutTagLibrary.db";
		window.sessionMeta.tagLibraryDatabaseFile = path.join(window.sessionMeta.appPath, filename);

		let docs = path.join(os.homedir(), "Documents");
		let exists = fs.existsSync(docs) && fs.lstatSync(docs).isDirectory();
		if (!exists)
		{
			fs.mkdirSync(docs);
		}
		window.sessionMeta.defaultPresentationsFolder = docs;

		let thumbnailsFolder = path.join(window.sessionMeta.appPath, "thumbnails");
		exists = fs.existsSync(thumbnailsFolder) && fs.lstatSync(thumbnailsFolder).isDirectory();
		if (!exists)
		{
			fs.mkdirSync(thumbnailsFolder);
		}
		window.sessionMeta.thumbnailsFolder = thumbnailsFolder;

		window.sessionMeta.isWin = (os.platform() === 'win32');

		if (window.sessionMeta.isWin)
		{
			window.sessionMeta.pathSeparator = "\\";
		}
		else window.sessionMeta.pathSeparator = path.sep;
	}
	return config;
});