import { FiArrowLeft, FiCompass, FiDollarSign, FiMap, FiMapPin, FiMoon, FiRotateCcw, FiSend, FiStar, FiSun, FiUser, FiUsers } from "react-icons/fi";
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTripGenerator } from '@/hooks/useTripGenerator';
import TripDisplay from '@/components/TripDisplay';
import { useAuth } from '@/_core/hooks/useAuth.jsx';
import { useTheme } from '@/contexts/ThemeContext';

const SESSION_STORAGE_KEY = 'roamly-trip-session';

const suggestions = [
  'Weekend in Goa with friends',
  'Japan food trip for 7 days',
  'Bali honeymoon adventure',
  '4 days in Paris with cafés and museums',
];

const paceOptions = [
  { value: 'relaxed', label: 'Relaxed', detail: 'Slow mornings and long evenings' },
  { value: 'balanced', label: 'Balanced', detail: 'A smooth mix of highlights and downtime' },
  { value: 'packed', label: 'Packed', detail: 'Max energy, every hour counts' },
];

export default function Planner() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [destination, setDestination] = useState('');
  const [pace, setPace] = useState('balanced');
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [budgetTier, setBudgetTier] = useState('Mid-range');
  const [budgetAmount, setBudgetAmount] = useState(4000);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const { user, saveTrip } = useAuth();
  const { trip, status, error, generateTrip, restoreTrip, cancelGeneration, reset } = useTripGenerator();

  const isBusy = status === 'loading';
  const showError = status === 'error' && error;
  const isDark = theme === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed?.prompt) setPrompt(parsed.prompt);

      const isDemoFallback = parsed?.trip?.tripTitle === 'Aurora Coast Escape' || parsed?.trip?.destination === 'Lisbon + Sintra';
      if (parsed?.trip && !isDemoFallback) {
        restoreTrip(parsed.trip);
        setHasSavedSession(true);
        return;
      }

      if (isDemoFallback) {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore invalid saved sessions
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [restoreTrip]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (status === 'success' && trip) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ prompt, trip, savedAt: Date.now() }));
      return;
    }
    if (status === 'idle' || status === 'cancelled') {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [prompt, trip, status]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Describe your dream trip first');
      return;
    }

    const fullPrompt = `${prompt}\n\nDestination: ${destination || 'Flexible destination'}\nTravelers: ${travelers}\nPreferred pace: ${pace}\nTrip length: ${days} days\nBudget total: ₹${budgetAmount} for ${travelers} travelers\nBudget vibe: ${budgetTier}\nTraveler: ${user?.name || 'guest'}`;
    await generateTrip(fullPrompt);
  };

  const handleSuggestion = (value) => {
    setPrompt(value);
  };

  if (status === 'success' && trip) {
    const handleContinue = (updatedTrip) => {
      if (user) {
        saveTrip(updatedTrip || trip);
      }
      reset();
    };

    return <TripDisplay trip={trip} onEdit={handleContinue} />;
  }

  return (
    <div className={isDark ? 'min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8' : 'min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.2),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#1f2937_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8'}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <motion.button
            onClick={() => setLocation('/')}
            className={isDark ? 'flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur' : 'flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur'}
            whileHover={{ x: -4, scale: 1.02 }}
          >
          <FiArrowLeft className="h-4 w-4" />
          Back home
          </motion.button>
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={isDark ? 'flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-100' : 'flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700'}
          >
            {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        {hasSavedSession ? (
          <div className={isDark ? 'rounded-[1rem] border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200' : 'rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'}>
            Recovered your last saved itinerary draft.
          </div>
        ) : null}

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
        >
          <div className="grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                <FiStar className="h-4 w-4" />
                AI trip studio
              </div>
              <div>
                <h1 className="text-3xl font-semibold sm:text-4xl">Turn your travel idea into a vivid itinerary.</h1>
                <p className="mt-3 max-w-2xl text-lg text-slate-300">
                  Paste a quick description, pick a rhythm, and let the app turn it into a structured, interactive journey you can edit and reorder.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Reliability</div>
                  <div className="mt-1 font-semibold text-white">Smart fallback + retry handling</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Experience</div>
                  <div className="mt-1 font-semibold text-white">Motion-rich and mobile friendly</div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/20 via-cyan-500/20 to-emerald-400/20 p-5">
              <div className="flex items-center gap-2 text-sm text-white/90">
                <FiCompass className="h-4 w-4" />
                Quick inspirations
              </div>
              <div className="mt-4 space-y-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSuggestion(item)}
                    className="flex w-full items-start gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-950/80"
                  >
                    <FiMapPin className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 backdrop-blur-xl"
          >
            <div className="mb-5 flex items-center gap-3 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-3">
              <div className="rounded-full bg-slate-950/50 p-2"><FiUser className="h-5 w-5 text-cyan-300" /></div>
              <div>
                <div className="text-sm font-semibold text-white">Traveler profile</div>
                <div className="text-xs text-slate-300">{user?.name || 'Guest traveler'} • {days} days • ₹{budgetAmount} • {travelers} travelers</div>
              </div>
            </div>
            {isBusy ? (
              <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  className="mb-4 rounded-full border border-cyan-300/30 p-4"
                >
                  <FiStar className="h-8 w-8 text-emerald-300" />
                </motion.div>
                <h2 className="text-xl font-semibold">Building your itinerary</h2>
                <p className="mt-2 max-w-md text-sm text-slate-300">
                  We are shaping your stops, pacing the days, and keeping the plan resilient even if the AI response is imperfect.
                </p>
                <Button onClick={cancelGeneration} variant="outline" className="mt-6 border-white/15 bg-white/10">
                  Cancel generation
                </Button>
              </div>
            ) : showError ? (
              <div className="rounded-[1.25rem] border border-rose-400/20 bg-rose-400/10 p-8 text-center">
                <h2 className="text-xl font-semibold text-white">That draft missed the mark</h2>
                <p className="mt-2 text-sm text-slate-300">{error}</p>
                {(error?.includes('AUTH_ERROR') || error?.includes('401') || error?.includes('MISSING_API_KEY')) && (
                  <p className="mt-4 text-sm text-slate-200">
                    Check your <code className="rounded bg-slate-950/50 px-1 py-0.5 text-xs">GEMINI_API_KEY</code> in <code className="rounded bg-slate-950/50 px-1 py-0.5 text-xs">.env</code>, and make sure the Generative Language API is enabled.
                  </p>
                )}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={handleGenerate} className="bg-white text-slate-950">
                    Try again
                  </Button>
                  <Button onClick={reset} variant="outline" className="border-white/15 bg-white/10">
                    Start fresh
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Describe your trip</Label>
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Example: Plan a 4-day romantic getaway to Goa with beaches, cafés, nightlife and a calm budget for 2 people."
                    className="min-h-40 w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-4 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Where to go</Label>
                    <div className="flex items-center gap-2 rounded-[1rem] border border-white/10 bg-slate-950/70 px-3 py-3">
                      <FiMapPin className="h-4 w-4 text-emerald-300" />
                      <input value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="Goa, Bali, Paris..." className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Budget</Label>
                    <div className="flex items-center gap-2 rounded-[1rem] border border-white/10 bg-slate-950/70 px-3 py-3">
                      <FiDollarSign className="h-4 w-4 text-emerald-300" />
                      <input type="number" min="1000" step="500" value={budgetAmount} onChange={(event) => setBudgetAmount(Number(event.target.value) || 1000)} className="w-full bg-transparent text-sm text-slate-100 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Trip length</Label>
                    <div className="flex flex-wrap gap-2">
                      {[2, 3, 4, 5, 7].map((value) => (
                        <button key={value} onClick={() => setDays(value)} className={`rounded-full px-3 py-2 text-sm ${days === value ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300'}`}>
                          {value} days
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 rounded-[1rem] border border-white/10 bg-slate-950/70 px-3 py-3">
                      <FiCompass className="h-4 w-4 text-emerald-300" />
                      <input type="number" min="1" max="14" value={days} onChange={(event) => setDays(Number(event.target.value) || 1)} className="w-full bg-transparent text-sm text-slate-100 outline-none" />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Travelers</Label>
                    <div className="flex items-center gap-2 rounded-[1rem] border border-white/10 bg-slate-950/70 px-3 py-3">
                      <FiUsers className="h-4 w-4 text-emerald-300" />
                      <input type="number" min="1" max="6" value={travelers} onChange={(event) => setTravelers(Number(event.target.value) || 1)} className="w-full bg-transparent text-sm text-slate-100 outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Budget style</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Budget', amount: 1800 },
                      { label: 'Mid-range', amount: 4000 },
                      { label: 'Comfort', amount: 7000 },
                    ].map((option) => (
                      <button key={option.label} onClick={() => { setBudgetTier(option.label); setBudgetAmount(option.amount); }} className={`rounded-full px-3 py-2 text-sm ${budgetTier === option.label ? 'bg-emerald-600 text-white' : 'bg-white/10 text-slate-300'}`}>
                        {option.label} • ₹{option.amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Travel pace</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {paceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPace(option.value)}
                        className={`rounded-[1rem] border px-3 py-3 text-left transition ${pace === option.value ? 'border-emerald-400/40 bg-emerald-400/10' : 'border-white/10 bg-white/5'}`}
                      >
                        <div className="font-semibold text-white">{option.label}</div>
                        <div className="mt-1 text-sm text-slate-300">{option.detail}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold">
                  <FiSend className="mr-2 h-4 w-4" />
                  Generate itinerary
                </Button>
              </div>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.75rem] border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl"
          >
            <div className="rounded-[1.25rem] border border-amber-400/20 bg-amber-400/10 p-4">
              <div className="text-sm font-semibold text-white">Trip snapshot</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"><span>Destination</span><span className="font-semibold text-white">{destination || 'Flexible'}</span></div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"><span>Length</span><span className="font-semibold text-white">{days} days</span></div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"><span>Budget</span><span className="font-semibold text-white">₹{budgetAmount}</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-emerald-300">
              <FiRotateCcw className="h-4 w-4" />
              How it behaves
            </div>
            <div className="mt-5 space-y-3">
              {[
                'Structured JSON output is parsed before it is rendered.',
                'Malformed or empty AI replies show a graceful fallback state.',
                'You can re-order or remove stops after the itinerary is generated.',
              ].map((item) => (
                <div key={item} className="rounded-[1rem] border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.25rem] border border-sky-400/20 bg-sky-400/10 p-4 text-sm text-sky-100">
              <div className="font-semibold">Tip</div>
              <p className="mt-2">Be descriptive with your prompt. The more specific your notes, the better the itinerary flow will feel.</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
