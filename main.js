'use strict';
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const os = require("os")

const app = electron.app; // Module to control application life.
const BrowserWindow = electron.BrowserWindow; // Module to create native browser window.

const electronLocalshortcut = require('electron-localshortcut'); // using this module for local key bindings (when app is focussed)

function checkExistenceOfRecentFiles(strut_electron_config)
{
	let config = strut_electron_config.getAll();
	let recentFilesArray = config.storage.recentFilesList;
	let length = config.storage.recentFilesList.length;
	if (length > 0)
	{
		for (let i = 0; i < length; i++)
		{
			try
			{
				if (!fs.existsSync(recentFilesArray[i]))
				{
					recentFilesArray.splice(i, 1);
				}
			}
			catch (e)
			{
				recentFilesArray.splice(i, 1);
			}
		}
	}
	config.storage.recentFilesList = recentFilesArray;
	strut_electron_config.setAll(config);
}

function applyCorrectConfigSettings(strut_electron_config)
{
	// Using correct strut's electron configuration settings

	let strut_electron_config_filepath = path.join(app.getPath('userData'), "strut_electron_config.json");
	if (fs.existsSync(strut_electron_config_filepath))
	{
		strut_electron_config.setPath(strut_electron_config_filepath);
		let jsonString = fs.readFileSync(strut_electron_config_filepath, 'utf8');
		try
		{
			let configObject = JSON.parse(jsonString);
			strut_electron_config.setAll(configObject);
		}
		catch (e)
		{
			strut_electron_config.setAll(DEFAULT_STRUT_ELECTRON_CONFIG);
		}
	}
	else
	{
		strut_electron_config.setPath(strut_electron_config_filepath);
		strut_electron_config.setAll(DEFAULT_STRUT_ELECTRON_CONFIG);
	}
	checkExistenceOfRecentFiles(strut_electron_config);
}
let mainWindow;

// Default Strut Electron Configuration Settings if the app is run for the first time : 

let DEFAULT_STRUT_ELECTRON_CONFIG = {
	"storage":
	{
		"presentationFolder": path.normalize(path.join(os.homedir(), "Documents")),
		"recentFilesCount": 5,
		"recentFilesList": []
	},
	"monitor":
	{
		"controlMonitor": 1,
		"presentationMonitor": 1
	}
};

// Handling App Events

app.on('window-all-closed', function()
{
	if (process.platform != 'darwin')
	{
		console.log("All windows are closed");
		app.quit();
	}
});

app.on('ready', function()
{
	// Get Primary Screen Dimensions : 

	let screenElectron = electron.screen;
	let mainScreen = screenElectron.getPrimaryDisplay();
	let mainScreenDimensions = mainScreen.workAreaSize;
	DEFAULT_STRUT_ELECTRON_CONFIG.monitor["controlMonitorResolution"] = mainScreenDimensions.width + "x" + mainScreenDimensions.height;
	DEFAULT_STRUT_ELECTRON_CONFIG.monitor["presentationMonitorResolution"] = mainScreenDimensions.width + "x" + mainScreenDimensions.height;

	const strut_electron_config = require('electron-settings'); // using this module to have a persistent json storage for struts electron configuration.
	applyCorrectConfigSettings(strut_electron_config);
	mainWindow = new BrowserWindow(
	{
		width: Number(strut_electron_config.get('monitor.controlMonitorResolution').split('x')[0]),
		height: Number(strut_electron_config.get('monitor.controlMonitorResolution').split('x')[1]),
		webPreferences:
		{
			plugins: true,
			nodeIntegration: true
		}
	});
	mainWindow.loadURL('file://' + __dirname + '/app/index.html');
	electronLocalshortcut.register(mainWindow, 'F12', () =>
	{
		console.log('You pressed F12');
		mainWindow.webContents.toggleDevTools();
	});
	electronLocalshortcut.register(mainWindow, 'F5', () =>
	{
		console.log('You pressed F5');
		mainWindow.webContents.reload();
	});

	mainWindow.on('close', function(e)
	{
		mainWindow.webContents.executeJavaScript('localStorage.setItem("Strut_sessionMeta", JSON.stringify(window.sessionMeta))');
		electronLocalshortcut.unregisterAll(mainWindow);
		mainWindow = null;
	});
});