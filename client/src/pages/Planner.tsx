import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLocation } from 'wouter';
import { useTripGenerator } from '@/hooks/useTripGenerator';
import LoadingTrip from '@/components/LoadingTrip';
import ErrorState from '@/components/ErrorState';
import TripDisplay from '@/components/TripDisplay';
import { toast } from 'sonner';

const suggestions = [
  'Weekend in Goa with friends',
  'Japan food trip for 7 days',
  'Bali honeymoon adventure',
];

export default function Planner() {
  const [, setLocation] = useLocation();
  const [prompt, setPrompt] = useState('');
  const [pace, setPace] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');

  const { trip, status, error, generateTrip, cancelGeneration, reset } = useTripGenerator();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your trip');
      return;
    }

    const fullPrompt = `${prompt}\n\nPreferred pace: ${pace}`;
    await generateTrip(fullPrompt);
  };

  const handleSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
  };

  if (status === 'success' && trip) {
    return <TripDisplay trip={trip} onEdit={reset} />;
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-2xl py-12">
        {/* Back button */}
        <motion.button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Build Your Trip</h1>
          <p className="text-lg text-muted-foreground">
            Describe your dream trip and let AI create a personalized itinerary
          </p>
        </motion.div>

        {/* Loading state */}
        {status === 'loading' && (
          <LoadingTrip onCancel={cancelGeneration} />
        )}

        {/* Error state */}
        {status === 'error' && error && (
          <ErrorState
            message={error}
            onRetry={handleGenerate}
            onDismiss={reset}
          />
        )}

        {/* Main form */}
        {status === 'idle' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Textarea */}
            <div>
              <Label htmlFor="trip-description" className="mb-2 block">
                Describe your trip
              </Label>
              <Textarea
                id="trip-description"
                placeholder="e.g., Plan a 4-day trip to Goa for two friends. Budget-friendly. We love beaches, cafés, photography and nightlife."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-none"
              />
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-sm font-medium mb-3">Try one of these:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Pace selector */}
            <div>
              <Label className="mb-3 block">Travel pace</Label>
              <RadioGroup value={pace} onValueChange={(value) => setPace(value as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="relaxed" id="relaxed" />
                  <Label htmlFor="relaxed" className="font-normal cursor-pointer">
                    Relaxed (3-4 stops per day)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced" className="font-normal cursor-pointer">
                    Balanced (4-5 stops per day)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="packed" id="packed" />
                  <Label htmlFor="packed" className="font-normal cursor-pointer">
                    Packed (5-6 stops per day)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-white"
              disabled={!prompt.trim()}
            >
              Generate Trip
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
