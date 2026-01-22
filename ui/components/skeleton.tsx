import { Skeleton as HeroUISkeleton } from 'heroui-native';
import { View } from 'react-native';

type SkeletonProps = {
  variant?: 'text' | 'title' | 'avatar' | 'button' | 'input' | 'card';
  className?: string;
};

const VARIANT_CLASSES: Record<NonNullable<SkeletonProps['variant']>, string> = {
  text: 'h-4 w-full rounded-md',
  title: 'h-6 w-3/4 rounded-md',
  avatar: 'h-12 w-12 rounded-full',
  button: 'h-14 w-full rounded-md',
  input: 'h-14 w-full rounded-md',
  card: 'h-32 w-full rounded-lg',
};

export function Skeleton({ variant = 'text', className }: SkeletonProps) {
  return (
    <HeroUISkeleton className={className ?? VARIANT_CLASSES[variant]} />
  );
}

export function SkeletonGroup({ children }: { children: React.ReactNode }) {
  return <View className="gap-3">{children}</View>;
}
