import { ThemedInput } from "@/components/themed-input";
import ThemedSafeAreaView from "@/components/themed-safe-area-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedButton } from "@/components/themed-button";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { router } from "expo-router";
import { Identity } from "@/types/onboarding";

export default function IdentityScreen() {
  const { t } = useTranslation();
  const { profile, setIdentity, isValidIdentity } = useOnboarding();
  const [identity, setIdentityForm] = useState<Identity>({
    firstname: profile.firstname,
    lastname: profile.lastname,
  });

  const onFieldChange = (field: keyof Identity, value: string) => {
    setIdentityForm((prev) => ({ ...prev, [field]: value }));
  };

  const onPress = () => {
    setIdentity(identity);
    router.push("/age");
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.form}>
          <ThemedText type='title' style={styles.title}>
            {t("onboarding.identity.title")}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {t("onboarding.identity.subtitle")}
          </ThemedText>
          <ThemedView style={styles.inputs}>
            <ThemedInput
              value={identity.firstname}
              placeholder={t("onboarding.identity.firstname")}
              autoCorrect={false}
              onChangeText={(value) => onFieldChange("firstname", value)}
            />
            <ThemedInput
              value={identity.lastname}
              placeholder={t("onboarding.identity.lastname")}
              autoCorrect={false}
              onChangeText={(value) => onFieldChange("lastname", value)}
            />
          </ThemedView>
        </ThemedView>
        <ThemedButton onPress={onPress} disabled={!isValidIdentity(identity)}>
          {t("onboarding.identity.next")}
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
  form: {
    gap: 20,
  },
  inputs: {
    gap: 10,
    width: "100%",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
});
