import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      
      {/* Footer */}
      <footer className="bg-card border-t border-input py-12 mt-20">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Roamly. Made with care for travelers.</p>
        </div>
      </footer>
    </div>
  );
}
