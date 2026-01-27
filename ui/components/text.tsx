import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { tv, type VariantProps } from 'tailwind-variants';

const textVariants = tv({
  base: 'text-text',
  variants: {
    variant: {
      default: 'text-base leading-relaxed',
      title: 'text-xl font-bold leading-tight',
      subtitle: 'text-lg font-bold',
      semibold: 'text-base font-semibold leading-relaxed',
      link: 'text-base text-link leading-relaxed',
      error: 'text-sm text-error',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type TextVariants = VariantProps<typeof textVariants>;

type TextProps = RNTextProps &
  TextVariants & {
    maxFontSizeMultiplier?: number;
  };

const DEFAULT_MAX_FONT_SIZE_MULTIPLIER = 1.5;

export function Text({
  variant,
  className,
  maxFontSizeMultiplier = DEFAULT_MAX_FONT_SIZE_MULTIPLIER,
  ...props
}: TextProps) {
  return (
    <RNText
      className={textVariants({ variant, className })}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...props}
    />
  );
}
