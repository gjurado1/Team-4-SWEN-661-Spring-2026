const launchFreshApp = async () => {
  await device.launchApp({ delete: true, newInstance: true });
  await expect(element(by.id("login-screen"))).toBeVisible();
};

const loginAsCaregiver = async () => {
  await element(by.id("login-username")).replaceText("admin");
  await element(by.id("login-password")).replaceText("password123");
  await element(by.text("Sign In")).tap();
  await expect(element(by.id("caregiver-dashboard"))).toBeVisible();
};

describe("CareConnect E2E", () => {
  beforeEach(async () => {
    await launchFreshApp();
  });

  it("shows login and validates missing credentials", async () => {
    await element(by.text("Sign In")).tap();
    await expect(
      element(by.text("Please enter both username and password."))
    ).toBeVisible();
  });

  it("shows an error for invalid credentials", async () => {
    await element(by.id("login-username")).replaceText("wrong-user");
    await element(by.id("login-password")).replaceText("wrong-pass");
    await element(by.text("Sign In")).tap();
    await expect(
      element(by.text("Invalid username or password. Please try again."))
    ).toBeVisible();
  });

  it("navigates to Forgot Password, sends reset link, and returns to login", async () => {
    await element(by.text("Forgot Password?")).tap();
    await expect(element(by.id("forgot-password-screen"))).toBeVisible();

    await element(by.id("forgot-password-email")).replaceText(
      "caregiver@example.com"
    );
    await element(by.text("Send reset link")).tap();
    await expect(
      element(by.text("Password reset link sent! Please check your inbox."))
    ).toBeVisible();

    await element(by.text("Back to Login")).tap();
    await expect(element(by.id("login-screen"))).toBeVisible();
  });

  it("navigates to registration and validates mismatched passwords", async () => {
    await element(by.text("Create Account")).tap();
    await expect(element(by.id("register-screen"))).toBeVisible();

    await element(by.id("register-username")).replaceText("e2e_new_user");
    await element(by.id("register-password")).replaceText("password123");
    await element(by.id("register-confirm-password")).replaceText(
      "passwordXYZ"
    );
    await element(by.text("Create Account")).tap();

    await expect(element(by.text("Passwords do not match."))).toBeVisible();
    await element(by.text("Back to Login")).tap();
    await expect(element(by.id("login-screen"))).toBeVisible();
  });

  it("logs in as caregiver and opens the Schedule screen", async () => {
    await loginAsCaregiver();
    await element(by.text("Schedule")).tap();
    await expect(element(by.id("schedule-screen"))).toBeVisible();
    await expect(element(by.text("Schedule"))).toBeVisible();
  });

  it("opens All Patients and starts a patient message flow", async () => {
    await loginAsCaregiver();
    await element(by.text("All Patients")).tap();
    await expect(element(by.id("patient-list"))).toBeVisible();
    await expect(element(by.text("All Patients"))).toBeVisible();

    await element(by.label("Message Sarah Johnson")).tap();
    await expect(element(by.id("messages-screen"))).toBeVisible();
    await expect(element(by.text("Messages"))).toBeVisible();
    await expect(element(by.label("Open thread with Sarah Johnson"))).toBeVisible();
  });

  it("sends a message in Messages screen and updates thread preview", async () => {
    const e2eMessage = "E2E message 2026";

    await loginAsCaregiver();
    await element(by.text("All Patients")).tap();
    await expect(element(by.id("patient-list"))).toBeVisible();

    await element(by.label("Message Sarah Johnson")).tap();
    await expect(element(by.id("messages-screen"))).toBeVisible();

    await element(by.id("messages-compose-input")).replaceText(e2eMessage);
    await element(by.id("messages-send-button")).tap();

    await expect(element(by.text(e2eMessage))).toBeVisible();
  });
});
