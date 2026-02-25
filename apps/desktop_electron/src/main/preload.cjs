const { contextBridge, ipcRenderer } = require("electron");
const { IPC_CHANNELS } = require("./channels.cjs");

function exposeElectronApi(deps = {}) {
  const contextBridgeApi = deps.contextBridge || contextBridge;
  const ipcRendererApi = deps.ipcRenderer || ipcRenderer;

  contextBridgeApi.exposeInMainWorld("electronAPI", {
    getAppInfo: () => ipcRendererApi.invoke(IPC_CHANNELS.APP_INFO),
    openFile: () => ipcRendererApi.invoke(IPC_CHANNELS.FILE_OPEN),
    saveFile: (content) => ipcRendererApi.invoke(IPC_CHANNELS.FILE_SAVE, { content }),
    notify: (title, body) =>
      ipcRendererApi.invoke(IPC_CHANNELS.APP_NOTIFICATION, { title, body }),
    onMenuCommand: (callback) => {
      const listener = (_event, command) => callback(command);
      ipcRendererApi.on(IPC_CHANNELS.MENU_COMMAND, listener);
      return () => ipcRendererApi.removeListener(IPC_CHANNELS.MENU_COMMAND, listener);
    }
  });
}

if (
  contextBridge &&
  ipcRenderer &&
  typeof contextBridge.exposeInMainWorld === "function"
) {
  exposeElectronApi();
}

module.exports = {
  exposeElectronApi
};
