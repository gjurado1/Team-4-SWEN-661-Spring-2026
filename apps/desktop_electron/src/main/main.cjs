const path = require("node:path");
const { app, BrowserWindow, Tray, Menu } = require("electron");
const { loadWindowState, saveWindowState } = require("./windowState.cjs");
const { createAppMenu } = require("./menu.cjs");
const { registerIpcHandlers } = require("./ipc.cjs");
const { wireWindowStatePersistence } = require("./windowLifecycle.cjs");

const APP_ROOT = path.resolve(__dirname, "..", "..");
const PRELOAD_PATH = path.join(__dirname, "preload.cjs");
const RENDERER_DIST_PATH = path.join(APP_ROOT, "renderer-dist", "index.html");
const RENDERER_DEV_URL = process.env.ELECTRON_RENDERER_URL;

let mainWindow = null;
let tray = null;

function createMainWindow() {
  const windowState = loadWindowState(app.getPath("userData"));
  mainWindow = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    x: windowState.x,
    y: windowState.y,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    title: "CareConnect Desktop",
    backgroundColor: "#f7f4f6",
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  if (RENDERER_DEV_URL) {
    mainWindow.loadURL(RENDERER_DEV_URL);
  } else {
    mainWindow.loadFile(RENDERER_DIST_PATH);
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  wireWindowStatePersistence(mainWindow, {
    getUserDataPath: () => app.getPath("userData"),
    saveWindowState
  });

  createAppMenu(mainWindow);
  registerIpcHandlers(mainWindow);
  return mainWindow;
}

function createTrayIfAvailable() {
  const trayIconPath = path.join(APP_ROOT, "assets", "tray-icon.png");
  try {
    tray = new Tray(trayIconPath);
  } catch {
    tray = null;
    return;
  }
  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Show CareConnect",
      click: () => {
        if (!mainWindow) return;
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: "Quit",
      click: () => app.quit()
    }
  ]);

  tray.setToolTip("CareConnect Desktop");
  tray.setContextMenu(trayMenu);
  tray.on("double-click", () => {
    if (!mainWindow) return;
    if (mainWindow.isVisible()) {
      mainWindow.focus();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(() => {
    createMainWindow();
    createTrayIfAvailable();
    app.setAppUserModelId("com.careconnect.desktop");
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
