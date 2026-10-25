import { useMemo, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

import { Button } from "@/design-system/Button";
import { IconButton } from "@/design-system/IconButton";
import { Input } from "@/design-system/Input";
import { ProgressBar } from "@/design-system/ProgressBar";
import { ScreenHeader } from "@/design-system/ScreenHeader";
import { ProfilePreview } from "@/features/onboarding/components/ProfilePreview";
import {
  USERNAME_MAX_LENGTH,
  isValidUsername,
  sanitizeUsername,
} from "@/core/domain/username";

export function UsernameScreen() {
  const router = useRouter();
  const [name, setName] = useState("");

  const valid = useMemo(() => isValidUsername(name), [name]);

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
        title="Set up"
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 18,
          paddingTop: 6,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(400)}>
          <ProgressBar progress={1 / 3} left="Profile" right="1 of 3" />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(80).duration(400)}
          className="mt-5 font-inter-semibold text-[26px] leading-[1.2] tracking-tight text-text"
        >
          What should we call you?
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(140).duration(400)}
          className="mt-1.5 font-sans text-[14px] leading-[21px] text-muted"
        >
          This is the name on your profile. You can change it later.
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mt-5">
          <Text className="mb-2 font-inter-medium text-[15px] text-text">Username</Text>
          <Input
            value={name}
            onChangeText={(text) => setName(sanitizeUsername(text))}
            placeholder="chetan"
            valid={valid}
            maxLength={USERNAME_MAX_LENGTH}
            returnKeyType="done"
          />
          <Text className="mt-2 font-sans text-xs text-muted">
            Letters, numbers and underscores. 2–20 characters.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(260).duration(400)} className="mt-5">
          <ProfilePreview username={name} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(400)} className="mt-auto pt-6">
          <Button
            label="Continue"
            fullWidth
            disabled={!valid}
            onPress={() =>
              router.push({
                pathname: "/onboarding/split",
                params: { username: name },
              })
            }
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
