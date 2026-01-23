import { RadioGroup } from "heroui-native";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

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
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <RadioGroup value={value ?? ""} onValueChange={onChange} className="gap-3">
          {options.map((option) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              className="flex-row-reverse justify-between p-4 border border-border rounded-lg"
            >
              <RadioGroup.Indicator />
              <RadioGroup.Label className="text-base">{option.label}</RadioGroup.Label>
            </RadioGroup.Item>
          ))}
        </RadioGroup>
      )}
    />
  );
}
