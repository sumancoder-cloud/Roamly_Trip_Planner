import { z } from 'zod';

/**
 * Stop schema - represents a single activity/location in an itinerary
 */
export const StopSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['attraction', 'food', 'activity', 'shopping', 'other']),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  durationMinutes: z.number().int().positive(),
  description: z.string().min(1),
  tips: z.array(z.string()).optional(),
});

/**
 * Trip day schema - represents a single day in the itinerary
 */
export const TripDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  summary: z.string().min(1),
  stops: z.array(StopSchema).min(1),
});

/**
 * Full trip schema - represents the complete itinerary
 */
export const TripSchema = z.object({
  tripTitle: z.string().min(1),
  destination: z.string().min(1),
  summary: z.string().min(1),
  durationDays: z.number().int().positive(),
  travelers: z.number().int().positive().optional(),
  pace: z.enum(['relaxed', 'balanced', 'packed']),
  days: z.array(TripDaySchema).min(1),
});

/**
 * Generate trip request schema
 */
export const GenerateTripRequestSchema = z.object({
  prompt: z.string().min(10).max(2000),
});

/**
 * Refine trip request schema
 */
export const RefineTripRequestSchema = z.object({
  trip: TripSchema,
  instruction: z.string().min(5).max(500),
});

export type Stop = z.infer<typeof StopSchema>;
export type TripDay = z.infer<typeof TripDaySchema>;
export type Trip = z.infer<typeof TripSchema>;

export const validateTrip = (data: unknown) => {
  return TripSchema.safeParse(data);
};

export const validateGenerateRequest = (data: unknown) => {
  return GenerateTripRequestSchema.safeParse(data);
};

export const validateRefineRequest = (data: unknown) => {
  return RefineTripRequestSchema.safeParse(data);
};
