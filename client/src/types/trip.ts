export interface Stop {
  id: string;
  name: string;
  category: 'attraction' | 'food' | 'activity' | 'shopping' | 'other';
  startTime: string;
  durationMinutes: number;
  description: string;
  tips?: string[];
}

export interface TripDay {
  day: number;
  title: string;
  summary: string;
  stops: Stop[];
}

export interface Trip {
  tripTitle: string;
  destination: string;
  summary: string;
  durationDays: number;
  travelers?: number;
  pace: 'relaxed' | 'balanced' | 'packed';
  days: TripDay[];
}

export interface GenerateTripResponse {
  success: boolean;
  trip?: Trip;
  error?: {
    code: string;
    message: string;
  };
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error' | 'cancelled';
