import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/ui/components/input';

import type { TextInputProps } from 'react-native';

type FormTextFieldProps<T extends FieldValues> = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  secureTextEntry?: boolean;
};

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  secureTextEntry,
  ...props
}: FormTextFieldProps<T>) {
  const { t } = useTranslation();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          {...props}
          label={label}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          errorMessage={error?.message ? t(error.message) : undefined}
        />
      )}
    />
  );
}
