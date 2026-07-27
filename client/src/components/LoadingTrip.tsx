import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LoadingTripProps {
  onCancel?: () => void;
}

const stages = [
  'Understanding your trip',
  'Finding a good daily flow',
  'Creating your itinerary',
];

export default function LoadingTrip({ onCancel }: LoadingTripProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated spinner */}
      <motion.div
        className="mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="w-12 h-12 text-accent" />
      </motion.div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-2">Building your itinerary...</h3>
      <p className="text-muted-foreground mb-8">This usually takes a few seconds</p>

      {/* Stages */}
      <div className="w-full max-w-md space-y-3 mb-8">
        {stages.map((stage, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.3 }}
          >
            <motion.div
              className="w-5 h-5 rounded-full border-2 border-accent flex items-center justify-center flex-shrink-0"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: index * 0.3, duration: 2, repeat: Infinity }}
            >
              {index < 2 && (
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              )}
            </motion.div>
            <span className="text-sm">{stage}</span>
          </motion.div>
        ))}
      </div>

      {/* Cancel button */}
      {onCancel && (
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </Button>
      )}
    </motion.div>
  );
}
