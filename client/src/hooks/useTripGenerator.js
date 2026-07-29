import { useCallback, useRef, useState } from 'react';

const SESSION_STORAGE_KEY = 'roamly-trip-session';

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

  const generateTrip = useCallback(async (prompt) => {
    const currentRequestId = ++requestIdRef.current;

    setStatus('loading');
    setError(null);
    setTrip(null);

    try {
      const response = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      if (result?.success && result.trip) {
        setTrip(result.trip);
        setStatus('success');
        return;
      }

      const message = result?.error?.message || 'We could not build a reliable itinerary.';
      setTrip(null);
      setStatus('error');
      setError(message);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) {
        return;
      }

      setTrip(null);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'The AI service is unavailable right now.');
    }
  }, []);

  const restoreTrip = useCallback((savedTrip) => {
    setTrip(savedTrip);
    setStatus('success');
    setError(null);
  }, []);

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
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  return {
    trip,
    status,
    error,
    generateTrip,
    restoreTrip,
    cancelGeneration,
    reset,
  };
}
