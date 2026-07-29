import { FiChevronDown, FiChevronUp, FiMap, FiTrash2 } from "react-icons/fi";
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'sonner';

export default function TripTimeline({ trip }) {
  const [expandedStops, setExpandedStops] = useState(new Set());
  const [stops, setStops] = useState(() => trip.days.flatFiMap((day) => day.stops.map((stop) => ({ ...stop, _dayNumber: day.day }))));

  const toggleExpanded = (stopId) => {
    const next = new Set(expandedStops);
    if (next.has(stopId)) next.delete(stopId); else next.add(stopId);
    setExpandedStops(next);
  };

  const handleRemoveStop = (stopId) => {
    const removedStop = stops.find((stop) => stop.id === stopId);
    setStops(stops.filter((stop) => stop.id !== stopId));
    toast.success(`${removedStop?.name || 'Stop'} removed`);
  };

  const groupedStops = useMemo(() => {
    return trip.days.map((day) => ({
      ...day,
      stops: stops.filter((stop) => stop._dayNumber === day.day),
    }));
  }, [stops, trip.days]);

  return (
    <div className="space-y-6">
      {groupedStops.map((day, dayIndex) => (
        <motion.div key={day.day} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dayIndex * 0.06 }} className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-emerald-50/70 p-5">
            <h3 className="text-lg font-semibold text-slate-900">Day {day.day}</h3>
            <p className="mt-1 text-sm text-slate-600">{day.title}</p>
          </div>
          <div className="p-4">
            {day.stops.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">No stops planned yet.</div>
            ) : (
              <div className="space-y-3">
                {day.stops.map((stop) => {
                  const isExpanded = expandedStops.has(stop.id);
                  return (
                    <div key={stop.id} className="rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{stop.name}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">{stop.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleExpanded(stop.id)} className="rounded-full p-2 text-slate-500 hover:bg-white">
                            {isExpanded ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                          </button>
                          <button onClick={() => handleRemoveStop(stop.id)} className="rounded-full p-2 text-slate-500 hover:bg-white">
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <p className="mt-3 text-sm text-slate-600">{stop.description}</p>
                            {stop.tips?.length ? <ul className="mt-3 space-y-1 text-sm text-slate-600">{stop.tips.map((tip) => <li key={tip}>• {tip}</li>)}</ul> : null}
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
