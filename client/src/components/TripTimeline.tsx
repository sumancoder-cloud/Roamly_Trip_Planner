import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import type { Trip, Stop } from '@/types/trip';
import StopCard from './StopCard';
import EmptyState from './EmptyState';

interface TripTimelineProps {
  trip: Trip;
}

export default function TripTimeline({ trip }: TripTimelineProps) {
  const [expandedStops, setExpandedStops] = useState<Set<string>>(new Set());
  const [stops, setStops] = useState<Stop[]>(
    trip.days.flatMap((day) =>
      day.stops.map((stop) => ({
        ...stop,
        _dayNumber: day.day,
      }))
    ) as (Stop & { _dayNumber: number })[]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleExpanded = (stopId: string) => {
    const newExpanded = new Set(expandedStops);
    if (newExpanded.has(stopId)) {
      newExpanded.delete(stopId);
    } else {
      newExpanded.add(stopId);
    }
    setExpandedStops(newExpanded);
  };

  const handleRemoveStop = (stopId: string) => {
    const removedStop = stops.find((s) => s.id === stopId);
    setStops(stops.filter((s) => s.id !== stopId));

    toast.success(`${removedStop?.name} removed`, {
      action: {
        label: 'Undo',
        onClick: () => {
          if (removedStop) {
            setStops([...stops, removedStop]);
          }
        },
      },
    });
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stops.findIndex((s) => s.id === active.id);
      const newIndex = stops.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setStops(arrayMove(stops, oldIndex, newIndex));
      }
    }
  };

  if (trip.days.length === 0) {
    return (
      <EmptyState
        title="No days found"
        message="The itinerary doesn't contain any days. Please try generating again."
      />
    );
  }

  return (
    <div className="space-y-8">
      {trip.days.map((day, dayIndex) => {
        const dayStoops = stops.filter((s) => (s as any)._dayNumber === day.day);

        return (
          <motion.div
            key={day.day}
            className="bg-card rounded-xl border border-input overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayIndex * 0.1 }}
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-input p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Day {day.day}</h2>
                  <p className="text-lg font-semibold text-accent mb-2">{day.title}</p>
                  <p className="text-muted-foreground">{day.summary}</p>
                </div>
              </div>
            </div>

            {/* Stops */}
            <div className="p-6">
              {dayStoops.length === 0 ? (
                <EmptyState
                  title="No activities"
                  message="Nothing planned for this day yet."
                />
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={dayStoops.map((s) => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      <AnimatePresence>
                        {dayStoops.map((stop, index) => (
                          <StopCard
                            key={stop.id}
                            stop={stop}
                            index={index}
                            isExpanded={expandedStops.has(stop.id)}
                            onToggleExpand={() => toggleExpanded(stop.id)}
                            onRemove={() => handleRemoveStop(stop.id)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
