import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  GripHorizontal,
  Clock,
  Zap,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Generated',
    description: 'Powered by advanced AI to create realistic, personalized itineraries',
  },
  {
    icon: Calendar,
    title: 'Day-by-Day',
    description: 'Organized itineraries with clear daily breakdowns and activities',
  },
  {
    icon: GripHorizontal,
    title: 'Drag & Drop',
    description: 'Easily reorder activities to match your preferred schedule',
  },
  {
    icon: Clock,
    title: 'Time Planning',
    description: 'Smart scheduling with realistic travel times and activity durations',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get your complete itinerary in seconds, not hours',
  },
  {
    icon: Shield,
    title: 'No Signup',
    description: 'Start planning immediately without creating an account',
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to plan the perfect trip
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
              >
                <div className="bg-card rounded-xl p-6 border border-input hover:border-accent/50 hover:shadow-lg transition-all duration-300 h-full">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
