import { Tabs } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useTranslation } from "react-i18next";

import { TabBarIcon } from "@/ui/components/tab-bar-icon";

export default function RootLayout() {
  const { t } = useTranslation();
  const [backgroundColor, tintColor] = useThemeColor(["background", "accent"]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor,
          borderTopColor: tintColor,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: t("tabs.home"),
          tabBarIcon: (props) => <TabBarIcon name='home' {...props} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: t("tabs.profile"),
          tabBarIcon: (props) => <TabBarIcon name='person' {...props} />,
        }}
      />
    </Tabs>
  );
}
