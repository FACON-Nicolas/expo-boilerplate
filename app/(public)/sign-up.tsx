import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { signUpSchema } from "@/features/auth/domain/validation/auth-schema";
import { useAuthentication } from "@/features/auth/presentation/hooks/use-authentication";
import { Button } from "@/ui/components/button";
import { FormTextField } from "@/ui/components/form/form-text-field";
import { Link } from "@/ui/components/link";
import { Text } from "@/ui/components/text";
import { View } from "@/ui/components/view";


import type { SignUpCredentials } from "@/features/auth/domain/entities/session";

export default function SignUp() {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<SignUpCredentials>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { isUserLoading, error, signUp } = useAuthentication();
  const onSubmitSignUp = handleSubmit(async (data) => await signUp(data));

  return (
    <View className="flex-1 justify-center gap-2.5 p-2.5">
      <Text variant="subtitle">{t("auth.signUp.title")}</Text>
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
      <FormTextField
        control={control}
        name="passwordConfirmation"
        placeholder={t("auth.signUp.passwordConfirmation")}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />
      <Button onPress={onSubmitSignUp} isLoading={isUserLoading}>
        {t("auth.signUp.button")}
      </Button>
      <Link href="/(public)" className="text-center">
        {t("auth.signUp.link")}
      </Link>
    </View>
  );
}
