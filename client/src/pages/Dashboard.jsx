import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { FiArrowLeft, FiCompass, FiStar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import NearbyPlaces from '@/components/NearbyPlaces';
import { useAuth } from '@/_core/hooks/useAuth.jsx';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    if (user === null) {
      setLocation('/login');
      return;
    }

    if (!user) return;
    const stored = window.localStorage.getItem('roamly-users');
    if (!stored) return;
    const users = JSON.parse(stored);
    const current = users.find((entry) => entry.email === user.email);
    setTrips((current?.trips || []).slice(0, 6));
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  const previewTrips = useMemo(() => trips.slice(0, 4), [trips]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.button onClick={() => setLocation('/')} className="flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm" whileHover={{ x: -4, scale: 1.02 }}>
          <FiArrowLeft className="h-4 w-4" />
        </motion.button>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
                <FiStar className="h-4 w-4" />
                Personal travel dashboard
              </div>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back, {user.name}.</h1>
              <p className="mt-2 max-w-2xl text-slate-600">Your dashboard keeps your trips, preferences, and plans separate for each traveler.</p>
            </div>
            <Button onClick={() => setLocation('/planner')} className="bg-emerald-600 text-white">
              <FiCompass className="mr-2 h-4 w-4" />
              Plan a new trip
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardLayout trips={previewTrips} />
          </div>
          <div className="lg:col-span-1">
            <NearbyPlaces />
          </div>
        </div>
      </div>
    </div>
  );
}
