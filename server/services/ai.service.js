import 'dotenv/config';

const TRIP_GENERATION_PROMPT = `You are an expert travel itinerary generation engine. Convert the user's request into a polished, realistic day-by-day itinerary in valid JSON only. Return a JSON object with the shape:
{
  "tripTitle": "string",
  "destination": "string",
  "summary": "string",
  "durationDays": 4,
  "travelers": 2,
  "pace": "relaxed|balanced|packed",
  "estimatedBudget": {
    "currency": "INR",
    "totalEstimatedCost": 18000,
    "perPersonEstimatedCost": 9000
  },
  "days": [
    {
      "day": 1,
      "title": "string",
      "summary": "string",
      "stops": [
        {
          "id": "string",
          "name": "string",
          "category": "attraction|food|activity|shopping|other",
          "startTime": "HH:MM",
          "durationMinutes": 90,
          "description": "string",
          "estimatedCost": 1200,
          "tips": ["string"]
        }
      ]
    }
  ]
}

Requirements:
- Use the user's destination, duration, travelers, pace, and budget total to shape the plan.
- Create a realistic itinerary that matches the budget. If the budget is low, emphasize affordable food, free attractions, and simple transport; if the budget is high, include premium stays, fancy meals, and curated experiences.
- Include 2-4 well-paced stops per day, depending on the pace.
- Keep times realistic and avoid impossible scheduling.
- Make each stop feel destination-specific and practical.
- Include an estimated cost for each stop and a total estimated budget in INR.
- The itinerary should match the requested number of days exactly.
- Keep the response compact but useful. Do not include markdown fences.

User request:
`;

function extractField(prompt, label) {
  if (!prompt || typeof prompt !== 'string') return null;
  const pattern = new RegExp(`${label}:\\s*([^\\n]+)`, 'i');
  const match = prompt.match(pattern);
  return match ? match[1].trim() : null;
}

function extractRequestedDays(prompt) {
  if (!prompt || typeof prompt !== 'string') return null;
  const match = prompt.match(/(?:trip length|duration|for|stay|vacation|holiday).*?(\d{1,2})\s*(?:days?|day)\b/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function extractBudget(prompt) {
  if (!prompt || typeof prompt !== 'string') return null;
  const match = prompt.match(/(?:budget total|budget|total budget)[:\s]*₹?([0-9,]+)/i);
  return match ? Number.parseInt(match[1].replace(/,/g, ''), 10) : null;
}

function extractTravelers(prompt) {
  if (!prompt || typeof prompt !== 'string') return null;
  const match = prompt.match(/travelers?:\s*(\d+)/i);
  return match ? Number.parseInt(match[1], 10) : null;
}

function buildFallbackTrip(userPrompt) {
  const requestedDays = Math.max(1, Math.min(10, extractRequestedDays(userPrompt) || 4));
  const budgetAmount = extractBudget(userPrompt) || 4000;
  const travelers = Math.max(1, extractTravelers(userPrompt) || 2);
  const destination = extractField(userPrompt, 'Destination') || 'your chosen destination';
  const pace = (extractField(userPrompt, 'Preferred pace') || 'balanced').toLowerCase();
  const paceLabel = pace === 'relaxed' ? 'slow and scenic' : pace === 'packed' ? 'high-energy' : 'well-paced';
  const baseCost = Math.max(4000, Math.round(budgetAmount / Math.max(1, travelers)));

  const days = Array.from({ length: requestedDays }, (_, index) => {
    const stopCount = pace === 'packed' ? 3 : pace === 'relaxed' ? 2 : 2;
    const stops = Array.from({ length: stopCount }, (_, stopIndex) => ({
      id: `fallback-d${index + 1}-s${stopIndex + 1}`,
      name: stopIndex === 0 ? 'Signature highlight' : stopIndex === 1 ? 'Local food stop' : 'Flexible evening plan',
      category: stopIndex === 1 ? 'food' : 'activity',
      startTime: ['09:00', '12:30', '17:30'][stopIndex] || '10:00',
      durationMinutes: [120, 90, 120][stopIndex] || 90,
      description: `Spend this part of day ${index + 1} enjoying a practical, locally loved experience in ${destination}.`,
      estimatedCost: Math.round(baseCost / (requestedDays * 3)) + (stopIndex === 1 ? 400 : 0),
      tips: ['Keep a light buffer for transit and weather.'],
    }));

    return {
      day: index + 1,
      title: index === 0 ? `Arrival and local highlights` : `Day ${index + 1} with ${paceLabel} energy`,
      summary: `A ${paceLabel} day built around the best of ${destination} without overloading the schedule.`,
      stops,
    };
  });

  return {
    tripTitle: `${destination} ${requestedDays}-day escape`,
    destination,
    summary: `A ${requestedDays}-day itinerary shaped around your budget, travel style, and pace for ${travelers} travelers.`,
    durationDays: requestedDays,
    travelers,
    pace,
    estimatedBudget: {
      currency: 'INR',
      totalEstimatedCost: Math.max(6000, budgetAmount),
      perPersonEstimatedCost: Math.round(Math.max(6000, budgetAmount) / travelers),
    },
    days,
  };
}

function parseJsonResponse(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const cleaned = raw.replace(/```json|```/gi, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

async function sendGeminiRequest(promptText, apiKey, model) {
  const isBearerToken = apiKey.startsWith('Bearer ') || apiKey.startsWith('ya29.');
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(isBearerToken ? { Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}` } : {}),
  };

  const candidateModels = [model];
  if (!process.env.GEMINI_API_URL && model === 'gemini-3.6-flash') {
    candidateModels.push('gemini-1.0');
  }

  let lastError = null;

  for (const candidateModel of candidateModels) {
    const apiUrl = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta2/models/${candidateModel}:generateText`;
    const requestUrl = isBearerToken ? apiUrl : `${apiUrl}?key=${apiKey}`;

    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        prompt: {
          text: promptText,
        },
      }),
    });

    const responseText = await response.text();

    if (response.ok) {
      return { response, text: responseText, apiUrl, model: candidateModel };
    }

    if (response.status === 404) {
      lastError = { status: response.status, text: responseText, apiUrl, model: candidateModel };
      continue;
    }

    return { response, text: responseText, apiUrl, model: candidateModel };
  }

  return { response: null, text: lastError?.text || 'Unknown error', apiUrl: lastError?.apiUrl, model: lastError?.model, error: lastError };
}

export async function generateTrip(userPrompt) {
  const prompt = typeof userPrompt === 'string' ? userPrompt.trim() : '';

  if (!prompt || prompt.length < 10) {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Please describe your trip idea in a bit more detail.',
      },
    };
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.BUILT_IN_FORGE_API_KEY || '').trim();
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const apiUrl = process.env.GEMINI_API_URL || `https://generativelanguage.googleapis.com/v1beta2/models/${model}:generateText`;

  if (!apiKey) {
    return {
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'Gemini API key is missing. Set GEMINI_API_KEY in your .env file.',
      },
    };
  }

  const isBearerToken = apiKey.startsWith('Bearer ') || apiKey.startsWith('ya29.');
  const requestUrl = isBearerToken ? apiUrl : `${apiUrl}?key=${apiKey}`;
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(isBearerToken ? { Authorization: apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}` } : {}),
  };

  try {
    const sendResult = await sendGeminiRequest(TRIP_GENERATION_PROMPT + prompt, apiKey, model);
    const { response, text: responseText, apiUrl: usedUrl, model: usedModel, error: fallbackError } = sendResult;

    if (!response || !response.ok) {
      const status = response?.status || fallbackError?.status || 500;
      console.error('[AI Service] Gemini error', status, usedUrl, usedModel, responseText);
      const message = responseText || 'Unknown Gemini error';
      return {
        success: false,
        error: {
          code: status === 401 ? 'AUTH_ERROR' : status === 404 ? 'MODEL_NOT_FOUND' : 'AI_SERVICE_ERROR',
          message: `Gemini returned ${status} for model ${usedModel}: ${message}`,
        },
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[AI Service] Invalid JSON response', parseError, responseText);
      return {
        success: false,
        error: {
          code: 'INVALID_JSON',
          message: 'Gemini returned invalid JSON. Please try again later.',
        },
      };
    }
    const aiContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.content?.text || data?.text || '';
    const parsed = parseJsonResponse(aiContent);

    if (!parsed) {
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: 'Gemini returned an unparsable response. Please try again or verify the prompt.',
        },
      };
    }

    const requestedDays = Math.max(1, Math.min(10, extractRequestedDays(prompt) || parsed.durationDays || 4));

    if (!Array.isArray(parsed.days) || parsed.days.length === 0) {
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: 'Gemini returned a valid response but did not include a structured itinerary. Please try again.',
        },
      };
    }

    if (parsed.days.length < requestedDays) {
      return {
        success: false,
        error: {
          code: 'INVALID_RESPONSE',
          message: `Gemini returned ${parsed.days.length} day(s), but ${requestedDays} day(s) were requested. Please retry with a clearer prompt.`,
        },
      };
    }

    const normalizedDays = parsed.days.slice(0, requestedDays).map((day, index) => ({
      ...day,
      day: index + 1,
      stops: Array.isArray(day.stops) ? day.stops.slice(0, 3) : [],
    }));

    return {
      success: true,
      trip: {
        ...parsed,
        durationDays: requestedDays,
        travelers: parsed.travelers || extractTravelers(prompt) || 2,
        pace: parsed.pace || (extractField(prompt, 'Preferred pace') || 'balanced').toLowerCase(),
        estimatedBudget: parsed.estimatedBudget || {
          currency: 'INR',
          totalEstimatedCost: Math.max(6000, extractBudget(prompt) || 4000),
          perPersonEstimatedCost: Math.round(Math.max(6000, extractBudget(prompt) || 4000) / Math.max(1, extractTravelers(prompt) || 2)),
        },
        days: normalizedDays,
      },
    };
  } catch (error) {
    console.error('[AI Service]', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? `Network or server error: ${error.message}` : 'Unknown network error occurred.',
      },
    };
  }
}
