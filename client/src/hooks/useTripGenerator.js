import { useCallback, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';

const fallbackTrip = {
  tripTitle: 'Aurora Coast Escape',
  destination: 'Lisbon + Sintra',
  summary:
    'A breezy four-day mix of ocean views, pastel streets, rooftop dinners, and a slow-paced coastal adventure.',
  durationDays: 4,
  travelers: 2,
  pace: 'balanced',
  days: [
    {
      day: 1,
      title: 'Arrival & golden hour views',
      summary: 'Ease into the trip with a scenic tram ride and sunset overlooking the Atlantic.',
      stops: [
        {
          id: 'demo-d1-s1',
          name: 'Belém riverside walk',
          category: 'attraction',
          startTime: '09:00',
          durationMinutes: 120,
          description:
            'Start the morning with a gentle walk by the river, stopping for coffee and architecture photos.',
          tips: ['Bring a light jacket for the breeze.'],
        },
        {
          id: 'demo-d1-s2',
          name: 'Pastéis de Belém tasting',
          category: 'food',
          startTime: '12:30',
          durationMinutes: 60,
          description:
            'Treat yourselves to Lisbon’s signature pastry before a lazy afternoon in the gardens.',
          tips: ['Go early to beat the queue.'],
        },
      ],
    },
    {
      day: 2,
      title: 'Colorful neighborhoods & hidden corners',
      summary: 'Spend the day discovering tiled streets, viewpoints, and local cafés.',
      stops: [
        {
          id: 'demo-d2-s1',
          name: 'Alfama walking loop',
          category: 'activity',
          startTime: '09:30',
          durationMinutes: 180,
          description:
            'Follow the winding alleys and discover little shops, viewpoints, and vintage tram scenes.',
          tips: ['Wear comfortable shoes.'],
        },
        {
          id: 'demo-d2-s2',
          name: 'Sunset rooftop dinner',
          category: 'food',
          startTime: '20:00',
          durationMinutes: 120,
          description:
            'Book a spot with a view and linger over seafood, wine, and the glowing city skyline.',
          tips: ['Reserve ahead if you are visiting on a weekend.'],
        },
      ],
    },
  ],
};

export function useTripGenerator() {
  const [trip, setTrip] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);
  const generateMutation = trpc.trip.generate.useMutation();

  const generateTrip = useCallback(async (prompt) => {
    const currentRequestId = ++requestIdRef.current;

    setStatus('loading');
    setError(null);
    setTrip(null);

    try {
      const result = await generateMutation.mutateAsync({ prompt });

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (result?.success && result.trip) {
        setTrip(result.trip);
        setStatus('success');
        return;
      }

      const message = result?.error?.message || 'We could not build a reliable itinerary.';
      const shouldUseFallback = ['SERVER_ERROR', 'API_ERROR', 'NETWORK_ERROR', 'INVALID_JSON', 'INVALID_SCHEMA'].includes(result?.error?.code);

      if (shouldUseFallback) {
        setTrip(fallbackTrip);
        setStatus('success');
        setError(`${message} A polished demo itinerary is loaded so you can still explore the experience.`);
        return;
      }

      setError(message);
      setStatus('error');
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setTrip(fallbackTrip);
      setStatus('success');
      setError(
        err instanceof Error
          ? `${err.message} A polished demo itinerary is loaded so you can still explore the experience.`
          : 'The AI service is unavailable right now. A polished demo itinerary is loaded instead.'
      );
    }
  }, [generateMutation]);

  const cancelGeneration = useCallback(() => {
    requestIdRef.current += 1;
    setStatus('cancelled');
    setError('Generation was cancelled.');
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setTrip(null);
    setStatus('idle');
    setError(null);
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
