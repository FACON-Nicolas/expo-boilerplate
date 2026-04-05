export const Colors = {
  light: {
    primary: '#050607',
    text: '#11181C',
    background: '#ffffff',
    tint: '#0a7ea4',
    icon: '#687076',
    border: '#687076',
    placeholder: '#9BA1A6',
    link: '#0a7ea4',
    error: '#ff0000',
    inputBackground: '#FAF9F8',
  },
  dark: {
    primary: '#faf9f8',
    text: '#ECEDEE',
    background: '#050607',
    tint: '#ffffff',
    icon: '#9BA1A6',
    border: '#9BA1A6',
    placeholder: '#687076',
    link: '#0a7ea4',
    error: '#ff0000',
    inputBackground: '#0A0B0C',
  },
} as const;

export type ColorTheme = typeof Colors.light;
