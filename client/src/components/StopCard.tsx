import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronUp, GripVertical, Trash2, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Stop } from '@/types/trip';

interface StopCardProps {
  stop: Stop;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
}

const categoryColors: Record<string, string> = {
  attraction: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  food: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  activity: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  shopping: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
};

export default function StopCard({
  stop,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
}: StopCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`border rounded-lg overflow-hidden transition-all ${
        isExpanded
          ? 'border-accent bg-accent/5'
          : 'border-input hover:border-accent/50'
      }`}>
        {/* Collapsed view */}
        <div className="flex items-center gap-3 p-4">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
            aria-label="Drag handle"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Time */}
          <div className="w-16 flex-shrink-0">
            <span className="font-semibold text-sm">{stop.startTime}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">{stop.name}</h4>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${categoryColors[stop.category]}`}>
                {stop.category}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{stop.description}</p>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground flex-shrink-0">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(stop.durationMinutes)}</span>
          </div>

          {/* Expand button */}
          <button
            onClick={onToggleExpand}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>

          {/* Delete button */}
          <button
            onClick={onRemove}
            className="p-1 hover:bg-destructive/10 rounded transition-colors text-destructive"
            aria-label="Remove stop"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <motion.div
            className="border-t border-input bg-background p-4 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Description */}
            <div>
              <h5 className="font-semibold text-sm mb-2">About</h5>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stop.description}
              </p>
            </div>

            {/* Duration */}
            <div>
              <h5 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Duration
              </h5>
              <p className="text-sm">{formatDuration(stop.durationMinutes)}</p>
            </div>

            {/* Tips */}
            {stop.tips && stop.tips.length > 0 && (
              <div>
                <h5 className="font-semibold text-sm mb-2">Tips</h5>
                <ul className="text-sm space-y-1">
                  {stop.tips.map((tip, i) => (
                    <li key={i} className="text-muted-foreground flex gap-2">
                      <span className="text-accent">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
