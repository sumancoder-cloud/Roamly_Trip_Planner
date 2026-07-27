import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <button onClick={() => setLocation('/')} className="mb-6 flex items-center gap-2 text-sm text-slate-300">
          <ArrowLeft className="h-4 w-4" />
          Back home
        </button>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">This demo keeps the experience lightweight and focused on the travel planner flow.</p>
        <div className="mt-8 rounded-[1.25rem] border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-slate-300">
          Login is intentionally simplified for the assignment. You can continue as a guest and explore the planner directly.
        </div>
        <Button onClick={() => setLocation('/planner')} className="mt-6 w-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-slate-950 font-semibold">
          Continue to planner
        </Button>
      </motion.div>
    </div>
  );
}
