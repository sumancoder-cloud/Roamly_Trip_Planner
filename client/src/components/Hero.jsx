import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const galleryImages = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
];

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(244,114,182,0.2),_transparent_28%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Curated travel intelligence
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Design a trip that feels <span className="text-cyan-300">liveable</span>, not generic.
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              Roamly blends AI-generated plans with a polished dashboard experience so every itinerary feels premium, personal, and easy to adjust.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setLocation('/planner')} className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-semibold">
              <Compass className="mr-2 h-4 w-4" />
              Start planning
            </Button>
            <Button variant="outline" className="border-white/15 bg-white/10 text-white" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore the flow
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-300">
            <div className="font-semibold text-white">What makes it feel different</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {['Animated cards', 'Mock traveler dashboard', 'Original visual system'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{item}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="grid gap-3 sm:grid-cols-2">
          {galleryImages.map((image, index) => (
            <motion.div key={image} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.12 }} whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1, scale: 1.01 }} className={`${index === 0 ? 'sm:col-span-2' : ''}`}>
              <img src={image} alt="Travel inspiration" className="h-48 w-full rounded-[1.5rem] object-cover shadow-2xl shadow-slate-950/30 sm:h-56" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
