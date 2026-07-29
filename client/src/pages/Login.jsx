import { FiArrowLeft } from "react-icons/fi";
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import { useLocation } from 'wouter';
import AuthCard from '@/components/AuthCard';
import { useAuth } from '@/_core/hooks/useAuth.jsx';

export default function Login() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation('/dashboard');
    }
  }, [user, setLocation]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_28%),linear-gradient(135deg,_#f7fbf8_0%,_#edf7ef_45%,_#e3f1ea_100%)] px-4 py-12 text-slate-900">
      <div className="w-full max-w-6xl">
        <motion.button onClick={() => setLocation('/')} className="mb-6 flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm" whileHover={{ x: -4, scale: 1.02 }}>
          <FiArrowLeft className="h-4 w-4" />
          Back home
        </motion.button>
        <AuthCard />
      </div>
    </div>
  );
}
