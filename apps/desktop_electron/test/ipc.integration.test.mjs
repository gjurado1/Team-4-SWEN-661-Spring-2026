import { beforeEach, describe, expect, it, vi } from "vitest";
import { registerIpcHandlers } from "../src/main/ipc.cjs";
import { IPC_CHANNELS } from "../src/main/channels.cjs";

describe("IPC integration", () => {
  const handlers = new Map();

  const deps = {
    fs: {
      readFile: vi.fn(async () => "file-content"),
      writeFile: vi.fn(async () => undefined),
    },
    app: {
      getName: vi.fn(() => "CareConnect Desktop"),
      getVersion: vi.fn(() => "1.0.0"),
    },
    dialog: {
      showOpenDialog: vi.fn(async () => ({ canceled: false, filePaths: ["C:/tmp/demo.txt"] })),
      showSaveDialog: vi.fn(async () => ({ canceled: false, filePath: "C:/tmp/out.txt" })),
    },
    ipcMain: {
      handle: vi.fn((channel, fn) => handlers.set(channel, fn)),
    },
    Notification: vi.fn(function NotificationCtor() {
      return { show: vi.fn() };
    }),
  };

  deps.Notification.isSupported = vi.fn(() => true);

  beforeEach(() => {
    handlers.clear();
    vi.clearAllMocks();
  });

  it("registers and executes IPC request handlers across app/dialog/fs dependencies", async () => {
    const mainWindow = { id: "main-window" };
    registerIpcHandlers(mainWindow, deps);

    expect(deps.ipcMain.handle).toHaveBeenCalledTimes(4);
    expect(handlers.has(IPC_CHANNELS.APP_INFO)).toBe(true);
    expect(handlers.has(IPC_CHANNELS.FILE_OPEN)).toBe(true);
    expect(handlers.has(IPC_CHANNELS.FILE_SAVE)).toBe(true);
    expect(handlers.has(IPC_CHANNELS.APP_NOTIFICATION)).toBe(true);

    const info = await handlers.get(IPC_CHANNELS.APP_INFO)();
    expect(info).toEqual({
      name: "CareConnect Desktop",
      version: "1.0.0",
      platform: process.platform,
    });

    const openResult = await handlers.get(IPC_CHANNELS.FILE_OPEN)();
    expect(deps.dialog.showOpenDialog).toHaveBeenCalledWith(mainWindow, expect.any(Object));
    expect(deps.fs.readFile).toHaveBeenCalledWith("C:/tmp/demo.txt", "utf8");
    expect(openResult).toEqual({
      canceled: false,
      filePath: "C:/tmp/demo.txt",
      content: "file-content",
    });

    const saveResult = await handlers.get(IPC_CHANNELS.FILE_SAVE)(null, { content: "abc" });
    expect(deps.dialog.showSaveDialog).toHaveBeenCalledWith(mainWindow, expect.any(Object));
    expect(deps.fs.writeFile).toHaveBeenCalledWith("C:/tmp/out.txt", "abc", "utf8");
    expect(saveResult).toEqual({
      canceled: false,
      filePath: "C:/tmp/out.txt",
    });
  });

  it("returns canceled responses for open/save dialogs when user cancels", async () => {
    deps.dialog.showOpenDialog.mockResolvedValueOnce({ canceled: true, filePaths: [] });
    deps.dialog.showSaveDialog.mockResolvedValueOnce({ canceled: true, filePath: undefined });

    registerIpcHandlers({ id: "main-window" }, deps);

    const openResult = await handlers.get(IPC_CHANNELS.FILE_OPEN)();
    const saveResult = await handlers.get(IPC_CHANNELS.FILE_SAVE)(null, { content: "abc" });

    expect(openResult).toEqual({ canceled: true });
    expect(saveResult).toEqual({ canceled: true });
    expect(deps.fs.readFile).not.toHaveBeenCalled();
    expect(deps.fs.writeFile).not.toHaveBeenCalled();
  });

  it("normalizes missing save payload and writes empty content", async () => {
    registerIpcHandlers({ id: "main-window" }, deps);
    await handlers.get(IPC_CHANNELS.FILE_SAVE)(null, undefined);
    expect(deps.fs.writeFile).toHaveBeenCalledWith("C:/tmp/out.txt", "", "utf8");
  });

  it("shows notifications with safe defaults and handles unsupported environments", async () => {
    const showSpy = vi.fn();
    deps.Notification.mockImplementationOnce(function NotificationCtor() {
      return { show: showSpy };
    });

    registerIpcHandlers({ id: "main-window" }, deps);
    const notify = handlers.get(IPC_CHANNELS.APP_NOTIFICATION);

    const shownResult = await notify(null, undefined);
    expect(deps.Notification).toHaveBeenCalledWith({ title: "CareConnect", body: "" });
    expect(showSpy).toHaveBeenCalledTimes(1);
    expect(shownResult).toEqual({ shown: true });

    deps.Notification.isSupported.mockReturnValueOnce(false);
    const notShownResult = await notify(null, { title: "Alert", body: "Body" });
    expect(notShownResult).toEqual({ shown: false });
  });
});
