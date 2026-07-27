import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import { generateTrip, refineTrip } from '../services/ai.service.js';
import { validateGenerateRequest, validateRefineRequest } from '../schemas/trip.schema.js';

export const tripRouter = router({
  /**
   * Generate a new trip itinerary from user description
   * POST /api/trpc/trip.generate
   */
  generate: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(10, 'Trip description must be at least 10 characters'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validate input
        const validation = validateGenerateRequest({ prompt: input.prompt });
        if (!validation.success) {
          const firstIssue = validation.error.issues[0];
          return {
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: firstIssue?.message || 'Invalid input',
            },
          };
        }

        // Generate trip using AI service
        const result = await generateTrip(input.prompt);

        return result;
      } catch (error) {
        console.error('[Trip Router] Generate error:', error);
        return {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to generate itinerary. Please try again.',
          },
        };
      }
    }),

  /**
   * Refine an existing trip with user instructions
   * POST /api/trpc/trip.refine
   */
  refine: publicProcedure
    .input(
      z.object({
        trip: z.object({
          tripTitle: z.string(),
          destination: z.string(),
          summary: z.string(),
          durationDays: z.number(),
          travelers: z.number().optional(),
          pace: z.enum(['relaxed', 'balanced', 'packed']),
          days: z.array(z.any()),
        }),
        instruction: z.string().min(5, 'Instruction must be at least 5 characters'),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Validate input
        const validation = validateRefineRequest({
          trip: input.trip,
          instruction: input.instruction,
        });

        if (!validation.success) {
          const firstIssue = validation.error.issues[0];
          return {
            success: false,
            error: {
              code: 'INVALID_INPUT',
              message: firstIssue?.message || 'Invalid input',
            },
          };
        }

        // Refine trip using AI service
        const result = await refineTrip(input.trip, input.instruction);

        return result;
      } catch (error) {
        console.error('[Trip Router] Refine error:', error);
        return {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Failed to refine itinerary. Please try again.',
          },
        };
      }
    }),
});

export type TripRouter = typeof tripRouter;
