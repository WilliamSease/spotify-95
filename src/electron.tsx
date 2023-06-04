import { app, BrowserWindow } from "electron";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 710,
    frame: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true, // Enable Node integration
      zoomFactor: 0.6, // Set the default zoom factor here
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
