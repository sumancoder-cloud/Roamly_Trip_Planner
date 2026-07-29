import { FiArrowRight, FiCompass, FiCpu, FiMap, FiMapPin, FiStar } from "react-icons/fi";
import { motion } from 'framer-motion';

const intelligenceCards = [
  {
    title: 'Adaptive pacing',
    description: 'The planner balances energy, rest, and discovery so your trip feels effortless instead of overpacked.',
  },
  {
    title: 'Mood-first suggestions',
    description: 'Every itinerary is shaped around your vibe, from romantic escapes to food-forward weekends.',
  },
  {
    title: 'Flexible editing',
    description: 'Reorder stops, trim plans, and reroute the day without breaking the flow of the itinerary.',
  },
];

const featuredTrips = [
  {
    title: 'Santorini at golden hour',
    subtitle: 'Sunset dinners, cliffside walks, and calm mornings',
    tag: 'Romantic',
  },
  {
    title: 'Kyoto food & culture',
    subtitle: 'Temple mornings, market afternoons, and cozy cafés',
    tag: 'Culture',
  },
];

export default function AdvancedSections() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
              <FiStar className="h-4 w-4" />
              A premium planning experience
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Built to feel like a real travel studio, not a generic form.
            </h2>
          </div>
          <p className="max-w-xl text-lg text-slate-600">
            Roamly combines immersive visuals, smart itinerary logic, and a calm dashboard so planning feels as beautiful as the trip itself.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_-35px_rgba(0,0,0,0.3)]"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
              <FiCpu className="h-5 w-5" />
              <div>
                <div className="font-semibold">AI planning studio</div>
                <div className="text-sm text-emerald-600">Structured around your pace, budget and travel style</div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {intelligenceCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-[0_20px_80px_-35px_rgba(2,6,23,0.6)]">
              <div className="flex items-center gap-3">
                <FiCompass className="h-5 w-5 text-emerald-300" />
                <div className="text-sm uppercase tracking-[0.3em] text-slate-400">Why travelers love it</div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Calm UI', value: '4.9/5' },
                  { label: 'Flexible plans', value: 'Instant edits' },
                  { label: 'AI-ready', value: 'Built-in prompt flow' },
                  { label: 'Personal dashboard', value: 'Your own space' },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-white/10 p-4">
                    <div className="text-sm text-slate-300">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.25)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">Featured journeys</div>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">Sample itineraries that feel elevated</h3>
                </div>
                <button className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  View more <FiArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {featuredTrips.map((trip) => (
                  <div key={trip.title} className="flex items-center justify-between rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                        <FiMapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{trip.title}</div>
                        <div className="text-sm text-slate-600">{trip.subtitle}</div>
                      </div>
                    </div>
                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      {trip.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
