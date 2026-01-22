import ThemedSafeAreaView from "@/components/themed-safe-area-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { ThemedView } from "@/components/themed-view";
import { ThemedOption } from "@/components/themed-option";
import { StyleSheet, FlatList } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/features/onboarding/presentation/context/onboarding-context";
import { useCreateProfile } from "@/features/profile/presentation/hooks/use-create-profile";
import { useAuth } from "@/features/auth/presentation/hooks/use-auth";
import type { AgeRange } from "@/features/profile/domain/entities/profile";

const AGE_RANGES: AgeRange[] = ["18-24", "25-34", "35+"];

export default function AgeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: onboardingData, setAgeRange, reset } = useOnboarding();
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(
    onboardingData.ageRange,
  );
  const { mutate: createProfile, isPending } = useCreateProfile();

  const onPress = () => {
    if (!selectedAge) return;

    setAgeRange(selectedAge);

    createProfile(
      {
        profile: {
          firstname: onboardingData.firstname,
          lastname: onboardingData.lastname,
          ageRange: selectedAge,
        },
        userId: user?.id ?? "",
      },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  const renderAgeOption = ({ item }: { item: AgeRange }) => (
    <ThemedOption
      isSelected={selectedAge === item}
      onPress={() => setSelectedAge(item)}
    >
      {item}
    </ThemedOption>
  );

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type='title' style={styles.title}>
            {t("onboarding.age.title")}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t("onboarding.age.subtitle")}
          </ThemedText>
          <FlatList
            data={AGE_RANGES}
            renderItem={renderAgeOption}
            keyExtractor={(item) => item}
            ItemSeparatorComponent={() => (
              <ThemedView style={styles.separator} />
            )}
            scrollEnabled={false}
          />
        </ThemedView>
        <ThemedButton
          onPress={onPress}
          disabled={!selectedAge}
          isLoading={isPending}
        >
          {t("onboarding.age.next")}
        </ThemedButton>
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 20,
    justifyContent: "space-between",
  },
  content: {
    gap: 20,
    width: "100%",
  },
  separator: {
    height: 12,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
});
