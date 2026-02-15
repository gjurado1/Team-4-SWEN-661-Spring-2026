describe("services/database.native", () => {
  const setup = (opts?: { seedCount?: number; loginUser?: any }) => {
    const seedCount = opts?.seedCount ?? 0;
    const loginUser = opts?.loginUser ?? null;

    const mockDb = {
      execAsync: jest.fn().mockResolvedValue(undefined),
      getFirstAsync: jest.fn().mockImplementation((sql: string) => {
        if (sql.includes("COUNT(*)")) return Promise.resolve({ count: seedCount });
        return Promise.resolve(loginUser);
      }),
      runAsync: jest.fn().mockResolvedValue({ lastInsertRowId: 77 }),
    };

    jest.doMock("expo-sqlite", () => ({
      openDatabaseAsync: jest.fn().mockResolvedValue(mockDb),
    }));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("./database.native");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sqlite = require("expo-sqlite");

    return { mod, mockDb, sqlite };
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("initializes DB and seeds admin when missing", async () => {
    const { mod, mockDb, sqlite } = setup({ seedCount: 0 });

    const db = await mod.getDb();
    expect(db).toBe(mockDb);
    expect(sqlite.openDatabaseAsync).toHaveBeenCalledWith("app_database.db");
    expect(mockDb.execAsync).toHaveBeenCalledTimes(2);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      ["admin", "password123"]
    );
  });

  it("does not seed admin if already present", async () => {
    const { mod, mockDb } = setup({ seedCount: 1 });
    await mod.getDb();
    expect(mockDb.runAsync).not.toHaveBeenCalledWith(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      ["admin", "password123"]
    );
  });

  it("login returns null when username/password are empty after trim", async () => {
    const { mod, mockDb } = setup({ seedCount: 1 });
    const out = await mod.login("   ", "   ");
    expect(out).toBeNull();
    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      "SELECT COUNT(*) as count FROM users WHERE username = ?;",
      ["admin"]
    );
  });

  it("login returns matching user", async () => {
    const user = { id: 3, username: "admin", password: "password123" };
    const { mod, mockDb } = setup({ seedCount: 1, loginUser: user });
    const out = await mod.login(" admin ", " password123 ");
    expect(out).toEqual(user);
    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      "SELECT id, username, password FROM users WHERE username = ? AND password = ? LIMIT 1;",
      ["admin", "password123"]
    );
  });

  it("createUser inserts trimmed username and returns row id", async () => {
    const { mod, mockDb } = setup({ seedCount: 1 });
    const id = await mod.createUser({ id: 0, username: "  new_user  ", password: "pw" });
    expect(id).toBe(77);
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      "INSERT INTO users (username, password) VALUES (?, ?);",
      ["new_user", "pw"]
    );
  });
});
