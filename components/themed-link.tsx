import { useThemeColor } from '@/core/presentation/hooks/use-theme-color';
import { Link, LinkProps } from 'expo-router';

export default function ThemedLink({ children, href, style }: LinkProps) {
  const linkColor = useThemeColor({}, 'link');
  return (
    <Link href={href} style={[{ color: linkColor }, style]}>
      {children}
    </Link>
  );
}
