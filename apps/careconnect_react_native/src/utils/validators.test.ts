import { isNonEmpty } from "./validators";

describe("utils/validators", () => {
  it("isNonEmpty returns false for empty/whitespace", () => {
    expect(isNonEmpty("")).toBe(false);
    expect(isNonEmpty("   ")).toBe(false);
    expect(isNonEmpty("\n\t")).toBe(false);
  });

  it("isNonEmpty returns true for non-empty text", () => {
    expect(isNonEmpty("a")).toBe(true);
    expect(isNonEmpty(" test ")).toBe(true);
  });
});
