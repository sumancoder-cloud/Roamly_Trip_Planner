import { FiCompass } from "react-icons/fi";
import { motion } from 'framer-motion';

export default function LoadingTrip() {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FiCompass className="h-6 w-6" />
        </div>
        <div className="text-lg font-semibold text-slate-900">Crafting your next trip</div>
        <div className="text-sm text-slate-600">We are shaping a plan around your budget, pace, and travel style.</div>
      </motion.div>
    </div>
  );
}
