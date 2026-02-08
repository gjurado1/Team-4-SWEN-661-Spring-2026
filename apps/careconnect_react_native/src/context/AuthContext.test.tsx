import React from "react";
import { Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, act } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "./AuthContext";

// Small probe component to call context actions + show state
function Probe(props: { onReady?: (ctx: ReturnType<typeof useAuth>) => void }) {
  const ctx = useAuth();
  React.useEffect(() => {
    props.onReady?.(ctx);
  }, [ctx, props]);

  return (
    <>
      <Text testID="role">{ctx.role ?? "null"}</Text>
      <Text testID="username">{ctx.username ?? "null"}</Text>
      <Text testID="hydrated">{ctx.isHydrated ? "true" : "false"}</Text>
    </>
  );
}

describe("context/AuthContext", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("useAuth throws when used outside AuthProvider", () => {
    // Suppress expected React error noise in test output
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow("useAuth must be used inside AuthProvider");

    spy.mockRestore();
  });

  it("initial state is not hydrated", () => {
    const { getByTestId } = render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(getByTestId("role").props.children).toBe("null");
    expect(getByTestId("username").props.children).toBe("null");
    expect(getByTestId("hydrated").props.children).toBe("false");
  });

  it("hydrate loads role/username from storage", async () => {
    await AsyncStorage.setItem("careconnect-role", "patient");
    await AsyncStorage.setItem("careconnect-username", "alice");

    let ctxRef: ReturnType<typeof useAuth> | null = null;

    const { getByTestId } = render(
      <AuthProvider>
        <Probe onReady={(ctx) => (ctxRef = ctx)} />
      </AuthProvider>
    );

    await act(async () => {
      await ctxRef?.hydrate();
    });

    expect(getByTestId("role").props.children).toBe("patient");
    expect(getByTestId("username").props.children).toBe("alice");
    expect(getByTestId("hydrated").props.children).toBe("true");
  });

  it("login sets storage + updates state", async () => {
    let ctxRef: ReturnType<typeof useAuth> | null = null;

    const { getByTestId } = render(
      <AuthProvider>
        <Probe onReady={(ctx) => (ctxRef = ctx)} />
      </AuthProvider>
    );

    await act(async () => {
      await ctxRef?.login({ username: "bob", role: "caregiver" });
    });

    expect(getByTestId("role").props.children).toBe("caregiver");
    expect(getByTestId("username").props.children).toBe("bob");
    expect(getByTestId("hydrated").props.children).toBe("true");

    await expect(AsyncStorage.getItem("careconnect-role")).resolves.toBe("caregiver");
    await expect(AsyncStorage.getItem("careconnect-username")).resolves.toBe("bob");
  });

  it("logout clears storage + resets state", async () => {
    let ctxRef: ReturnType<typeof useAuth> | null = null;

    const { getByTestId } = render(
      <AuthProvider>
        <Probe onReady={(ctx) => (ctxRef = ctx)} />
      </AuthProvider>
    );

    await act(async () => {
      await ctxRef?.login({ username: "carol", role: "patient" });
    });

    await act(async () => {
      await ctxRef?.logout();
    });

    expect(getByTestId("role").props.children).toBe("null");
    expect(getByTestId("username").props.children).toBe("null");
    expect(getByTestId("hydrated").props.children).toBe("true");

    await expect(AsyncStorage.getItem("careconnect-role")).resolves.toBeNull();
    await expect(AsyncStorage.getItem("careconnect-username")).resolves.toBeNull();
  });
});
