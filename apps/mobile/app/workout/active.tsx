/**
 * FitForge — Active Workout Screen
 * apps/mobile/src/app/workout/active.tsx
 */

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ExerciseCard } from "../../src/components/ExerciseCard";
import { useWorkoutStore } from "../../src/store/workout";

export default function ActiveWorkoutScreen() {
  const session = useWorkoutStore((s) => s.session);
  const { endSession, discardSession, addExercise } = useWorkoutStore();

  // ── Duration timer ───────────────────────
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (session?.startedAt) {
        setElapsed(Math.floor((Date.now() - session.startedAt) / 1000));
      }
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.startedAt]);

  // ── Helpers ──────────────────────────────
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const totalSets = session?.exercises.reduce(
    (n, b) => n + b.sets.filter((s) => s.done).length, 0
  ) ?? 0;

  const totalVolume = session?.exercises.reduce(
    (n, b) => n + b.sets.filter((s) => s.done).reduce((sum, s) => sum + s.weight * s.reps, 0),
    0
  ) ?? 0;

  // ── Finish handler ───────────────────────
  const handleFinish = () => {
    Alert.alert("Finish Workout?", "This will save your session.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Finish",
        onPress: () => {
          endSession();
          router.replace("/workout/summary");
        },
      },
    ]);
  };

  // ── Discard handler ──────────────────────
  const handleDiscard = () => {
    Alert.alert("Discard Workout?", "All progress will be lost.", [
      { text: "Keep going", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => {
          discardSession();
          router.replace("/");
        },
      },
    ]);
  };

  // ── Temp: add a dummy exercise (replace with picker later) ──
  const handleAddExercise = () => {
    addExercise("Bench Press");
  };

  if (!session) return null;

  return (
    <SafeAreaView style={styles.safe}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>
            { "Quick Workout"}
          </Text>
          <Text style={styles.title}>Active Workout</Text>
        </View>
        <Pressable style={styles.finishBtn} onPress={handleFinish}>
          <Text style={styles.finishText}>Finish</Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{formatDuration(elapsed)}</Text>
          <Text style={styles.statLabel}>DURATION</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>{totalSets}</Text>
          <Text style={styles.statLabel}>SETS DONE</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statVal}>
            {totalVolume > 0 ? `${totalVolume}` : "0"}
            <Text style={styles.statUnit}> kg</Text>
          </Text>
          <Text style={styles.statLabel}>VOLUME</Text>
        </View>
      </View>

      {/* Exercise list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {session.exercises.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No exercises yet.</Text>
            <Text style={styles.emptySubText}>Tap below to add one.</Text>
          </View>
        )}

        {session.exercises.map((block) => (
          <ExerciseCard key={block.id} block={block} />
        ))}

        {/* Add Exercise */}
        <Pressable style={styles.addExercise} onPress={handleAddExercise}>
          <Text style={styles.addExerciseText}>+ Add Exercise</Text>
        </Pressable>

        {/* Discard */}
        <Pressable style={styles.discardBtn} onPress={handleDiscard}>
          <Text style={styles.discardText}>Discard Workout</Text>
        </Pressable>

      </ScrollView>

    </SafeAreaView>
  );
}

const colors = {
  bg:       "#0C0C0C",
  surface:  "#161616",
  surface2: "#1E1E1E",
  border:   "#2A2A2A",
  accent:   "#4ADE80",
  text:     "#F2F2F2",
  muted:    "#666",
  danger:   "#EF4444",
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Header ─────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.accent,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -0.3,
  },
  finishBtn: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  finishText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
  },

  // ── Stats ──────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  statVal: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  statUnit: {
    fontSize: 11,
    color: colors.muted,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.muted,
    marginTop: 1,
    letterSpacing: 0.5,
  },

  // ── Scroll ─────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ── Empty state ────────────────────────
  empty: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.muted,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  // ── Add exercise ───────────────────────
  addExercise: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  addExerciseText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },

  // ── Discard ────────────────────────────
  discardBtn: {
    alignItems: "center",
    padding: 12,
  },
  discardText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: "500",
  },
});
