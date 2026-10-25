import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

import { Button } from "@/design-system/Button";
import { CycleStrip, type CycleDay } from "@/design-system/CycleStrip";
import { Mark } from "@/design-system/Mark";

const DEFAULT_CYCLE: CycleDay[] = [
  { label: "Push A" },
  { label: "Pull A" },
  { label: "Legs A" },
  { label: "Rest", rest: true },
  { label: "Push B" },
  { label: "Pull B" },
  { label: "Legs B" },
  { label: "Rest", rest: true },
];

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={FadeInDown.delay(100).duration(500)} className="mb-6">
          <Mark size={34} />
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(200).duration(500)}
          className="text-center font-inter-semibold text-[30px] leading-[1.15] tracking-tight text-text"
        >
          Track the cycle,{"\n"}not the week
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(500)}
          className="mt-3 text-center font-sans text-[15px] leading-[22px] text-muted"
        >
          FitForge runs your Push / Pull / Legs split as a rolling cycle. Miss a
          day and the whole plan shifts with you, no resetting to Monday.
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          className="mt-6 w-full"
        >
          <CycleStrip days={DEFAULT_CYCLE} className="justify-center" />
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(500).duration(500)}
        className="gap-2.5 px-5 pb-6 pt-2"
      >
        <Button
          label="Start training"
          fullWidth
          onPress={() => router.push("/onboarding/username")}
        />
        <Button
          label="I already have an account"
          variant="outline"
          fullWidth
          // TODO: route to a real sign-in flow once accounts exist.
          onPress={() => router.push("/onboarding/username")}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
