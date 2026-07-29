import { FiCompass, FiPlay, FiStar } from "react-icons/fi";
import { motion } from 'framer-motion';

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
    <section className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.2),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_28%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-4 py-2 text-sm text-emerald-700 shadow-sm backdrop-blur">
            <FiStar className="h-4 w-4" />
            Curated travel intelligence
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Design a trip that feels <span className="text-emerald-600">grounded</span>, not generic.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Roamly blends AI-generated plans with a polished dashboard experience so every itinerary feels premium, personal, and easy to adjust.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setLocation('/dashboard')} className="bg-emerald-600 text-white hover:bg-emerald-500">
              <FiCompass className="mr-2 h-4 w-4" />
              Start planning
            </Button>
            <Button variant="outline" className="border-slate-200 bg-white/80 text-slate-700" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              <FiPlay className="mr-2 h-4 w-4" />
              Explore the flow
            </Button>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
            <div className="font-semibold text-slate-900">What makes it feel different</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {['AI studio', 'Personal dashboard', 'Premium motion'].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">{item}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="grid gap-3 sm:grid-cols-2">
          {galleryImages.map((image, index) => (
            <motion.div key={image} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.12 }} whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1, scale: 1.01 }} className={`${index === 0 ? 'sm:col-span-2' : ''}`}>
              <img src={image} alt="Travel inspiration" className="h-48 w-full rounded-[1.5rem] object-cover shadow-[0_20px_60px_-25px_rgba(15,23,42,0.45)] sm:h-56" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
