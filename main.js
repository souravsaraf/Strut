'use strict';
const electron = require('electron');
const fs = require('fs');
const path = require('path');
const os = require("os")

const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// Logging stuff
console.log("Logging userData path : " + app.getPath('userData'));

const electronLocalshortcut = require('electron-localshortcut'); // using this module for local key bindings (when app is focussed)
function applyCorrectConfigSettings(strut_electron_config)
{
	// Using correct strut's electron configuration settings

	let strut_electron_config_filepath = path.join(app.getPath('userData'), "strut_electron_config.json");
	if(fs.existsSync(strut_electron_config_filepath))
	{
		strut_electron_config.setPath(strut_electron_config_filepath);
		let jsonString = fs.readFileSync(strut_electron_config_filepath , 'utf8');
		try
		{
			let configObject = JSON.parse(jsonString);
			strut_electron_config.setAll(configObject);
		}catch(e)
		{
			strut_electron_config.setAll(DEFAULT_STRUT_ELECTRON_CONFIG);
		}
	}
	else
	{
		strut_electron_config.setPath(strut_electron_config_filepath);
		strut_electron_config.setAll(DEFAULT_STRUT_ELECTRON_CONFIG);
	}
}
let mainWindow;

// Default Strut Electron Configuration Settings if the app is run for the first time : 

let DEFAULT_STRUT_ELECTRON_CONFIG = 
{
	"storage": {
					"presentationFolder": path.join(os.homedir(),"Documents"),
					"recentFilesCount": 5
			   },
	"monitor": {
					"controlMonitor": "controlMonitorName",
					"presentationMonitor": "presentationMonitorName"
			   }
}

// Handling App Events

app.on('window-all-closed', function() 
{
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function()
{
	// Get Primary Screen Dimensions : 
	
	let screenElectron = electron.screen;
	let mainScreen = screenElectron.getPrimaryDisplay();
	// let allScreens = screenElectron.getAllDisplays();
	// console.log("mainScreen : \n"); console.dir(mainScreen);
	// console.log("allScreens : \n"); console.dir(allScreens);
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
	
	mainWindow.on('closed', function() 
	{
		electronLocalshortcut.unregisterAll(mainWindow);
		mainWindow = null;
	});
});