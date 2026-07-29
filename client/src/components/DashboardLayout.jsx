import { FiArchive, FiCalendar, FiCompass, FiCreditCard } from "react-icons/fi";
import { motion } from 'framer-motion';

import { useAuth } from '@/_core/hooks/useAuth.jsx';

export default function DashboardLayout({ trips = [] }) {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Welcome back</div>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{user?.name || 'Traveler'}</h2>
          </div>
          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{trips.length} saved plans</div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: FiCompass, title: 'Trips ready', value: trips.length || 0, detail: 'Saved in your browser' },
          { icon: FiCalendar, title: 'Next plan', value: trips[0]?.tripTitle || 'No plans yet', detail: 'Keep it simple' },
          { icon: FiCreditCard, title: 'Budget', value: 'Flexible', detail: 'Adjust as you go' },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-sm text-slate-500">{item.title}</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">{item.value}</div>
              <div className="mt-1 text-sm text-slate-500">{item.detail}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-slate-900">
          <FiArchive className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Recent itinerary history</h3>
        </div>

        {trips.length === 0 ? (
          <div className="rounded-[1rem] border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600">Your saved trips will appear here after you generate one.</div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip, index) => (
              <div key={`${trip.tripTitle}-${index}`} className="flex flex-wrap items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <div className="font-semibold text-slate-900">{trip.tripTitle}</div>
                  <div className="mt-1 text-sm text-slate-500">{trip.destination} • {trip.durationDays} days</div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">{trip.pace}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
