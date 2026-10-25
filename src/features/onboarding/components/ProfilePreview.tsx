import { View, Text } from "react-native";

import { Card } from "@/design-system/Card";

type ProfilePreviewProps = {
  username: string;
  /** Human-readable join date; defaults to "today" while signing up. */
  memberSince?: string;
};

/** Live preview of the profile card, shown while choosing a username. */
export function ProfilePreview({ username, memberSince = "today" }: ProfilePreviewProps) {
  const initial = username.trim().charAt(0).toUpperCase() || "?";

  return (
    <Card className="gap-3">
      <Text className="font-inter-semibold text-[11px] uppercase tracking-wider text-muted">
        Preview
      </Text>
      <View className="flex-row items-center gap-3">
        <View className="h-[42px] w-[42px] items-center justify-center rounded-control bg-raised">
          <Text className="font-inter-semibold text-[15px] text-text">{initial}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="font-inter-medium text-[15px] text-text" numberOfLines={1}>
            {username || "Your name"}
          </Text>
          <Text className="font-sans text-xs text-muted">Member since {memberSince}</Text>
        </View>
      </View>
    </Card>
  );
}
