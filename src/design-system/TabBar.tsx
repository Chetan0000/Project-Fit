import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LABELS: Record<string, string> = {
  today: "Today",
  split: "Split",
  progress: "Progress",
  profile: "Profile",
};

/**
 * The direction's tab bar: text only, no icons. The active tab is white and
 * semibold; the rest sit at the idle grey.
 */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-stretch border-t border-border px-2 pt-2"
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const label = LABELS[route.name] ?? route.name;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            onPress={() => {
              if (!focused) navigation.navigate(route.name);
            }}
            className="h-[46px] flex-1 items-center justify-center"
          >
            <Text
              className={
                focused
                  ? "font-inter-semibold text-[13px] text-text"
                  : "font-inter-medium text-[13px] text-tab-idle"
              }
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
