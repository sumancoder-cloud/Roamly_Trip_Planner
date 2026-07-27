import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, MapPin, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import type { Trip } from '@/types/trip';
import TripTimeline from './TripTimeline';

interface TripDisplayProps {
  trip: Trip;
  onEdit: () => void;
}

export default function TripDisplay({ trip, onEdit }: TripDisplayProps) {
  const [, setLocation] = useLocation();

  const paceIcons: Record<string, string> = {
    relaxed: 'relaxed',
    balanced: 'balanced',
    packed: 'packed',
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-4xl py-12">
        {/* Back button */}
        <motion.button
          onClick={() => setLocation('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Trip Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Destination */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-accent">{trip.destination}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{trip.tripTitle}</h1>
              <p className="text-lg text-muted-foreground">{trip.summary}</p>
            </div>
          </div>

          {/* Trip meta */}
          <div className="flex flex-wrap gap-6 py-6 border-t border-b border-input">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm">
                {trip.durationDays} day{trip.durationDays > 1 ? 's' : ''}
              </span>
            </div>
            {trip.travelers && (
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                <span className="text-sm">
                  {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium capitalize">{paceIcons[trip.pace]}</span>
              <span className="text-sm capitalize">{trip.pace} pace</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onEdit}
              variant="outline"
              className="gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Trip
            </Button>
          </div>
        </motion.div>

        {/* Timeline */}
        <TripTimeline trip={trip} />
      </div>
    </div>
  );
}
