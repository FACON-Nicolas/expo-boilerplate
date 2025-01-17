import { useThemeColor } from '@/hooks/useThemeColor';
import { Link, LinkProps } from 'expo-router';

export default function ThemedLink({ children, href, style }: LinkProps) {
  const linkColor = useThemeColor({}, 'link');
  return (
    <Link href={href} style={[{ color: linkColor }, style]}>
      {children}
    </Link>
  );
}
