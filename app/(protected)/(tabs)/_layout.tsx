import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { useThemeColor } from "heroui-native";
import { useTranslation } from "react-i18next";

export default function RootLayout() {
  const { t } = useTranslation();
  const [tintColor] = useThemeColor(["accent"]);

  return (
    <NativeTabs tintColor={tintColor}>
      <NativeTabs.Trigger name="index">
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          androidSrc={{
            default: <VectorIcon family={Ionicons} name="home-outline" />,
            selected: <VectorIcon family={Ionicons} name="home" />,
          }}
        />
        <Label>{t("tabs.home")}</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon
          sf={{ default: "person", selected: "person.fill" }}
          androidSrc={{
            default: <VectorIcon family={Ionicons} name="person-outline" />,
            selected: <VectorIcon family={Ionicons} name="person" />,
          }}
        />
        <Label>{t("tabs.profile")}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
