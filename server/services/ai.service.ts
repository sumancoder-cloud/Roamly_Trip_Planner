import { validateTrip } from '../schemas/trip.schema.js';
import type { Trip } from '../schemas/trip.schema.js';

/**
 * AI Service - handles LLM calls and response processing
 */

const TRIP_GENERATION_PROMPT = `You are an expert travel itinerary generation engine. Your task is to convert the user's travel request into a structured, realistic day-by-day itinerary.

IMPORTANT: You MUST respond with ONLY valid JSON, no markdown, no code blocks, no explanations.

The JSON must match this exact schema:
{
  "tripTitle": "string - creative title for the trip",
  "destination": "string - primary destination",
  "summary": "string - 1-2 sentence overview",
  "durationDays": number,
  "travelers": number (optional),
  "pace": "relaxed" | "balanced" | "packed",
  "days": [
    {
      "day": number,
      "title": "string - day theme/focus",
      "summary": "string - brief day overview",
      "stops": [
        {
          "id": "string - unique identifier like 'd1-s1'",
          "name": "string - activity/location name",
          "category": "attraction" | "food" | "activity" | "shopping" | "other",
          "startTime": "string - HH:MM format",
          "durationMinutes": number,
          "description": "string - detailed description",
          "tips": ["string - helpful tips"] (optional)
        }
      ]
    }
  ]
}

Requirements:
- Create realistic, logically sequenced daily plans
- Group activities by location and travel time
- Avoid impossible scheduling (e.g., 5 activities in 2 hours)
- Include meaningful descriptions (2-3 sentences per stop)
- Respect the user's requested trip duration
- Vary activities to balance culture, food, relaxation, and adventure
- Times should be realistic (e.g., museums open 9-10am, lunch 12-2pm, dinner 7-9pm)
- Include at least 3-5 stops per day depending on pace
- For "relaxed" pace: 3-4 stops, longer durations, more downtime
- For "balanced" pace: 4-5 stops, mix of activities and rest
- For "packed" pace: 5-6 stops, minimal downtime, efficient routing

User's request:
`;

interface AIResponse {
  success: boolean;
  trip?: Trip;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * Generate trip itinerary using LLM
 */
export async function generateTrip(userPrompt: string, signal?: AbortSignal): Promise<AIResponse> {
  try {
    // Validate input
    if (!userPrompt || typeof userPrompt !== 'string') {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Trip description is required and must be a string',
        },
      };
    }

    if (userPrompt.trim().length < 10) {
      return {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Trip description must be at least 10 characters',
        },
      };
    }

    // Get LLM API from environment
    const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
    const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

    if (!apiUrl || !apiKey) {
      console.error('[AI Service] Missing LLM configuration');
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'AI service is not properly configured',
        },
      };
    }

    // Construct the full prompt
    const fullPrompt = TRIP_GENERATION_PROMPT + userPrompt;

    // Call the LLM
    const response = await fetch(`${apiUrl}/llm/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        messages: [
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        temperature: 0.7,
        maxTokens: 4000,
      }),
      signal,
    });

    if (!response.ok) {
      const status = response.status;
      
      if (status === 429) {
        return {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'We\'re receiving too many requests. Please wait a moment and try again.',
          },
        };
      }

      if (status >= 500) {
        return {
          success: false,
          error: {
            code: 'SERVICE_ERROR',
            message: `AI service error (${status}). Please try again later.`,
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'API_ERROR',
          message: 'Failed to generate itinerary. Please try again.',
        },
      };
    }

    const data = await response.json();

    // Extract the content from the response
    let aiResponse = data.content || data.text || '';

    if (!aiResponse) {
      return {
        success: false,
        error: {
          code: 'EMPTY_RESPONSE',
          message: 'The AI service returned an empty response. Please try again.',
        },
      };
    }

    // Parse the JSON response
    let tripData: unknown;
    try {
      // Remove markdown code blocks if present
      aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      tripData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('[AI Service] JSON parse error:', parseError instanceof Error ? parseError.message : String(parseError));
      return {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'The generated response wasn\'t valid JSON. Please try again.',
        },
      };
    }

    // Validate against schema
    const validation = validateTrip(tripData);

    if (!validation.success) {
      console.error('[AI Service] Validation error:', validation.error.issues);
      return {
        success: false,
        error: {
          code: 'INVALID_SCHEMA',
          message: 'The generated itinerary doesn\'t match the expected format. Please try again.',
        },
      };
    }

    // Return validated trip
    return {
      success: true,
      trip: validation.data,
    };
  } catch (error) {
    // Handle abort signal
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: {
          code: 'CANCELLED',
          message: 'Trip generation was cancelled.',
        },
      };
    }

    // Handle network errors
    if (error instanceof Error && (error.message.includes('fetch') || error.message.includes('network'))) {
      console.error('[AI Service] Network error:', error.message);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Couldn\'t reach the trip generator. Check your connection and try again.',
        },
      };
    }

    console.error('[AI Service] Unexpected error:', error);
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
    };
  }
}

/**
 * Refine an existing trip with user instructions
 */
export async function refineTrip(trip: Trip, instruction: string, signal?: AbortSignal): Promise<AIResponse> {
  const refinementPrompt = `You are a travel itinerary refinement engine. The user has an existing itinerary and wants to modify it.

Current itinerary:
${JSON.stringify(trip, null, 2)}

User's refinement request:
${instruction}

Please update the itinerary according to the user's request. Maintain the same JSON schema and return ONLY valid JSON with no markdown or explanations.`;

  return generateTrip(refinementPrompt, signal);
}
