type User = { username: string; password: string; role: "caregiver" | "patient" };

describe("services/database.web", () => {
  const store: Record<string, string> = {};

  const setStorage = () => {
    Object.defineProperty(global, "localStorage", {
      configurable: true,
      value: {
        getItem: jest.fn((k: string) => (k in store ? store[k] : null)),
        setItem: jest.fn((k: string, v: string) => {
          store[k] = String(v);
        }),
        removeItem: jest.fn((k: string) => {
          delete store[k];
        }),
        clear: jest.fn(() => {
          Object.keys(store).forEach((k) => delete store[k]);
        }),
      },
    });
  };

  const load = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("./database.web");
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    Object.keys(store).forEach((k) => delete store[k]);
    setStorage();
  });

  it("initDb seeds default admin when storage is empty", async () => {
    const mod = load();
    await mod.initDb();
    const raw = store["careconnect-users"];
    expect(raw).toBeTruthy();
    const users = JSON.parse(raw) as User[];
    expect(users[0]).toEqual({
      username: "admin",
      password: "password123",
      role: "caregiver",
    });
  });

  it("login returns matching user role and null when no match", async () => {
    const mod = load();
    store["careconnect-users"] = JSON.stringify([
      { username: "admin", password: "password123", role: "caregiver" },
      { username: "pat", password: "abc", role: "patient" },
    ]);

    await expect(mod.login("pat", "abc")).resolves.toEqual({
      username: "pat",
      role: "patient",
    });
    await expect(mod.login("pat", "wrong")).resolves.toBeNull();
  });

  it("createUser returns false for duplicate username", async () => {
    const mod = load();
    store["careconnect-users"] = JSON.stringify([
      { username: "admin", password: "password123", role: "caregiver" },
    ]);

    await expect(
      mod.createUser({ username: "admin", password: "new", role: "patient" })
    ).resolves.toBe(false);
  });

  it("createUser appends user and persists to storage", async () => {
    const mod = load();
    store["careconnect-users"] = JSON.stringify([
      { username: "admin", password: "password123", role: "caregiver" },
    ]);

    await expect(
      mod.createUser({ username: "newUser", password: "pw", role: "patient" })
    ).resolves.toBe(true);

    const users = JSON.parse(store["careconnect-users"]) as User[];
    expect(users.some((u) => u.username === "newUser" && u.role === "patient")).toBe(true);
  });

  it("falls back to seeded user when storage JSON is invalid", async () => {
    const mod = load();
    store["careconnect-users"] = "{invalid-json}";

    await expect(mod.login("admin", "password123")).resolves.toEqual({
      username: "admin",
      role: "caregiver",
    });
  });
});
