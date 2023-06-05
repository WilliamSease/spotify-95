import { app, BrowserWindow, ipcMain } from "electron";

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
  });

  // Load the React app
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("quit", function () {
  if (process.platform !== "darwin") app.quit();
});
