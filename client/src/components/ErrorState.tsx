import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  showRetry?: boolean;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  showRetry = true,
}: ErrorStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>

      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-center text-muted-foreground mb-6 max-w-md">{message}</p>

      <div className="flex gap-3">
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button
            onClick={onDismiss}
            variant="outline"
          >
            Dismiss
          </Button>
        )}
      </div>
    </motion.div>
  );
}
