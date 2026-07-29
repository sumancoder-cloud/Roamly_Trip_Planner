import { FiClock, FiMove, FiTrash2 } from "react-icons/fi";
import { motion } from 'framer-motion';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function StopCard({ stop, index, isExpanded, onToggleExpand, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div ref={setNodeRef} style={style} layout className="rounded-[1rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button {...attributes} {...listeners} className="mt-0.5 rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <FiMove className="h-4 w-4" />
          </button>
          <div>
            <div className="font-semibold text-slate-900">{stop.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
              <FiClock3 className="h-3 w-3" />
              {stop.startTime} • {Math.round(stop.durationMinutes / 60)}h
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onToggleExpand} className="rounded-full px-2 py-1 text-sm text-slate-600 hover:bg-slate-100">{isExpanded ? 'Less' : 'More'}</button>
          <button onClick={onRemove} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isExpanded ? <p className="mt-3 text-sm text-slate-600">{stop.description}</p> : null}
    </motion.div>
  );
}
