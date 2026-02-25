import { describe, expect, it, vi } from "vitest";
import { wireWindowStatePersistence } from "../src/main/windowLifecycle.cjs";

describe("window management integration", () => {
  it("persists window bounds on move/resize/close events when window is normal", () => {
    const listeners = new Map();
    const mockWindow = {
      on: vi.fn((event, handler) => listeners.set(event, handler)),
      isDestroyed: vi.fn(() => false),
      isMinimized: vi.fn(() => false),
      isMaximized: vi.fn(() => false),
      getBounds: vi.fn(() => ({ x: 50, y: 60, width: 1280, height: 720 })),
    };

    const saveWindowState = vi.fn();
    const getUserDataPath = vi.fn(() => "C:/tmp/user-data");

    wireWindowStatePersistence(mockWindow, { getUserDataPath, saveWindowState });

    listeners.get("move")();
    listeners.get("resize")();
    listeners.get("close")();

    expect(mockWindow.on).toHaveBeenCalledWith("move", expect.any(Function));
    expect(mockWindow.on).toHaveBeenCalledWith("resize", expect.any(Function));
    expect(mockWindow.on).toHaveBeenCalledWith("close", expect.any(Function));
    expect(saveWindowState).toHaveBeenCalledTimes(3);
    expect(saveWindowState).toHaveBeenCalledWith("C:/tmp/user-data", {
      x: 50,
      y: 60,
      width: 1280,
      height: 720,
    });
  });

  it("does not persist bounds when minimized, maximized, or destroyed", () => {
    const listeners = new Map();
    const saveWindowState = vi.fn();
    const getUserDataPath = vi.fn(() => "C:/tmp/user-data");

    const mockWindow = {
      on: vi.fn((event, handler) => listeners.set(event, handler)),
      isDestroyed: vi.fn(() => false),
      isMinimized: vi.fn(() => false),
      isMaximized: vi.fn(() => false),
      getBounds: vi.fn(() => ({ x: 0, y: 0, width: 100, height: 100 })),
    };

    wireWindowStatePersistence(mockWindow, { getUserDataPath, saveWindowState });

    mockWindow.isMinimized.mockReturnValue(true);
    listeners.get("move")();
    mockWindow.isMinimized.mockReturnValue(false);

    mockWindow.isMaximized.mockReturnValue(true);
    listeners.get("resize")();
    mockWindow.isMaximized.mockReturnValue(false);

    mockWindow.isDestroyed.mockReturnValue(true);
    listeners.get("close")();

    expect(saveWindowState).not.toHaveBeenCalled();
  });
});
