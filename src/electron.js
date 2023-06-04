const { app, BrowserWindow } =require("electron");
const path = require("path");
const isDev =  require("electron-is-dev");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    frame:false
  });

  // Load the index.html file
  const indexPath = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "build", "index.html")}`;
  mainWindow.loadURL(indexPath);

  // Open the DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
