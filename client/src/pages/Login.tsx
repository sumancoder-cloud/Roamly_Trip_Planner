import { motion } from 'framer-motion';
import { ArrowLeft, Chrome, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { startLogin } from '@/const';

export default function Login() {
  const [, setLocation] = useLocation();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Back button */}
      <motion.button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </motion.button>

      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card */}
        <div className="bg-card rounded-2xl border border-input shadow-lg p-8 md:p-12">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Roamly</h1>
            <p className="text-muted-foreground">Sign in to start planning your trip</p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* Google */}
            <Button
              onClick={() => startLogin()}
              variant="outline"
              size="lg"
              className="w-full gap-3 h-12 border-input hover:bg-slate-50"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </Button>

            {/* Facebook */}
            <Button
              onClick={() => startLogin()}
              variant="outline"
              size="lg"
              className="w-full gap-3 h-12 border-input hover:bg-blue-50"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
              <span>Continue with Facebook</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-input"></div>
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-input"></div>
          </div>

          {/* Email option (placeholder) */}
          <Button
            onClick={() => startLogin()}
            variant="outline"
            size="lg"
            className="w-full h-12 border-input"
          >
            Continue with Email
          </Button>

          {/* Footer text */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Benefits section */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <p className="text-2xl font-bold text-accent">100%</p>
            <p className="text-xs text-muted-foreground">Free</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">30s</p>
            <p className="text-xs text-muted-foreground">Setup Time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-accent">∞</p>
            <p className="text-xs text-muted-foreground">Trips</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
