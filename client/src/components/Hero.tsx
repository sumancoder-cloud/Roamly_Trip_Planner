import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Hero() {
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        className="container max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">AI-Powered Trip Planning</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            <span className="block text-foreground">Plan Less.</span>
            <span className="gradient-text">Travel More.</span>
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-center text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          Tell Roamly where you want to go, and turn an idea into an itinerary you can actually customize. 
          Powered by AI, built for adventurers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            onClick={() => setLocation('/planner')}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white gap-2"
          >
            Create My Trip
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => {
              const element = document.getElementById('how-it-works');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="outline"
            size="lg"
          >
            Learn More
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={itemVariants}
          className="text-center text-sm text-muted-foreground"
        >
          <p>✓ No signup required • ✓ Free to try • ✓ Instant results</p>
        </motion.div>
      </motion.div>

      {/* Floating cards animation */}
      <motion.div
        className="absolute top-1/2 right-0 w-64 h-64 md:w-96 md:h-96 -z-10"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      >
        <div className="w-full h-full bg-gradient-to-br rounded-3xl backdrop-blur-sm border border-primary/10"></div>
      </motion.div>
    </section>
  );
}
