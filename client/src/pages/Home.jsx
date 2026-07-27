import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <footer className="mt-16 border-t border-white/10 bg-slate-900/70 py-10">
        <div className="container text-center text-sm text-slate-400">
          <p>© 2026 Roamly. Built for travelers who want calm, curated plans.</p>
        </div>
      </footer>
    </div>
  );
}
