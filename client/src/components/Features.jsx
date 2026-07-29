import { FiCalendar, FiClock, FiMenu, FiShield, FiStar, FiZap } from "react-icons/fi";
import { motion } from 'framer-motion';

const features = [
  {
    icon: FiStar,
    title: 'AI-generated',
    description: 'Create realistic, personalized itineraries in a few seconds.',
  },
  {
    icon: FiCalendar,
    title: 'Day-by-day flow',
    description: 'Organize plans clearly with an intuitive day structure.',
  },
  {
    icon: FiMenu,
    title: 'Flexible editing',
    description: 'Reorder activities and adjust plans as your trip evolves.',
  },
  {
    icon: FiClock,
    title: 'Smarter pacing',
    description: 'Balance downtime, sightseeing, and travel time naturally.',
  },
  {
    icon: FiZap,
    title: 'Fast results',
    description: 'Get a polished itinerary quickly without any extra friction.',
  },
  {
    icon: FiShield,
    title: 'Local-first',
    description: 'Keep the experience lightweight while still feeling personal.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        <motion.div className="mb-14 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="mb-4 text-3xl font-semibold text-slate-900 md:text-4xl">Made for calm planning</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">Everything you need to shape a trip that feels thoughtful, visual, and easy to follow.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="group h-full rounded-[1.5rem] border border-slate-200 bg-white/85 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)] backdrop-blur">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
