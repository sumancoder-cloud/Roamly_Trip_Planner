import { FiEdit3, FiMessageSquare, FiZap } from "react-icons/fi";
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Describe',
    description: 'Tell us about your dream trip in natural language.',
    icon: FiMessageSquare,
  },
  {
    number: '02',
    title: 'Generate',
    description: 'AI builds your personalized day-by-day itinerary.',
    icon: FiZap,
  },
  {
    number: '03',
    title: 'Customize',
    description: 'Reorder, remove, and refine activities to your liking.',
    icon: FiEdit3,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white/70 py-20 md:py-32">
      <div className="container">
        <motion.div className="mb-14 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="mb-4 text-3xl font-semibold text-slate-900 md:text-4xl">How it works</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">Three simple steps to turn your travel ideas into a polished plan.</p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="rounded-[1.6rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.28)]">
                <div className="mb-4 text-5xl font-semibold text-emerald-500/20">{step.number}</div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
