import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '@/ui/theme/use-theme-colors';

type RadioOption = {
  value: string;
  label: string;
};

type FormRadioGroupProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: RadioOption[];
};

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  options,
}: FormRadioGroupProps<T>) {
  const colors = useThemeColors();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={styles.group} testID="radio-group">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <Pressable
                key={option.value}
                testID={`radio-item-${option.value}`}
                onPress={() => onChange(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                style={[styles.item, { borderColor: colors.border }]}
              >
                <Text style={[styles.label, { color: colors.text }]}>
                  {option.label}
                </Text>
                <View style={[styles.radio, { borderColor: colors.border }]}>
                  {isSelected && (
                    <View style={[styles.radioInner, { backgroundColor: colors.tint }]} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
