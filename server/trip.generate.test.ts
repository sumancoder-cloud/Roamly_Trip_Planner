import { describe, it, expect } from 'vitest';
import { TripSchema, StopSchema, TripDaySchema } from './schemas/trip.schema';

describe('Trip Schema Validation', () => {
  const validStop = {
    id: '1',
    name: 'Baga Beach',
    category: 'attraction' as const,
    startTime: '14:00',
    durationMinutes: 120,
    description: 'Beautiful beach',
    tips: ['Bring sunscreen'],
  };

  const validDay = {
    day: 1,
    title: 'Day 1',
    summary: 'First day',
    stops: [validStop],
  };

  const validTrip = {
    tripTitle: 'Goa Trip',
    destination: 'Goa, India',
    summary: 'A relaxing trip',
    durationDays: 3,
    travelers: 2,
    pace: 'balanced' as const,
    days: [validDay],
  };

  it('should validate a correct stop', () => {
    const result = StopSchema.safeParse(validStop);
    expect(result.success).toBe(true);
  });

  it('should validate a correct day', () => {
    const result = TripDaySchema.safeParse(validDay);
    expect(result.success).toBe(true);
  });

  it('should validate a correct trip', () => {
    const result = TripSchema.safeParse(validTrip);
    expect(result.success).toBe(true);
  });

  it('should reject stop with missing name', () => {
    const invalid = { ...validStop, name: '' };
    const result = StopSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject stop with invalid category', () => {
    const invalid = { ...validStop, category: 'invalid' };
    const result = StopSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject stop with invalid time format', () => {
    const invalid = { ...validStop, startTime: 'invalid' };
    const result = StopSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject stop with zero duration', () => {
    const invalid = { ...validStop, durationMinutes: 0 };
    const result = StopSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept day with at least one stop', () => {
    const valid = { ...validDay, stops: [validStop] };
    const result = TripDaySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('should reject trip with invalid pace', () => {
    const invalid = { ...validTrip, pace: 'invalid' };
    const result = TripSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject trip with no days', () => {
    const invalid = { ...validTrip, days: [] };
    const result = TripSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject trip with missing destination', () => {
    const invalid = { ...validTrip, destination: '' };
    const result = TripSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should accept trip with optional travelers', () => {
    const trip = { ...validTrip };
    delete (trip as any).travelers;
    const result = TripSchema.safeParse(trip);
    expect(result.success).toBe(true);
  });

  it('should accept stop with optional tips', () => {
    const stop = { ...validStop };
    delete (stop as any).tips;
    const result = StopSchema.safeParse(stop);
    expect(result.success).toBe(true);
  });

  it('should handle multi-day trip', () => {
    const trip = {
      ...validTrip,
      durationDays: 3,
      days: [
        validDay,
        { ...validDay, day: 2, title: 'Day 2' },
        { ...validDay, day: 3, title: 'Day 3' },
      ],
    };
    const result = TripSchema.safeParse(trip);
    expect(result.success).toBe(true);
  });
});
