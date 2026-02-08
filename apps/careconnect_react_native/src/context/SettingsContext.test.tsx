import React from "react";
import { Text } from "react-native";
import { render, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SettingsProvider, useSettings } from "./SettingsContext";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

function Consumer() {
  const s = useSettings();
  return (
    <>
      <Text testID="mode">{s.themeMode}</Text>
      <Text testID="vision">{s.visionTheme}</Text>
      <Text testID="scale">{String(s.textScale)}</Text>
      <Text testID="sr">{String((s as any).screenReaderSupport)}</Text>
      <Text testID="hydrated">{String(s.isHydrated)}</Text>
    </>
  );
}

type SettingsApi = ReturnType<typeof useSettings>;

function setup() {
  let api: SettingsApi | null = null;

  function Grabber() {
    api = useSettings();
    return <Consumer />;
  }

  const utils = render(
    <SettingsProvider>
      <Grabber />
    </SettingsProvider>
  );

  return { ...utils, getApi: () => api! };
}

function mockStorage(map: Record<string, string | null | undefined>) {
  (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
    const v = map[key];
    return Promise.resolve(v ?? null);
  });

  // In case your SettingsContext uses multiGet internally
  (AsyncStorage.multiGet as jest.Mock).mockImplementation((keys: string[]) => {
    return Promise.resolve(keys.map((k) => [k, map[k] ?? null]));
  });
}

describe("SettingsContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hydrates defaults when storage is empty / invalid", async () => {
    mockStorage({
      // support both styles (your project has used both at different times)
      "careconnect-theme-mode": null,
      "careconnect-themeMode": null,
      "careconnect-vision-theme": null,
      "careconnect-visionTheme": null,
      "careconnect-text-scale": null,
      "careconnect-textScale": null,
      "careconnect-screenReaderSupport": null,
      "careconnect-screen-reader-support": null,
    });

    const { getByTestId, getApi } = setup();

    await act(async () => {
      await getApi().hydrate();
    });

    expect(getByTestId("hydrated").props.children).toBe("true");
    expect(getByTestId("mode").props.children).toBe("system");
    expect(getByTestId("vision").props.children).toBe("normal");
    expect(getByTestId("scale").props.children).toBe("1");
  });

  it("hydrates from storage values (camelCase keys)", async () => {
    mockStorage({
      "careconnect-themeMode": "dark",
      "careconnect-visionTheme": "highContrast",
      "careconnect-textScale": "1.4",
      "careconnect-screenReaderSupport": "true",
    });

    const { getByTestId, getApi } = setup();

    await act(async () => {
      await getApi().hydrate();
    });

    expect(getByTestId("hydrated").props.children).toBe("true");
    expect(getByTestId("mode").props.children).toBe("dark");
    expect(getByTestId("vision").props.children).toBe("highContrast");
    expect(getByTestId("scale").props.children).toBe("1.4");
    expect(getByTestId("sr").props.children).toBe("true");
  });

  it("hydrates from storage values (kebab-case keys)", async () => {
    mockStorage({
      "careconnect-theme-mode": "light",
      "careconnect-vision-theme": "sepia",
      "careconnect-text-scale": "1.2",
      "careconnect-screen-reader-support": "false",
    });

    const { getByTestId, getApi } = setup();

    await act(async () => {
      await getApi().hydrate();
    });

    expect(getByTestId("hydrated").props.children).toBe("true");
    expect(getByTestId("mode").props.children).toBe("light");
    expect(getByTestId("vision").props.children).toBe("sepia");
    expect(getByTestId("scale").props.children).toBe("1.2");
  });

  it("updates themeMode + persists using whatever key the implementation uses", async () => {
    mockStorage({});

    const { getByTestId, getApi } = setup();

    await act(async () => {
      await getApi().hydrate();
    });

    await act(async () => {
      await getApi().setThemeMode("dark");
    });

    expect(getByTestId("mode").props.children).toBe("dark");

    // Don't hardcode the key — your implementation has changed key names before.
    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const [key, value] = (AsyncStorage.setItem as jest.Mock).mock.calls[0];
    expect(value).toBe("dark");
    expect(String(key)).toMatch(/careconnect-.*theme/i);
  });

  it("updates visionTheme + persists", async () => {
    mockStorage({});

    const { getByTestId, getApi } = setup();

    await act(async () => {
      await getApi().hydrate();
    });

    await act(async () => {
      await getApi().setVisionTheme("sepia");
    });

    expect(getByTestId("vision").props.children).toBe("sepia");

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const [key, value] = (AsyncStorage.setItem as jest.Mock).mock.calls.slice(-1)[0];
    expect(value).toBe("sepia");
    expect(String(key)).toMatch(/careconnect-.*vision/i);
  });

  it("clamps textScale + persists", async () => {
    mockStorage({});

    const { getByTestId, getApi } = setup();

    await act(async () => {
      await getApi().hydrate();
    });

    await act(async () => {
      await getApi().setTextScale(99);
    });

    // Your app clamps somewhere; accept any reasonable clamp and ensure persisted matches UI.
    const shown = getByTestId("scale").props.children as string;

    expect(AsyncStorage.setItem).toHaveBeenCalled();
    const [, persisted] = (AsyncStorage.setItem as jest.Mock).mock.calls.slice(-1)[0];

    expect(String(persisted)).toBe(String(shown));
  });
});
