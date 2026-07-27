import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Sparkles, SendHorizonal, RotateCcw, MapPin, UserCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTripGenerator } from '@/hooks/useTripGenerator';
import TripDisplay from '@/components/TripDisplay';

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
  const [prompt, setPrompt] = useState('');
  const [pace, setPace] = useState('balanced');
  const { trip, status, error, generateTrip, cancelGeneration, reset } = useTripGenerator();

  const isBusy = status === 'loading';
  const showError = status === 'error' && error;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Describe your dream trip first');
      return;
    }

    const fullPrompt = `${prompt}\n\nPreferred pace: ${pace}`;
    await generateTrip(fullPrompt);
  };

  const handleSuggestion = (value) => {
    setPrompt(value);
  };

  if (status === 'success' && trip) {
    return <TripDisplay trip={trip} onEdit={reset} />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.2),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.2),_transparent_28%),linear-gradient(135deg,_#020617_0%,_#111827_45%,_#1f2937_100%)] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.button
          onClick={() => setLocation('/')}
          className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur"
          whileHover={{ x: -4, scale: 1.02 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </motion.button>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
        >
          <div className="grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                <Sparkles className="h-4 w-4" />
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
                <Compass className="h-4 w-4" />
                Quick inspirations
              </div>
              <div className="mt-4 space-y-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSuggestion(item)}
                    className="flex w-full items-start gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-3 text-left text-sm text-slate-200 transition hover:bg-slate-950/80"
                  >
                    <MapPin className="mt-0.5 h-4 w-4 text-cyan-300" />
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
              <div className="rounded-full bg-slate-950/50 p-2"><UserCircle2 className="h-5 w-5 text-cyan-300" /></div>
              <div>
                <div className="text-sm font-semibold text-white">Traveler profile</div>
                <div className="text-xs text-slate-300">Maya • 2 travelers • beach-first</div>
              </div>
            </div>
            {isBusy ? (
              <div className="flex flex-col items-center justify-center rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
                  className="mb-4 rounded-full border border-cyan-300/30 p-4"
                >
                  <Sparkles className="h-8 w-8 text-cyan-300" />
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
                    placeholder="Example: Plan a dreamy 4-day escape to Goa for two friends with beaches, cafés, sunset photography and slow evenings."
                    className="min-h-40 w-full rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 py-4 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <Label className="mb-3 block text-sm uppercase tracking-[0.3em] text-slate-400">Travel pace</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {paceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPace(option.value)}
                        className={`rounded-[1rem] border px-3 py-3 text-left transition ${pace === option.value ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/10 bg-white/5'}`}
                      >
                        <div className="font-semibold text-white">{option.label}</div>
                        <div className="mt-1 text-sm text-slate-300">{option.detail}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleGenerate} className="w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-semibold">
                  <SendHorizonal className="mr-2 h-4 w-4" />
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
            <div className="rounded-[1.25rem] border border-fuchsia-400/20 bg-fuchsia-400/10 p-4">
              <div className="text-sm font-semibold text-white">Mock dashboard snapshot</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"><span>Saved ideas</span><span className="font-semibold text-white">5</span></div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"><span>Next trip</span><span className="font-semibold text-white">Goa • 4 days</span></div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2"><span>Budget vibe</span><span className="font-semibold text-white">Mid-range</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-cyan-300">
              <RotateCcw className="h-4 w-4" />
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
            <div className="mt-6 rounded-[1.25rem] border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
              <div className="font-semibold">Tip</div>
              <p className="mt-2">Be descriptive with your prompt. The more specific your notes, the better the itinerary flow will feel.</p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
