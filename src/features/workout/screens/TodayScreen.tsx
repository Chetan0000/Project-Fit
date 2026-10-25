import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

import { Button } from "@/design-system/Button";
import { CycleStrip } from "@/design-system/CycleStrip";
import { IconButton } from "@/design-system/IconButton";
import { Kpi, KpiStrip } from "@/design-system/KpiStrip";
import { Mark } from "@/design-system/Mark";
import { RowList } from "@/design-system/RowList";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { colors } from "@/design-system/theme";
import { getToday } from "@/core/api";
import { formatThousands } from "@/core/lib/format";
import { useAsyncData } from "@/core/state/useAsyncData";
import { ExerciseRow } from "@/features/workout/components/ExerciseRow";

export function TodayScreen() {
  const router = useRouter();
  const { data: session } = useAsyncData(getToday, []);

  if (!session) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg" edges={["top"]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  const firstExerciseId = session.exercises[0]?.exercise.id;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader
        left={
          <View className="flex-row items-center gap-[9px]">
            <Mark size={18} color={colors.text} />
            <Text className="font-inter-semibold text-[15px] text-text">FitForge</Text>
          </View>
        }
        right={<IconButton icon="more-vertical" accessibilityLabel="Options" />}
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
        <Animated.View
          entering={FadeInDown.duration(400)}
          className="flex-row items-end justify-between gap-3"
        >
          <View className="min-w-0 flex-1">
            <Text className="font-inter-semibold text-[22px] leading-[1.2] tracking-tight text-text">
              {session.dayName}
            </Text>
            <Text className="mt-0.5 font-sans text-[14px] text-muted">
              Today · session {session.sessionNumber} of {session.cycleLength} in
              the cycle
            </Text>
          </View>
          <Button
            label="Start"
            size="sm"
            disabled={!firstExerciseId}
            onPress={() => firstExerciseId && router.push(`/workout/${firstExerciseId}`)}
          />
        </Animated.View>

        <CycleStrip days={session.cycle} todayIndex={session.sessionNumber - 1} />

        <KpiStrip>
          <Kpi
            label="Sets logged"
            value={String(session.setsLogged)}
            suffix={`/${session.setsPlanned}`}
            tone="accent"
          />
          <Kpi
            label="Volume today"
            value={formatThousands(session.volumeKg)}
            suffix=" kg"
          />
          <Kpi
            label="Streak"
            value={String(session.streakSessions)}
            suffix=" sessions"
          />
        </KpiStrip>

        <RowList>
          {session.exercises.map((progress) => (
            <ExerciseRow key={progress.exercise.id} progress={progress} />
          ))}
        </RowList>
      </ScrollView>
    </SafeAreaView>
  );
}
