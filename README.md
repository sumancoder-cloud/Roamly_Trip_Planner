# Roamly Trip Planner

A polished React trip-planning experience that turns a free-form travel prompt into a structured, interactive itinerary.

## What changed
- Reworked the planner into a more visual, mobile-friendly experience with vibrant gradients and motion.
- Added stronger AI failure handling so malformed or empty responses no longer break the flow.
- Kept the itinerary interactive with expandable stops, drag-and-drop reordering, and a day-by-day overview.

## Run locally
1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Start the app:
   ```bash
   npm run dev
   ```
3. Open the local Vite URL shown in the terminal.

## AI usage note
- The app sends the user prompt to a backend AI service and expects structured trip JSON.
- If the model returns invalid or empty data, the app shows a graceful fallback and retry path instead of crashing.

## Known limitations
- The AI response depends on the configured backend service and network access.
- The current experience focuses on the trip planner flow rather than a full multi-feature travel dashboard.

## Time spent
- Approx. 4-5 hours of implementation and refinement.
