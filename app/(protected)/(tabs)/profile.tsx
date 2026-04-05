import { useTranslation } from "react-i18next";

import { useAuth } from "@/features/auth/presentation/hooks/use-auth";
import { Button } from "@/ui/components/button";
import { SafeAreaView } from "@/ui/components/safe-area-view";
import { Text } from "@/ui/components/text";
import { View } from "@/ui/components/view";

export default function Profile() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={{ paddingHorizontal: 20, gap: 10 }}>
      <Text>{t("profile.title")}</Text>

      <View style={{ marginTop: 'auto', marginBottom: 16 }}>
        <Button onPress={signOut} variant='danger'>
          {t("profile.signOut")}
        </Button>
      </View>
    </SafeAreaView>
  );
}
