import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Button } from "@/design-system/Button";
import { Row, RowList } from "@/design-system/RowList";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { colors } from "@/design-system/theme";
import { getProfile } from "@/core/api";
import { formatIsoDate } from "@/core/lib/format";
import { useAsyncData } from "@/core/state/useAsyncData";

/** Minimal profile tab: identity header plus a few static rows. */
export function ProfileScreen() {
  const router = useRouter();
  const { data: profile } = useAsyncData(getProfile, []);

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg" edges={["top"]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScreenHeader title="Profile" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 14,
          paddingHorizontal: 18,
          paddingTop: 4,
          paddingBottom: 20,
        }}
      >
        <View className="flex-row items-center gap-3">
          <View className="h-[42px] w-[42px] items-center justify-center rounded-control bg-raised">
            <Text className="font-inter-semibold text-[15px] text-text">{initial}</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="font-inter-medium text-[15px] text-text">
              {profile.username}
            </Text>
            <Text className="font-sans text-xs text-muted">
              Member since {formatIsoDate(profile.memberSince)}
            </Text>
          </View>
        </View>

        <RowList>
          <Row>
            <Text className="flex-1 font-inter-medium text-[15px] text-text">
              Username
            </Text>
            <Text className="font-sans text-[15px] text-muted">
              {profile.username}
            </Text>
          </Row>
          <Row>
            <Text className="flex-1 font-inter-medium text-[15px] text-text">Units</Text>
            <Text className="font-sans text-[15px] text-muted">kg</Text>
          </Row>
          <Row>
            <Text className="flex-1 font-inter-medium text-[15px] text-text">About</Text>
            <Text className="font-sans text-[15px] text-muted">v1.0.0</Text>
          </Row>
        </RowList>

        {/* TODO: real sign-out once accounts exist. */}
        <Button
          label="Sign out"
          variant="outline"
          fullWidth
          onPress={() => router.replace("/")}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
