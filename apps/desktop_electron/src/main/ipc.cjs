const fs = require("node:fs/promises");
const { app, dialog, ipcMain, Notification } = require("electron");
const { IPC_CHANNELS } = require("./channels.cjs");

function registerIpcHandlers(mainWindow, deps = {}) {
  const fsApi = deps.fs || fs;
  const appApi = deps.app || app;
  const dialogApi = deps.dialog || dialog;
  const ipcMainApi = deps.ipcMain || ipcMain;
  const notificationApi = deps.Notification || Notification;

  ipcMainApi.handle(IPC_CHANNELS.APP_INFO, () => ({
    name: appApi.getName(),
    version: appApi.getVersion(),
    platform: process.platform
  }));

  ipcMainApi.handle(IPC_CHANNELS.FILE_OPEN, async () => {
    const result = await dialogApi.showOpenDialog(mainWindow, {
      title: "Open File",
      properties: ["openFile"],
      filters: [
        { name: "Text", extensions: ["txt", "md", "json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }
    const filePath = result.filePaths[0];
    const content = await fsApi.readFile(filePath, "utf8");
    return { canceled: false, filePath, content };
  });

  ipcMainApi.handle(IPC_CHANNELS.FILE_SAVE, async (_event, payload) => {
    const content = typeof payload?.content === "string" ? payload.content : "";
    const result = await dialogApi.showSaveDialog(mainWindow, {
      title: "Save File",
      defaultPath: "careconnect-note.txt",
      filters: [
        { name: "Text", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] }
      ]
    });

    if (result.canceled || !result.filePath) {
      return { canceled: true };
    }

    await fsApi.writeFile(result.filePath, content, "utf8");
    return { canceled: false, filePath: result.filePath };
  });

  ipcMainApi.handle(IPC_CHANNELS.APP_NOTIFICATION, async (_event, payload) => {
    const title = typeof payload?.title === "string" ? payload.title : "CareConnect";
    const body = typeof payload?.body === "string" ? payload.body : "";

    if (!notificationApi.isSupported()) {
      return { shown: false };
    }
    const notification = new notificationApi({ title, body });
    notification.show();
    return { shown: true };
  });
}

module.exports = {
  registerIpcHandlers
};
