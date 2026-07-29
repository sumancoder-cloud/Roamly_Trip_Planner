import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Features from '@/components/Features';
import AdvancedSections from '@/components/AdvancedSections';

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#f7fbf8_0%,_#ecf7f0_45%,_#e4f2eb_100%)] text-slate-900">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <AdvancedSections />
      <footer className="border-t border-slate-200 bg-white/70 py-10">
        <div className="container text-center text-sm text-slate-500">
          <p>© 2026 Roamly. Built for travelers who want calm, curated plans.</p>
        </div>
      </footer>
    </div>
  );
}
