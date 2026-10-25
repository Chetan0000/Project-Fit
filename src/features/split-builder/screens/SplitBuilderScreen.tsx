import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist";

import { Button } from "@/design-system/Button";
import { IconButton } from "@/design-system/IconButton";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { colors } from "@/design-system/theme";
import { getSplit, saveSplit } from "@/core/api";
import type { SplitDay } from "@/core/api/types";
import { useAsyncData } from "@/core/state/useAsyncData";
import { SplitRow } from "@/features/split-builder/components/SplitRow";

/**
 * Onboarding step 3: arrange the rolling Push / Pull / Legs cycle. Days are
 * reorderable by long-press drag; the order is saved through the API layer.
 */
export function SplitBuilderScreen() {
  const router = useRouter();
  const { data } = useAsyncData(getSplit, []);
  const [days, setDays] = useState<SplitDay[] | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setDays(data);
  }, [data]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<SplitDay>) => (
    <ScaleDecorator>
      <SplitRow day={item} onLongPress={drag} active={isActive} />
    </ScaleDecorator>
  );

  const handleSave = async () => {
    if (!days) return;
    setSaving(true);
    try {
      await saveSplit(days);
      router.replace("/(tabs)/today");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <ScreenHeader
        left={
          <IconButton
            icon="arrow-left"
            accessibilityLabel="Back"
            onPress={() => router.back()}
          />
        }
        title="Your split"
      />

      {days ? (
        <DraggableFlatList
          data={days}
          keyExtractor={(day) => day.id}
          onDragEnd={({ data: next }) => setDays(next)}
          renderItem={renderItem}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          ListHeaderComponent={
            <Text className="mb-3 font-sans text-[13px] leading-5 text-muted">
              {days.length} days on a rolling loop. Drag to reorder; rest days sit
              wherever you put them.
            </Text>
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      <View className="px-[18px] pb-4 pt-2">
        <Button
          label="Save split"
          fullWidth
          disabled={saving || !days}
          onPress={handleSave}
        />
      </View>
    </SafeAreaView>
  );
}
