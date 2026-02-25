import { describe, expect, it, vi } from "vitest";
import { buildMenuTemplate } from "../src/main/menu.cjs";
import { IPC_CHANNELS } from "../src/main/channels.cjs";

function findMenuItem(template, topLevelLabel, itemLabel) {
  const menu = template.find((item) => item.label === topLevelLabel);
  return menu?.submenu.find((item) => item.label === itemLabel);
}

describe("native menu integration", () => {
  it("maps file/view/help actions to IPC menu-command messages and expected accelerators", () => {
    const mainWindow = {
      isDestroyed: vi.fn(() => false),
      webContents: {
        send: vi.fn(),
        print: vi.fn(),
      },
    };

    const template = buildMenuTemplate(mainWindow);
    const newCarePlan = findMenuItem(template, "File", "New Care Plan");
    const open = findMenuItem(template, "File", "Open...");
    const save = findMenuItem(template, "File", "Save");
    const settings = findMenuItem(template, "View", "Settings");
    const shortcuts = findMenuItem(template, "View", "Keyboard Shortcuts");
    const docs = findMenuItem(template, "Help", "CareConnect Docs");
    const print = findMenuItem(template, "File", "Print");

    expect(newCarePlan.accelerator).toBe("CmdOrCtrl+N");
    expect(open.accelerator).toBe("CmdOrCtrl+O");
    expect(save.accelerator).toBe("CmdOrCtrl+S");
    expect(settings.accelerator).toBe("CmdOrCtrl+,");
    expect(shortcuts.accelerator).toBe("CmdOrCtrl+/");
    expect(print.accelerator).toBe("CmdOrCtrl+P");

    newCarePlan.click();
    open.click();
    save.click();
    settings.click();
    shortcuts.click();
    docs.click();
    print.click();

    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      IPC_CHANNELS.MENU_COMMAND,
      "file:new-care-plan",
    );
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(IPC_CHANNELS.MENU_COMMAND, "file:open");
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(IPC_CHANNELS.MENU_COMMAND, "file:save");
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      IPC_CHANNELS.MENU_COMMAND,
      "view:settings",
    );
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(
      IPC_CHANNELS.MENU_COMMAND,
      "help:shortcuts",
    );
    expect(mainWindow.webContents.send).toHaveBeenCalledWith(IPC_CHANNELS.MENU_COMMAND, "help:docs");
    expect(mainWindow.webContents.print).toHaveBeenCalledTimes(1);
  });

  it("does not dispatch commands when the target BrowserWindow is destroyed", () => {
    const mainWindow = {
      isDestroyed: vi.fn(() => true),
      webContents: { send: vi.fn() },
    };

    const template = buildMenuTemplate(mainWindow);
    const open = findMenuItem(template, "File", "Open...");
    const settings = findMenuItem(template, "View", "Settings");

    open.click();
    settings.click();
    expect(mainWindow.webContents.send).not.toHaveBeenCalled();
  });
});
