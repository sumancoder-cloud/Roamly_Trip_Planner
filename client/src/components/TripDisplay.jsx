import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Edit3, Sparkles, MapPin, Clock3 } from 'lucide-react';
import { useLocation } from 'wouter';
import TripTimeline from './TripTimeline';

export default function TripDisplay({ trip, onEdit }) {
  const [, setLocation] = useLocation();
  const [selectedDay, setSelectedDay] = useState(1);

  const summaryStats = useMemo(() => [
    { label: 'Days', value: trip.durationDays },
    { label: 'Travelers', value: trip.travelers || 2 },
    { label: 'Pace', value: trip.pace || 'balanced' },
  ], [trip]);

  const selectedDayData = trip.days.find((day) => day.day === selectedDay) || trip.days[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.25),_transparent_35%),linear-gradient(135deg,#0f172a_0%,#111827_30%,#1f2937_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <motion.button
          onClick={() => setLocation('/')}
          className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-200 backdrop-blur"
          whileHover={{ x: -4, scale: 1.02 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </motion.button>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl"
        >
          <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                <Sparkles className="h-4 w-4" />
                AI-crafted itinerary
              </div>
              <div>
                <div className="mb-3 flex items-center gap-2 text-cyan-200">
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm">{trip.destination}</span>
                </div>
                <h1 className="text-3xl font-semibold sm:text-4xl">{trip.tripTitle}</h1>
                <p className="mt-3 max-w-2xl text-lg text-slate-300">{trip.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</div>
                    <div className="mt-1 text-lg font-semibold capitalize text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/20 via-cyan-500/20 to-emerald-400/20 p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-white/90">
                <Compass className="h-4 w-4" />
                Trip pulse
              </div>
              <div className="space-y-4 rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Planned stops</span>
                  <span className="font-semibold text-white">{trip.days.reduce((acc, day) => acc + day.stops.length, 0)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Best for</span>
                  <span className="font-semibold text-white">{trip.pace} pace</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Stay flexible</span>
                  <span className="font-semibold text-white">drag & drop</span>
                </div>
              </div>
              <button
                onClick={onEdit}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
              >
                <Edit3 className="h-4 w-4" />
                Revise itinerary
              </button>
            </div>
          </div>
        </motion.section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Days</p>
                <h2 className="text-xl font-semibold">Pick a day</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {trip.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`rounded-full px-3 py-2 text-sm transition ${selectedDay === day.day ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-300'}`}
                >
                  Day {day.day}
                </button>
              ))}
            </div>
            {selectedDayData && (
              <div className="mt-5 rounded-[1.25rem] border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-sm">{selectedDayData.title}</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{selectedDayData.summary}</p>
              </div>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/70 p-4 backdrop-blur-xl">
            <TripTimeline trip={trip} />
          </div>
        </section>
      </div>
    </div>
  );
}
