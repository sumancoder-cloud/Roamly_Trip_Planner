import { FiArrowLeft, FiCalendar, FiCompass, FiCreditCard, FiDollarSign, FiMap, FiMapPin, FiStar } from "react-icons/fi";
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export default function TripDisplay({ trip, onEdit }) {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();
  const [selectedDay, setSelectedDay] = useState(1);
  const [tripState, setTripState] = useState(trip);
  const [draggedStopId, setDraggedStopId] = useState(null);

  useEffect(() => {
    setTripState(trip);
  }, [trip]);

  const selectedTripDay = useMemo(() => tripState?.days?.[selectedDay - 1] || tripState?.days?.[0], [tripState, selectedDay]);

  const handleDropOnStop = (targetStopId) => {
    if (!draggedStopId || !selectedTripDay?.stops) {
      setDraggedStopId(null);
      return;
    }

    const dayIndex = tripState?.days?.findIndex((day) => day?.day === selectedTripDay?.day);
    if (dayIndex < 0) {
      setDraggedStopId(null);
      return;
    }

    setTripState((current) => {
      const nextDays = [...(current?.days || [])];
      const currentDay = { ...(nextDays[dayIndex] || {}) };
      const stops = [...(currentDay.stops || [])];
      const fromIndex = stops.findIndex((stop) => stop?.id === draggedStopId);
      const toIndex = stops.findIndex((stop) => stop?.id === targetStopId);

      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
        return current;
      }

      const [movedStop] = stops.splice(fromIndex, 1);
      stops.splice(toIndex, 0, movedStop);
      currentDay.stops = stops;
      nextDays[dayIndex] = currentDay;
      return { ...(current || {}), days: nextDays };
    });

    setDraggedStopId(null);
  };

  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8' : 'min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_25%),linear-gradient(135deg,_#f7fbf8_0%,_#edf7ef_45%,_#e3f1ea_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8'}>
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.button onClick={() => { onEdit?.(tripState); setLocation('/dashboard'); }} className={isDark ? 'flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 shadow-sm' : 'flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm'} whileHover={{ x: -4, scale: 1.02 }}>
          <FiArrowLeft className="h-4 w-4" />
          Back to dashboard
        </motion.button>

        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className={isDark ? 'overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)]' : 'overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)]'}>
          <div className={isDark ? 'border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-6 sm:p-8' : 'border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-sky-50 p-6 sm:p-8'}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className={isDark ? 'inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-slate-800/70 px-3 py-1 text-sm text-emerald-300' : 'inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm text-emerald-700'}>
                  <FiStar className="h-4 w-4" />
                  AI-crafted itinerary
                </div>
                <h1 className={isDark ? 'mt-3 text-3xl font-semibold text-white' : 'mt-3 text-3xl font-semibold text-slate-900'}>{tripState?.tripTitle || 'Your trip plan'}</h1>
                <p className={isDark ? 'mt-2 max-w-2xl text-slate-300' : 'mt-2 max-w-2xl text-slate-600'}>{tripState?.summary || 'A thoughtfully shaped getaway with rhythm, texture, and room to breathe.'}</p>
              </div>
              <div className={isDark ? 'rounded-[1.2rem] border border-white/10 bg-slate-800/70 px-4 py-3 text-sm text-slate-300' : 'rounded-[1.2rem] border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600'}>
                <div className="flex items-center gap-2"><FiCompass className="h-4 w-4 text-emerald-600" /> {tripState?.destination || 'Curated destination'}</div>
                <div className="mt-2 flex items-center gap-2"><FiCalendar className="h-4 w-4 text-sky-600" /> {tripState?.durationDays || 4} days</div>
                <div className="mt-2 flex items-center gap-2"><FiCreditCard className="h-4 w-4 text-amber-600" /> {tripState?.pace || 'balanced'} pace</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-3">
              {tripState?.days?.map((day, index) => (
                <button key={day?.day || index + 1} onClick={() => setSelectedDay(index + 1)} className={isDark ? `w-full rounded-[1.2rem] border p-4 text-left transition ${selectedDay === index + 1 ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-slate-800/70 hover:bg-slate-800'}` : `w-full rounded-[1.2rem] border p-4 text-left transition ${selectedDay === index + 1 ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}>
                  <div className={isDark ? 'font-semibold text-white' : 'font-semibold text-slate-900'}>Day {day?.day || index + 1} • {day?.title}</div>
                  <div className={isDark ? 'mt-1 text-sm text-slate-300' : 'mt-1 text-sm text-slate-600'}>{day?.summary}</div>
                </button>
              ))}
            </div>

            <div className={isDark ? 'rounded-[1.5rem] border border-white/10 bg-slate-800/70 p-5' : 'rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5'}>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                <FiMapPin className="h-4 w-4" />
                Day overview
              </div>
              <p className={isDark ? 'mt-2 text-xs uppercase tracking-[0.3em] text-slate-400' : 'mt-2 text-xs uppercase tracking-[0.3em] text-slate-500'}>Drag cards to reorder stops</p>
              <h2 className={isDark ? 'mt-3 text-2xl font-semibold text-white' : 'mt-3 text-2xl font-semibold text-slate-900'}>{selectedTripDay?.title || 'A beautifully paced day'}</h2>
              <p className={isDark ? 'mt-2 text-slate-300' : 'mt-2 text-slate-600'}>{selectedTripDay?.summary || 'A calm day built around strong experiences and natural flow.'}</p>

              <div className="mt-6 space-y-3">
                {(selectedTripDay?.stops || []).map((stop) => (
                  <div
                    key={stop?.id || stop?.name}
                    draggable
                    onDragStart={() => setDraggedStopId(stop?.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDropOnStop(stop?.id)}
                    onDragEnd={() => setDraggedStopId(null)}
                    className={isDark ? 'rounded-[1.2rem] border border-white/10 bg-slate-900/80 p-4' : 'rounded-[1.2rem] border border-slate-200 bg-white p-4'}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className={isDark ? 'font-semibold text-white' : 'font-semibold text-slate-900'}>{stop?.name}</div>
                        <div className={isDark ? 'mt-1 text-sm text-slate-400' : 'mt-1 text-sm text-slate-500'}>{stop?.category} • {stop?.startTime}</div>
                      </div>
                      <div className={isDark ? 'rounded-full bg-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200' : 'rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-600'}>{stop?.durationMinutes}m</div>
                    </div>
                    <p className={isDark ? 'mt-3 text-sm leading-6 text-slate-300' : 'mt-3 text-sm leading-6 text-slate-600'}>{stop?.description}</p>
                    {stop?.estimatedCost ? (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                        <FiDollarSign className="h-4 w-4" />
                        Est. ₹{stop.estimatedCost}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
