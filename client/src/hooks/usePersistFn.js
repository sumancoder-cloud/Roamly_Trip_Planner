import { useCallback, useRef } from 'react';

export function usePersistFn(fn) {
  const ref = useRef(fn);
  ref.current = fn;

  return useCallback((...args) => ref.current(...args), []);
}
