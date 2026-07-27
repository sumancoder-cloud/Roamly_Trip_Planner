# Roamly — AI Trip Planner Project TODO

## Phase 1: Project Setup & Configuration
- [x] Initialize web-db-user project scaffold
- [x] Install required dependencies: framer-motion, lucide-react, dnd-kit, zod
- [x] Configure Tailwind CSS with custom color palette (cream, forest green, terracotta)
- [x] Set up LLM integration (Gemini or Groq)
- [x] Create todo.md tracking file

## Phase 2: Backend Development
- [x] Create trip.schema.ts with Zod validation for Trip, TripDay, Stop objects
- [x] Create trip.types.ts with TypeScript interfaces
- [x] Create ai.service.ts for LLM prompt construction and response handling
- [x] Create trip.routes.ts with POST /api/trips/generate endpoint
- [x] Implement request validation (input prompt length, format)
- [x] Implement LLM response parsing and Zod validation
- [x] Implement error handling: malformed JSON, wrong shape, empty output, network errors
- [x] Implement HTTP error handling: 429, 500, 502, 503
- [x] Add AbortController support for request cancellation
- [x] Write vitest tests for trip generation pipeline
- [x] Write vitest tests for Zod schema validation
- [x] Write vitest tests for error handling scenarios

## Phase 3: Landing Page
- [x] Create Navbar component with transparent initial state and blur effect on scroll
- [x] Create Hero section with animated heading (Framer Motion fade + upward)
- [x] Create Hero input area with CTA button
- [ ] Create "Get Inspired" section with destination cards (Goa, Tokyo, Bali)
- [x] Create "How It Works" section with 3-step process cards (animated entrance)
- [x] Create Feature showcase section (6-7 key capabilities)
- [x] Implement smooth scroll animations for all sections
- [ ] Implement responsive design (375px, 768px, 1024px+)
- [x] Add React Icons throughout (no emojis)
- [x] Implement mobile hamburger menu in navbar
- [ ] Test animations and scroll behavior

## Phase 4: Authentication Pages
- [ ] Create Login page layout
- [ ] Implement Google OAuth button with proper styling
- [ ] Implement Facebook OAuth button with proper styling
- [ ] Create Register/Signup page (if needed)
- [ ] Wire up Manus OAuth flow for both providers
- [ ] Add loading states during authentication
- [ ] Add error handling for auth failures
- [ ] Test OAuth flow end-to-end

## Phase 5: Trip Planner Page
- [ ] Create TripPlanner component with form layout
- [ ] Implement textarea input for trip description
- [ ] Add optional structured controls (travel pace radio buttons)
- [ ] Create "Try" quick-start suggestion buttons
- [ ] Implement form validation (non-empty input)
- [ ] Create LoadingTrip component with animated progress stages
- [ ] Implement AbortController for cancel button
- [ ] Implement request ID tracking for stale response protection
- [ ] Add loading state UI with skeleton/spinner
- [ ] Wire up form submission to /api/trips/generate endpoint
- [ ] Handle successful response and navigate to itinerary view
- [ ] Test form submission and loading states

## Phase 6: Itinerary Display & Interaction
- [ ] Create TripHeader component (destination, summary, duration, travelers, pace)
- [ ] Create DayCard component for each day
- [ ] Create StopCard component with collapsed/expanded states
- [ ] Create TripTimeline component with vertical timeline layout
- [ ] Implement expand/collapse animation (Framer Motion)
- [ ] Implement stop removal with undo toast (Sonner)
- [ ] Implement dnd-kit drag-and-drop for stop reordering
- [ ] Add visual feedback during drag operations
- [ ] Implement stop details expansion (description, tips, duration)
- [ ] Create RefineTrip component for optional refinement input
- [ ] Add "Remove Stop" menu item with confirmation
- [ ] Test all interactions and animations

## Phase 7: Error Handling & Edge Cases
- [ ] Create ErrorState component for API errors
- [ ] Create EmptyState component for pre-generation state
- [ ] Create ErrorBoundary for rendering errors
- [ ] Implement malformed JSON error handling
- [ ] Implement Zod validation error handling
- [ ] Implement empty AI output error handling
- [ ] Implement network failure error handling
- [ ] Implement 429 (rate limit) error handling
- [ ] Implement 500/502/503 error handling
- [ ] Add retry buttons to all error states
- [ ] Implement stale response protection (AbortController + request ID)
- [ ] Test all error scenarios manually
- [ ] Write vitest tests for error handling

## Phase 8: Polish & Optimization
- [ ] Review and refine color palette (cream #F7F4ED, forest #16332B, terracotta #E56B3F)
- [ ] Ensure all text is readable against backgrounds
- [ ] Add backdrop blur effects to navbar and modals
- [ ] Verify responsive design at all breakpoints
- [ ] Test animations on mobile devices
- [ ] Optimize images and assets
- [ ] Add accessibility features (ARIA labels, focus states, keyboard navigation)
- [ ] Verify tab navigation works throughout app
- [ ] Test with screen readers
- [ ] Performance audit and optimization
- [ ] Cross-browser testing
- [ ] Create checkpoint and prepare for deployment

## Phase 9: Testing & Delivery
- [ ] Run full vitest suite
- [ ] Manual end-to-end testing (auth → planner → itinerary → interactions)
- [ ] Test error scenarios manually
- [ ] Verify responsive design on real devices
- [ ] Test OAuth flow with real Google/Facebook accounts
- [ ] Verify animations are smooth on all devices
- [ ] Check for console errors and warnings
- [ ] Final visual review
- [ ] Create final checkpoint
- [ ] Prepare project for user delivery
