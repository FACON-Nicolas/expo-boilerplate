import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";

import { useReducedTransparency } from "@/core/presentation/hooks/use-accessibility";
import { useThemeColors } from "@/ui/theme/use-theme-colors";

export default function RootLayout() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const tintColor = colors.tint;
  const isReducedTransparency = useReducedTransparency();

  return (
    <NativeTabs
      tintColor={tintColor}
      disableTransparentOnScrollEdge={isReducedTransparency}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md="home"
        />
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon
          sf={{ default: "person", selected: "person.fill" }}
          md="person"
        />
        <NativeTabs.Trigger.Label>{t("tabs.profile")}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
