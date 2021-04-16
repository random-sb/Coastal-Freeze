/* 

    Credits to Allinol for teaching me a lot of things.
	
*/



const {
    app,
    dialog,
    BrowserWindow,
    Menu,
    MenuItem,
    nativeTheme, 
	globalShortcut,
    shell
} = require('electron')

const DiscordRPC = require('discord-rpc');

const {
    autoUpdater
} = require("electron-updater");

const path = require('path')


let pluginName
switch (process.platform) {
	case 'win32':
		switch (process.arch) {
			case 'ia32':
				pluginName = 'flash/windows/32/pepflashplayer.dll'
				break
			case 'x32':
				pluginName = 'flash/windows/32/pepflashplayer.dll'
				break
			case 'x64':
				pluginName = 'flash/windows/64/pepflashplayer.dll'
				break
			}
		break
	case 'linux':
		switch (process.arch) {
			case 'ia32':
				pluginName = 'flash/linux/32/libpepflashplayer.so'
				break
			case 'x32':
				pluginName = 'flash/linux/32/libpepflashplayer.so'
				break
			case 'x64':
				pluginName = 'flash/linux/64/libpepflashplayer.so'
				break
			}
		break
	case 'darwin':
		pluginName = 'flash/mac/PepperFlashPlayer.plugin'
		break
}
app.commandLine.appendSwitch('no-sandbox'); // linux fix
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));
app.commandLine.appendSwitch("disable-http-cache");

var win
app.on('ready', () => {
    createWindow();
})

//window creation function
function createWindow() {
    win = new BrowserWindow
    ({
        title: "Snowy Fields",
        webPreferences: {
            plugins: true,
            nodeIntegration: true
        }
    });
    makeMenu();
    //activateRPC();
	
    win.loadURL('https://snowyfields.ca/');
	
    autoUpdater.checkForUpdatesAndNotify();
    Menu.setApplicationMenu(fsmenu);
	
	globalShortcut.register('CmdOrCtrl+Shift+I', () => {
		win.webContents.openDevTools();
	})
	
    win.on('closed', () => {
    	win = null;
    });
}

// start of menubar part

const aboutMessage = `Snowy Fields Client v${app.getVersion()}
Created by Random (with much help and code from Allinol) for use with Snowy Fields.`;

function activateRPC() { 
  const clientId = '792072685790167070'; 
  DiscordRPC.register(clientId);
  const rpc = new DiscordRPC.Client({ transport: 'ipc' }); 
  const startTimestamp = new Date();
  rpc.on('ready', () => {
    rpc.setActivity({
      details: `snowyfields.ca`, 
      state: `Desktop Client`, 
      startTimestamp, 
      largeImageKey: imageName
    });
  });
  rpc.login({ clientId }).catch();
}

function makeMenu() { 
    fsmenu = new Menu();
    if (process.platform == 'darwin') {
        fsmenu.append(new MenuItem({
            label: "Snowy Fields Client",
            submenu: [{
                    label: 'About',
                    click: () => {
                        dialog.showMessageBox({
                            type: "info",
                            buttons: ["Ok"],
                            title: "About Snowy Fields",
                            message: aboutMessage
                        });
                    }
                },
                {
                    label: 'Fullscreen (Toggle)',
                    accelerator: 'CmdOrCtrl+F',
                    click: () => {
                        win.setFullScreen(!win.isFullScreen());
                    }
                },
                {
                    label: 'Mute Audio (Toggle)',
					accelerator: 'CmdOrCtrl+M',
                    click: () => {
                        win.webContents.audioMuted = !win.webContents.audioMuted;
                    }
                },
                {
                    label: 'Join Discord',
            		click: () => {
                		shell.openExternal("https://discord.gg/VRCFRRC");
                    }
                },
                {
                    label: 'Log Out',
                    click: () => {
                        clearCache();
                        win.loadURL('https://snowyfields.ca/');
                    }
                }
            ]
        }));
    } else {
        fsmenu.append(new MenuItem({
            label: 'About',
            click: () => {
                dialog.showMessageBox({
                    type: "info",
                    buttons: ["Ok"],
                    title: "About Snowy Fields",
                    message: aboutMessage
                });
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Fullscreen (Toggle)',
            accelerator: 'CmdOrCtrl+F',
            click: () => {
                win.setFullScreen(!win.isFullScreen());
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Mute Audio (Toggle)',
			accelerator: 'CmdOrCtrl+M',
            click: () => {
                win.webContents.audioMuted = !win.webContents.audioMuted;
                win.webContents.send('muted', win.webContents.audioMuted);
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Dark Mode (Toggle)',
            click: () => {
                darkMode()
            }
        }));
        fsmenu.append(new MenuItem({
            label: 'Log Out',
            click: () => {
                clearCache();
                win.loadURL('https://play.snowyfields.ca/');
            }
        }));
    }
}

function clearCache() {
    windows = BrowserWindow.getAllWindows()[0];
    const ses = win.webContents.session;
    ses.clearCache(() => {});
}


// end of menubar


//Auto update part

autoUpdater.on('update-available', (updateInfo) => {
	switch (process.platform) {
	case 'win32':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). It will be installed when the app closes."
	    });
	    break
	case 'darwin':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). Please go install it manually from the website."
	    });
	    break
	case 'linux':
	    dialog.showMessageBox({
		  type: "info",
		  buttons: ["Ok"],
		  title: "Update Available",
		  message: "There is a new version available (v" + updateInfo.version + "). Auto-update has not been tested on this OS, so if after relaunching app this appears again, please go install it manually."
	    });
	    break
	}
});

var updateAv = false;

autoUpdater.on('update-downloaded', () => {
    updateAv = true;
});

// end of Auto update part*/

app.on('window-all-closed', () => {
	if (updateAv) {
		autoUpdater.quitAndInstall();
	}
	else
	{
		if (process.platform !== 'darwin') {
			app.quit();
		}
	}
});

app.on('activate', () => {
  if (win === null) {createWindow();}
});
