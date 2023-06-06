import { app, BrowserWindow, ipcMain } from "electron";
import isDev from "electron-is-dev";

let mainWindow = null;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true, // Enable Node integration
      zoomFactor: 0.6, // Set the default zoom factor here
      contextIsolation: false,
    },
    focusable:false
  });

  if (isDev) {
    // Load from localhost:3000 during development
    mainWindow.loadURL('http://localhost:3000');

  } else {
    // Load the compiled JavaScript file
    mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);  }
    mainWindow.webContents.openDevTools();
  return mainWindow

}

app.whenReady().then(() => {
  mainWindow = createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on('minimize-window', () => {
    mainWindow.hide();
});

ipcMain.on("quit", function () {
  if (process.platform !== "darwin") app.quit();
});





