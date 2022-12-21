require('update-electron-app')();
if (require('electron-squirrel-startup')) app.quit();

const electron = require('electron');
const { PARAMS, VALUE, MicaBrowserWindow } = require('mica-electron');
const { redraw } = require('../node_modules/mica-electron/bin/win32-x64-110/mica-electron');
const path = require('path');

electron.app.commandLine.appendSwitch("enable-transparent-visuals");

electron.app.on('ready', () => {
	const win = new MicaBrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		effect: PARAMS.BACKGROUND.MICA,
		theme: VALUE.THEME.DARK,
		autoHideMenuBar: true,
		show: false
	});

	win.setVisualEffect(PARAMS.CORNER, VALUE.CORNER.ROUND);

	const HWND = win.getNativeWindowHandle()["readInt32LE"]();
	const bounds = win.getBounds();
	redraw(HWND, bounds.x, bounds.y, bounds.width, bounds.height);

	win.loadFile(path.join(__dirname, 'index.html'));

	win.webContents.once('dom-ready', () => {
		win.show();
	});
});