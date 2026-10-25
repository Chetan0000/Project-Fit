import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BarChart } from "@/design-system/BarChart";
import { Card } from "@/design-system/Card";
import { IconButton } from "@/design-system/IconButton";
import { Kpi, KpiStrip } from "@/design-system/KpiStrip";
import { Mark } from "@/design-system/Mark";
import { Row, RowGrow, RowList, RowValue } from "@/design-system/RowList";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { colors } from "@/design-system/theme";
import { getProgressOverview } from "@/core/api";
import { formatIsoDate, formatSignedPercent, formatWeight } from "@/core/lib/format";
import { useAsyncData } from "@/core/state/useAsyncData";

export function ProgressScreen() {
  const { data } = useAsyncData(getProgressOverview, []);

  if (!data) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg" edges={["top"]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  const { weeklyVolume, records, summary } = data;
  const latest = weeklyVolume[weeklyVolume.length - 1]?.volumeKg ?? 0;
  const previous = weeklyVolume[weeklyVolume.length - 2]?.volumeKg ?? 0;
  const delta = previous > 0 ? (latest - previous) / previous : 0;

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
        <View>
          <Text className="font-inter-semibold text-[22px] tracking-tight text-text">
            Progress
          </Text>
          <Text className="mt-0.5 font-sans text-[14px] leading-[21px] text-muted">
            Weekly volume, last {weeklyVolume.length} weeks.{" "}
            <Text className={delta < 0 ? "text-negative" : "text-positive"}>
              {delta < 0 ? "Down" : "Up"} {formatSignedPercent(delta).replace(/^[+-]/, "")}
            </Text>{" "}
            on the week before.
          </Text>
        </View>

        <KpiStrip>
          <Kpi
            label="This week"
            value={String(summary.weekSessions)}
            suffix={`/${summary.weekTarget} sessions`}
          />
          <Kpi
            label="Streak"
            value={String(summary.streakSessions)}
            suffix=" sessions"
          />
          <Kpi
            label="Records"
            value={String(summary.recordsThisCycle)}
            suffix=" this cycle"
          />
        </KpiStrip>

        <Card>
          <BarChart
            data={weeklyVolume.map((week) => ({
              label: week.label,
              value: week.volumeKg,
            }))}
          />
        </Card>

        <View>
          <Text className="mb-2 font-inter-medium text-xs text-muted">
            Personal records
          </Text>
          <RowList>
            {records.map((record) => (
              <Row key={record.id}>
                <RowGrow
                  title={record.exercise}
                  subtitle={formatIsoDate(record.achievedOn)}
                />
                <RowValue value={formatWeight(record.weightKg)} />
              </Row>
            ))}
          </RowList>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
