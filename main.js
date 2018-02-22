// Refer this website : https://www.sitepoint.com/desktop-node-apps-with-electron/
'use strict';
// process.env.ELECTRON_IS_DEV = 1;
console.log("Logging Process : ");
console.dir(process.versions);
const electron = require('electron');
const app = electron.app;  // Module to control application life.
console.log("Logging userData path : " + app.getPath('userData'));
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.
// require('electron-debug')({showDevTools: true}); // Using the module 'electron-debug' for toggling dev tools , key bindings for refresh etc.

const electronLocalshortcut = require('electron-localshortcut'); // using the module 'electron-localshortcut' for local key bindings (when app is focussed)
var mainWindow = null;

app.on('window-all-closed', function() 
{
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function()
{
	var screenElectron = electron.screen;
	var mainScreen = screenElectron.getPrimaryDisplay();
	// var allScreens = screenElectron.getAllDisplays();
	// console.log(mainScreen, allScreens);
	var mainScreen = screenElectron.getPrimaryDisplay();
	var dimensions = mainScreen.size;
	mainWindow = new BrowserWindow(
	{
		width: dimensions.width , 
		height: dimensions.height , 
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