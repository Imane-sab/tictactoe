const { app, BrowserWindow, autoUpdater } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: autoUpdater,
        height: autoUpdater, // Un peu plus grand pour inclure la pub
        icon: path.join(__dirname, 'build/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true, // Cache le menu en haut pour un look "App"
        resizable: true
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// Fermer l'application si toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});