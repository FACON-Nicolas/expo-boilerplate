import { ThemedButton } from "@/components/themed-button";
import ThemedSafeAreaView from "@/components/themed-safe-area-view";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/features/auth/presentation/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { createSupabaseAuthRepository } from "@/features/auth/data/repositories/supabase-auth-repository";
import { supabaseClient } from "@/infrastructure/supabase/client";

export default function Profile() {
  const { t } = useTranslation();
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();

  const authRepository = createSupabaseAuthRepository(supabaseClient);

  const onSignOut = async () => {
    try {
      await authRepository.signOut();
      signOut();
      await queryClient.invalidateQueries({
        queryKey: ["profile", user?.id],
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemedSafeAreaView style={styles.container}>
      <ThemedText>{t("profile.title")}</ThemedText>
      <ThemedButton onPress={onSignOut} variant='error'>
        {t("profile.signOut")}
      </ThemedButton>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 10,
  },
});
