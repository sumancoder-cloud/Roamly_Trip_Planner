import { FiArrowRight, FiCompass, FiLock, FiMail, FiShield, FiStar } from "react-icons/fi";
import { motion } from 'framer-motion';

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/_core/hooks/useAuth.jsx';

export default function AuthCard() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail) {
      setError('Please enter both your name and email.');
      return;
    }

    const result = login(trimmedName, trimmedEmail);
    if (result) {
      setError('');
      setLocation('/dashboard');
    } else {
      setError('We could not create your travel profile.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/20 bg-white/90 shadow-[0_24px_90px_-25px_rgba(15,23,42,0.35)] backdrop-blur"
    >
      <div className="grid lg:grid-cols-[0.96fr_1.04fr]">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(46,204,113,0.22),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#111827_45%,_#1f2937_100%)] p-8 text-white sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-100">
            <FiStar className="h-4 w-4" />
            Secure traveler access
          </div>
          <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">Welcome to your private travel studio.</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-slate-300">
            Log in to access a calm dashboard, saved itineraries, and a planner that feels created just for you.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: FiShield, title: 'Private profile', text: 'Your trips stay in your own browser-based workspace.' },
              { icon: FiCompass, title: 'AI planning', text: 'Generate polished itineraries with one clear prompt.' },
              { icon: FiLock, title: 'Fast access', text: 'Continue as a guest or sign in instantly.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="rounded-2xl bg-emerald-400/15 p-2">
                    <Icon className="h-4 w-4 text-emerald-300" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-300">{item.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            <FiMail className="h-4 w-4" />
            Login
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Enter your traveler details</h2>
          <p className="mt-2 text-sm text-slate-600">A polished sign-in creates a personal dashboard experience with a calm look and feel.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ava Reynolds"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ava@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:bg-white"
              />
            </div>

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</div> : null}

            <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-500">
              Continue to dashboard <FiArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Prefer a quick start? <button type="button" onClick={() => setLocation('/planner')} className="font-semibold text-emerald-600">Jump to planner</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
