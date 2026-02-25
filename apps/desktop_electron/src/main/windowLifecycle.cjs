function wireWindowStatePersistence(mainWindow, options) {
  const {
    getUserDataPath,
    saveWindowState
  } = options;

  const persistBounds = () => {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    if (mainWindow.isMinimized() || mainWindow.isMaximized()) return;
    saveWindowState(getUserDataPath(), mainWindow.getBounds());
  };

  mainWindow.on("resize", persistBounds);
  mainWindow.on("move", persistBounds);
  mainWindow.on("close", persistBounds);
}

module.exports = {
  wireWindowStatePersistence
};
