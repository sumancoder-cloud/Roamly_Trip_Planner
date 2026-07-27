import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'No itinerary yet',
  message,
  icon,
}: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-muted-foreground" />}
      </div>

      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-center text-muted-foreground max-w-md">{message}</p>
    </motion.div>
  );
}
