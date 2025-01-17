import { useEffect } from 'react';

import { EffectCallback } from 'react';

export const useEffectOnce = (effect: EffectCallback) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);

  return null;
};
