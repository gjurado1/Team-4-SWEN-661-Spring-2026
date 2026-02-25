import { beforeEach, describe, expect, it, vi } from "vitest";
import { IPC_CHANNELS } from "../src/main/channels.cjs";
import { exposeElectronApi } from "../src/main/preload.cjs";

describe("preload integration", () => {
  const exposeInMainWorld = vi.fn();
  const invoke = vi.fn();
  const on = vi.fn();
  const removeListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function exposeAndReadApi() {
    exposeElectronApi({
      contextBridge: { exposeInMainWorld },
      ipcRenderer: { invoke, on, removeListener },
    });
    expect(exposeInMainWorld).toHaveBeenCalledWith("electronAPI", expect.any(Object));
    return exposeInMainWorld.mock.calls[0][1];
  }

  it("exposes invoke-based IPC methods on window.electronAPI", () => {
    const api = exposeAndReadApi();

    api.getAppInfo();
    api.openFile();
    api.saveFile("notes");
    api.notify("Title", "Message");

    expect(invoke).toHaveBeenNthCalledWith(1, IPC_CHANNELS.APP_INFO);
    expect(invoke).toHaveBeenNthCalledWith(2, IPC_CHANNELS.FILE_OPEN);
    expect(invoke).toHaveBeenNthCalledWith(3, IPC_CHANNELS.FILE_SAVE, { content: "notes" });
    expect(invoke).toHaveBeenNthCalledWith(4, IPC_CHANNELS.APP_NOTIFICATION, {
      title: "Title",
      body: "Message",
    });
  });

  it("registers and removes menu command listener through returned unsubscribe", () => {
    const api = exposeAndReadApi();
    const callback = vi.fn();

    const unsubscribe = api.onMenuCommand(callback);
    expect(on).toHaveBeenCalledWith(IPC_CHANNELS.MENU_COMMAND, expect.any(Function));

    const listener = on.mock.calls[0][1];
    listener({}, "view:settings");
    expect(callback).toHaveBeenCalledWith("view:settings");

    unsubscribe();
    expect(removeListener).toHaveBeenCalledWith(IPC_CHANNELS.MENU_COMMAND, listener);
  });
});
