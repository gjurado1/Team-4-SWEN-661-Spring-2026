import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getRole,
  setRole,
  getThemeMode,
  setThemeMode,
  getVisionTheme,
  setVisionTheme,
  getTextScale,
  setTextScale,
} from "./storage";

describe("utils/storage", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // AsyncStorage mock supports clear()
    await AsyncStorage.clear();
  });

  describe("role", () => {
    it("getRole returns null when nothing set", async () => {
      await AsyncStorage.removeItem("careconnect-role");
      await expect(getRole()).resolves.toBeNull();
    });

    it("getRole returns caregiver/patient when valid", async () => {
      await AsyncStorage.setItem("careconnect-role", "caregiver");
      await expect(getRole()).resolves.toBe("caregiver");

      await AsyncStorage.setItem("careconnect-role", "patient");
      await expect(getRole()).resolves.toBe("patient");
    });

    it("getRole returns null when invalid", async () => {
      await AsyncStorage.setItem("careconnect-role", "admin");
      await expect(getRole()).resolves.toBeNull();
    });

    it("setRole stores and removes", async () => {
      await setRole("patient");
      await expect(AsyncStorage.getItem("careconnect-role")).resolves.toBe("patient");

      await setRole(null);
      await expect(AsyncStorage.getItem("careconnect-role")).resolves.toBeNull();
    });
  });

  describe("themeMode", () => {
    it("getThemeMode defaults to system for missing/invalid", async () => {
      await AsyncStorage.removeItem("careconnect-theme-mode");
      await expect(getThemeMode()).resolves.toBe("system");

      await AsyncStorage.setItem("careconnect-theme-mode", "nope");
      await expect(getThemeMode()).resolves.toBe("system");
    });

    it("getThemeMode returns stored values", async () => {
      await AsyncStorage.setItem("careconnect-theme-mode", "light");
      await expect(getThemeMode()).resolves.toBe("light");

      await AsyncStorage.setItem("careconnect-theme-mode", "dark");
      await expect(getThemeMode()).resolves.toBe("dark");

      await AsyncStorage.setItem("careconnect-theme-mode", "system");
      await expect(getThemeMode()).resolves.toBe("system");
    });

    it("setThemeMode stores value", async () => {
      await setThemeMode("dark");
      await expect(AsyncStorage.getItem("careconnect-theme-mode")).resolves.toBe("dark");
    });
  });

  describe("visionTheme", () => {
    it("getVisionTheme defaults to normal for missing/invalid", async () => {
      await AsyncStorage.removeItem("careconnect-vision-theme");
      await expect(getVisionTheme()).resolves.toBe("normal");

      await AsyncStorage.setItem("careconnect-vision-theme", "weird");
      await expect(getVisionTheme()).resolves.toBe("normal");
    });

    it("getVisionTheme returns stored values", async () => {
      await AsyncStorage.setItem("careconnect-vision-theme", "normal");
      await expect(getVisionTheme()).resolves.toBe("normal");

      await AsyncStorage.setItem("careconnect-vision-theme", "sepia");
      await expect(getVisionTheme()).resolves.toBe("sepia");

      await AsyncStorage.setItem("careconnect-vision-theme", "highContrast");
      await expect(getVisionTheme()).resolves.toBe("highContrast");
    });

    it("setVisionTheme stores value", async () => {
      await setVisionTheme("sepia");
      await expect(AsyncStorage.getItem("careconnect-vision-theme")).resolves.toBe("sepia");
    });
  });

  describe("textScale", () => {
    it("getTextScale defaults to 1.0 for missing/NaN", async () => {
      await AsyncStorage.removeItem("careconnect-text-scale");
      await expect(getTextScale()).resolves.toBe(1.0);

      await AsyncStorage.setItem("careconnect-text-scale", "not-a-number");
      await expect(getTextScale()).resolves.toBe(1.0);
    });

    it("getTextScale clamps to [0.85, 1.6]", async () => {
      await AsyncStorage.setItem("careconnect-text-scale", "0.2");
      await expect(getTextScale()).resolves.toBe(0.85);

      await AsyncStorage.setItem("careconnect-text-scale", "3.5");
      await expect(getTextScale()).resolves.toBe(1.6);

      await AsyncStorage.setItem("careconnect-text-scale", "1.2");
      await expect(getTextScale()).resolves.toBe(1.2);
    });

    it("setTextScale clamps and stores string", async () => {
      await setTextScale(0.2);
      await expect(AsyncStorage.getItem("careconnect-text-scale")).resolves.toBe("0.85");

      await setTextScale(2.2);
      await expect(AsyncStorage.getItem("careconnect-text-scale")).resolves.toBe("1.6");

      await setTextScale(1.25);
      await expect(AsyncStorage.getItem("careconnect-text-scale")).resolves.toBe("1.25");
    });
  });
});
