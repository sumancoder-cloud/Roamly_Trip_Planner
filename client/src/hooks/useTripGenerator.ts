import { useCallback, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import type { Trip, GenerationStatus } from '@/types/trip';

interface UseTripGeneratorReturn {
  trip: Trip | null;
  status: GenerationStatus;
  error: string | null;
  generateTrip: (prompt: string) => Promise<void>;
  cancelGeneration: () => void;
  reset: () => void;
}

export function useTripGenerator(): UseTripGeneratorReturn {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const generateMutation = trpc.trip.generate.useMutation();

  const generateTrip = useCallback(
    async (prompt: string) => {
      try {
        // Increment request ID for stale response protection
        const currentRequestId = ++requestIdRef.current;

        // Cancel previous request if any
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Reset state
        setStatus('loading');
        setError(null);
        setTrip(null);

        // Call mutation
        const result = await generateMutation.mutateAsync({ prompt });

        // Check if this is still the latest request
        if (currentRequestId !== requestIdRef.current) {
          return;
        }

        if (result.success && result.trip) {
          setTrip(result.trip);
          setStatus('success');
        } else {
          setError(result.error?.message || 'Failed to generate itinerary');
          setStatus('error');
        }
      } catch (err) {
        // Check if this is still the latest request
        if (requestIdRef.current !== (requestIdRef.current)) {
          return;
        }

        if (err instanceof Error && err.name === 'AbortError') {
          setStatus('cancelled');
          setError('Generation was cancelled');
        } else {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
          setStatus('error');
        }
      }
    },
    [generateMutation]
  );

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setStatus('cancelled');
      setError('Generation was cancelled');
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setTrip(null);
    setStatus('idle');
    setError(null);
    requestIdRef.current = 0;
  }, []);

  return {
    trip,
    status,
    error,
    generateTrip,
    cancelGeneration,
    reset,
  };
}
