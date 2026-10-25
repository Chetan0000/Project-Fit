import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Button } from "@/design-system/Button";
import { IconButton } from "@/design-system/IconButton";
import { ProgressBar } from "@/design-system/ProgressBar";
import { RowList } from "@/design-system/RowList";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { Stepper } from "@/design-system/Stepper";
import { colors } from "@/design-system/theme";
import { getToday, logSet } from "@/core/api";
import { formatRepRange, formatWeight } from "@/core/lib/format";
import { useAsyncData } from "@/core/state/useAsyncData";
import { SetRow } from "@/features/workout/components/SetRow";

export function ActiveWorkoutScreen() {
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { data: session, reload } = useAsyncData(getToday, []);

  const progress = session?.exercises.find((e) => e.exercise.id === exerciseId) ?? null;
  const exercise = progress?.exercise ?? null;
  const exerciseKey = exercise?.id ?? null;
  const targetWeight = exercise?.targetWeightKg ?? 0;
  const targetReps = exercise?.repMax ?? 0;

  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  useEffect(() => {
    setWeight(targetWeight);
    setReps(targetReps);
  }, [exerciseKey, targetWeight, targetReps]);

  if (!session || !progress || !exercise) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg" edges={["top"]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  const done = progress.sets.filter((set) => set.done).length;
  const total = progress.sets.length;
  const index = session.exercises.findIndex((e) => e.exercise.id === exerciseId);
  const nextExercise = session.exercises[index + 1]?.exercise.name;

  const handleLog = async () => {
    if (!exerciseId) return;
    await logSet({ exerciseId, weightKg: weight, reps });
    reload();
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
        title={exercise.name}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 14,
          paddingHorizontal: 18,
          paddingTop: 4,
          paddingBottom: 20,
        }}
      >
        <Text className="font-sans text-xs text-faint">
          Exercise {index + 1} of {session.exercises.length} · target {exercise.sets} ×{" "}
          {formatRepRange(exercise.repMin, exercise.repMax)} ·{" "}
          {formatWeight(exercise.targetWeightKg)}
        </Text>

        <RowList>
          {progress.sets.map((set) => (
            <SetRow key={set.index} log={set} />
          ))}
        </RowList>

        <View className="flex-row gap-2.5">
          <Stepper
            className="flex-1"
            label="Weight"
            value={weight.toFixed(1)}
            onDecrement={() => setWeight((w) => Math.max(0, w - 2.5))}
            onIncrement={() => setWeight((w) => w + 2.5)}
          />
          <Stepper
            className="flex-1"
            label="Reps"
            value={String(reps)}
            onDecrement={() => setReps((r) => Math.max(1, r - 1))}
            onIncrement={() => setReps((r) => r + 1)}
          />
        </View>

        <Button
          label={`Log set ${Math.min(done + 1, total)}`}
          fullWidth
          disabled={done >= total}
          onPress={handleLog}
        />

        <ProgressBar
          progress={total > 0 ? done / total : 0}
          left={`${done} of ${total} sets`}
          right={nextExercise ? `next: ${nextExercise}` : "last exercise"}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
