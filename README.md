# Roamly Trip Planner

A polished React trip-planning experience that turns a free-form travel prompt into a structured, interactive itinerary.

## What changed
- Reworked the planner into a visual, mobile-friendly experience with responsive cards, motion, and a guided trip flow.
- Added real backend AI integration with Gemini for structured itinerary generation.
- Hardened the experience for bad AI output with loading, error, retry, and fallback states so the app stays usable even when the model misbehaves.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a local environment file with your Gemini key:
   ```bash
   echo GEMINI_API_KEY=your_key_here > .env
   ```
3. Start the backend and frontend:
   ```bash
   npm run backend
   ```
   In a second terminal:
   ```bash
   npm run dev
   ```
4. Open the Vite URL shown in the terminal.

## AI usage note
- The app sends the user prompt to a backend route that calls Gemini and expects structured trip JSON.
- If the model returns invalid, empty, or malformed data, the app shows a graceful fallback rather than crashing.
- I used AI assistance while building the UI and integration flow, and the app is designed to be understandable and extensible.

## Known limitations
- Gemini availability and network access affect the quality and speed of the AI response.
- The current experience focuses on one strong flow: trip planning with structured JSON and interactive itinerary editing.

## Time spent
- Approx. 6-8 hours of implementation and refinement.
