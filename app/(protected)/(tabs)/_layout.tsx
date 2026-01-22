import { TabBarIcon } from "@/ui/components/tab-bar-icon";
import { useThemeColor } from "heroui-native";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

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
