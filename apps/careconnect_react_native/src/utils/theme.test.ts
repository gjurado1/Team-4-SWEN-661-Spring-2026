import { buildTheme } from "./theme";

describe("buildTheme", () => {
  it("returns light theme for normal", () => {
    const t = buildTheme("system", "normal");
    expect(t.isDark).toBe(false);
    expect(t.colors.background).toBe("#F5F7FA");
    expect(t.colors.primary).toBe("#4C6FBC");
  });

  it("returns dark contrast for highContrast", () => {
    const t = buildTheme("system", "highContrast");
    expect(t.isDark).toBe(true);
    expect(t.colors.background).toBe("#000000");
    expect(t.colors.primary).toBe("#0066FF");
  });

  it("returns sepia theme for sepia", () => {
    const t = buildTheme("system", "sepia");
    expect(t.isDark).toBe(false);
    expect(t.colors.background).toBe("#F4F1E8");
    expect(t.colors.primary).toBe("#8B6F47");
  });
});
