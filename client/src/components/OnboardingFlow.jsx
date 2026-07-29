import { FiArrowRight, FiCompass, FiMap, FiShield, FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: 'Start with your vibe',
    description: 'Tell us the feeling you want — romance, food, adventure, or pure rest.',
    icon: FiStar,
  },
  {
    title: 'Shape the trip',
    description: 'Pick your ideal pacing, length, and budget so the plan matches your energy.',
    icon: FiCompass,
  },
  {
    title: 'Enjoy your studio',
    description: 'Your dashboard fills with organized ideas and a polished itinerary you can refine.',
    icon: FiMap,
  },
];

export default function OnboardingFlow() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)]">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-[linear-gradient(135deg,_#0f172a_0%,_#111827_45%,_#1f2937_100%)] p-8 text-white sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-100">
              <FiShield className="h-4 w-4" />
              Welcome aboard
            </div>
            <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">A calm, personalized trip studio awaits.</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">Roamly helps you build a beautiful itinerary from a simple idea and keeps it easy to adjust as your plans evolve.</p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div key={index} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={current.title} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.24 }} className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{current.title}</h2>
                <p className="mt-3 text-slate-600">{current.description}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <Button variant="outline" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="border-slate-200">
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep((value) => value + 1)} className="bg-emerald-600 text-white">
                  Continue <FiArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => setLocation('/planner')} className="bg-emerald-600 text-white">
                  Start planning <FiArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
