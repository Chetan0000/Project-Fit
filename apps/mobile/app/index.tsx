/**
 * FitForge — Home Screen
 * apps/mobile/app/index.tsx
 */

import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useWorkoutStore } from "../src/store/workout";

export default function HomeScreen() {
  const session                        = useWorkoutStore((s) => s.session);
  const { startSession, discardSession } = useWorkoutStore();

  const handleStart = () => {
    startSession();
    router.push("/workout/active");
  };

  const handleResume = () => {
    router.push("/workout/active");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Logo / Title */}
        <View style={styles.top}>
          <Text style={styles.logo}>FitForge</Text>
          <Text style={styles.sub}>Track. Progress. Dominate.</Text>
        </View>

        {/* If a session is already running (crash recovery) */}
        {session ? (
          <View style={styles.resumeBox}>
            <Text style={styles.resumeTitle}>Workout in progress</Text>
            <Text style={styles.resumeSub}>You have an unfinished session.</Text>

            <Pressable style={styles.primaryBtn} onPress={handleResume}>
              <Text style={styles.primaryText}>Resume Workout</Text>
            </Pressable>

            <Pressable onPress={discardSession}>
              <Text style={styles.discardText}>Discard</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.primaryBtn} onPress={handleStart}>
            <Text style={styles.primaryText}>Start Workout</Text>
          </Pressable>
        )}

      </View>
    </SafeAreaView>
  );
}

const colors = {
  bg:     "#0C0C0C",
  surface:"#161616",
  border: "#2A2A2A",
  accent: "#4ADE80",
  text:   "#F2F2F2",
  muted:  "#666",
  danger: "#EF4444",
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingBottom: 48,
    paddingTop: 60,
  },

  top: {
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: -1,
  },
  sub: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    letterSpacing: 0.3,
  },

  primaryBtn: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },

  resumeBox: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    gap: 12,
  },
  resumeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  resumeSub: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
  },
  discardText: {
    fontSize: 13,
    color: colors.danger,
    textAlign: "center",
    marginTop: 4,
  },
});