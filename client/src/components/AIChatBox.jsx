import { FiSend } from "react-icons/fi";
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function AIChatBox() {
  const [message, setMessage] = useState('');

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-900">Need a quick tweak?</div>
      <div className="flex gap-2">
        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask for a better route or foodie stop" className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-sm outline-none" />
        <button className="rounded-full bg-emerald-600 p-2 text-white">
          <FiSend className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
