describe("CareConnect E2E", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show a screen after launch", async () => {
    // Pick something stable in your app.
    // If your initial screen is Login, add testID="login-screen" there and assert it.
    await expect(element(by.id("login-screen"))).toBeVisible();
  });

  it("should navigate to Messages (example)", async () => {
    // If you have a button somewhere with text "Messages" or testID, use that.
    // Example:
    // await element(by.text("Messages")).tap();
    // await expect(element(by.id("messages-screen"))).toBeVisible();

    // If you don’t have a stable entry point, add a dev-only route/menu.
    // For now this is a template.
  });
});
