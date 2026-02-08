/**
 * services/database.* tests
 *
 * Use require() (NOT dynamic import) to avoid the Jest "experimental-vm-modules" error.
 */
describe("services/database (native + web)", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("database.native loads (smoke)", () => {
    // If your native database file references expo-sqlite, mock it
    jest.doMock("expo-sqlite", () => ({
      openDatabase: () => ({
        transaction: (fn: (tx: any) => void) => {
          const tx = {
            executeSql: (_sql: string, _params: unknown[], onSuccess?: any) => {
              onSuccess?.(tx, { rows: { _array: [] } });
            },
          };
          fn(tx);
        },
      }),
    }));

    const mod = require("./database.native");
    expect(mod).toBeTruthy();
  });

  it("database.web loads (smoke)", () => {
    // Minimal localStorage mock (if your web file uses it)
    const store: Record<string, string> = {};
    Object.defineProperty(global, "localStorage", {
      value: {
        getItem: (k: string) => (k in store ? store[k] : null),
        setItem: (k: string, v: string) => {
          store[k] = String(v);
        },
        removeItem: (k: string) => {
          delete store[k];
        },
        clear: () => {
          for (const k of Object.keys(store)) delete store[k];
        },
      },
      configurable: true,
    });

    const mod = require("./database.web");
    expect(mod).toBeTruthy();
  });
});
