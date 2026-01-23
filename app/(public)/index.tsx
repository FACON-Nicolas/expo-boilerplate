import { Button } from "@/ui/components/button";
import { FormTextField } from "@/ui/components/form/form-text-field";
import { Link } from "@/ui/components/link";
import { Text } from "@/ui/components/text";
import { View } from "@/ui/components/view";
import { useAuthentication } from "@/features/auth/presentation/hooks/use-authentication";
import { signInSchema } from "@/features/auth/domain/validation/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { SignInCredentials } from "@/features/auth/domain/entities/session";

export default function Index() {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<SignInCredentials>({
    resolver: zodResolver(signInSchema),
    mode: "onBlur",
    defaultValues: {
      email: __DEV__ ? process.env.EXPO_PUBLIC_SUPABASE_EMAIL_LOGIN_DEV! : "",
      password: __DEV__
        ? process.env.EXPO_PUBLIC_SUPABASE_PASSWORD_LOGIN_DEV!
        : "",
    },
  });

  const { isUserLoading, error, signIn } = useAuthentication();
  const onSubmitSignIn = handleSubmit(async (data) => await signIn(data));

  return (
    <View className="flex-1 justify-center gap-2.5 p-2.5">
      <Text variant="subtitle">{t("auth.login.title")}</Text>
      {error && <Text variant="error">{t(error)}</Text>}
      <FormTextField
        control={control}
        name="email"
        placeholder={t("auth.common.email")}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <FormTextField
        control={control}
        name="password"
        placeholder={t("auth.common.password")}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />
      <Button onPress={onSubmitSignIn} isLoading={isUserLoading}>
        {t("auth.login.button")}
      </Button>
      <Link href="/(public)/sign-up" className="text-center">
        {t("auth.login.link")}
      </Link>
    </View>
  );
}
