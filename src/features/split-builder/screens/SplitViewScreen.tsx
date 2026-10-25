import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Button } from "@/design-system/Button";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { colors } from "@/design-system/theme";
import { getSplit } from "@/core/api";
import { useAsyncData } from "@/core/state/useAsyncData";
import { SplitRow } from "@/features/split-builder/components/SplitRow";

/** The saved split, read-only. Edit hands off to the onboarding builder. */
export function SplitViewScreen() {
  const router = useRouter();
  const { data: days } = useAsyncData(getSplit, []);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader
        left={<Text className="font-inter-semibold text-[15px] text-text">Your split</Text>}
        right={
          <Button
            label="Edit"
            size="sm"
            variant="outline"
            onPress={() => router.push("/onboarding/split")}
          />
        }
      />

      {days ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ gap: 2, paddingHorizontal: 18, paddingBottom: 20 }}
        >
          <Text className="mb-3 font-sans text-[13px] leading-5 text-muted">
            {days.length} days on a rolling loop. Rest days sit wherever you put
            them.
          </Text>
          {days.map((day) => (
            <SplitRow key={day.id} day={day} />
          ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} />
        </View>
      )}
    </SafeAreaView>
  );
}
