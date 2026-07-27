import { motion } from 'framer-motion';
import { MessageSquare, Zap, Edit3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Describe',
    description: 'Tell us about your dream trip in natural language.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Generate',
    description: 'AI builds your personalized day-by-day itinerary.',
    icon: Zap,
  },
  {
    number: '03',
    title: 'Customize',
    description: 'Reorder, remove, and refine activities to your liking.',
    icon: Edit3,
  },
];

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-card">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your travel ideas into reality
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Card */}
                <div className="bg-background rounded-2xl p-8 border border-input hover:border-accent/50 transition-colors">
                  {/* Number */}
                  <div className="text-5xl font-bold text-accent/20 mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow connector (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <div className="w-12 h-1 bg-gradient-to-r"></div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
