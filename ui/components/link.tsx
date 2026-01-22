import { Link as ExpoLink, type LinkProps as ExpoLinkProps } from 'expo-router';
import { twMerge } from 'tailwind-merge';

type LinkProps = ExpoLinkProps & {
  className?: string;
};

export function Link({ className, ...props }: LinkProps) {
  return (
    <ExpoLink
      className={twMerge('text-base text-link', className)}
      {...props}
    />
  );
}
