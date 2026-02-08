import "@testing-library/jest-native/extend-expect";

// ✅ AsyncStorage mock (fixes: NativeModule AsyncStorage is null)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// ✅ Reanimated mock (only if installed)
// NOTE: use doMock (not hoisted) so the try/catch actually works.
try {
  require.resolve("react-native-reanimated");
  jest.doMock("react-native-reanimated", () =>
    require("react-native-reanimated/mock")
  );
} catch {
  // reanimated not installed — ignore
}

// ✅ Gesture handler mock
jest.mock("react-native-gesture-handler", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const View = require("react-native/Libraries/Components/View/View");
  return {
    ...jest.requireActual("react-native-gesture-handler"),
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    FlingGestureHandler: View,
    RotationGestureHandler: View,
    PinchGestureHandler: View,
    GestureHandlerRootView: View,
  };
});

// ✅ Some RN versions don’t have this module path anymore; virtual prevents "Cannot find module"
jest.mock(
  "react-native/Libraries/Animated/NativeAnimatedHelper",
  () => ({}),
  { virtual: true }
);

// ✅ Expo StatusBar harmless mock
jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));
