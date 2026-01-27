import { useCallback, useState } from 'react';

export function useToggle(initialValue: boolean) {
  const [value, setValue] = useState<boolean>(initialValue);
  const toggle = useCallback(() => setValue((prev) => !prev), []);
  return [value, toggle] as const;
}
