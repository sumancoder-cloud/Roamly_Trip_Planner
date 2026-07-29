import { useMemo } from 'react';

export function useComposition(items = []) {
  return useMemo(() => items.filter(Boolean), [items]);
}
