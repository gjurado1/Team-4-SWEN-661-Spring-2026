import { renderHook } from "@testing-library/react-native";

const mockUseWindowDimensions = jest.fn();

// IMPORTANT: do NOT jest.requireActual('react-native') here
jest.mock(
  "react-native",
  () => ({
    useWindowDimensions: () => mockUseWindowDimensions(),
  }),
  { virtual: true }
);

import { useResponsive } from "./useResponsive";

describe("useResponsive", () => {
  beforeEach(() => {
    mockUseWindowDimensions.mockReset();
  });

  it("returns phone defaults for small width", () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 360,
      height: 800,
      fontScale: 1,
      scale: 2,
    });

    const { result } = renderHook(() => useResponsive());

    // ✅ Match your actual hook shape:
    // update these expectations if your hook uses different property names
    expect(result.current.isTablet).toBe(false);
  });

  it("returns tablet for larger width", () => {
    mockUseWindowDimensions.mockReturnValue({
      width: 900,
      height: 1200,
      fontScale: 1,
      scale: 2,
    });

    const { result } = renderHook(() => useResponsive());
    expect(result.current.isTablet).toBe(true);
  });
});
