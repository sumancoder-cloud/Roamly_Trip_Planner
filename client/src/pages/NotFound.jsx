import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-100">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="text-5xl font-semibold text-cyan-300">404</div>
        <h1 className="mt-4 text-2xl font-semibold">This page wandered off</h1>
        <p className="mt-3 text-sm text-slate-400">The route you expected isn’t available, but the planner is still waiting for you.</p>
        <Button onClick={() => setLocation('/')} className="mt-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-semibold">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back home
        </Button>
      </motion.div>
    </div>
  );
}
