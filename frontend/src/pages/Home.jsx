import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  BrainCircuit, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  MessageSquare,
  Zap
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          
          <FadeIn>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-white">
              Reduce Cart Abandonment <br className="hidden md:block" />
              with <span className="text-zinc-400">Intelligent AI</span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              An intelligent checkout agent that understands user hesitation in real-time and converts friction into successful purchases.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/store" 
              className="px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-lg transition-all flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Shop & Experience Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/dashboard" 
              className="px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg transition-all w-full sm:w-auto justify-center flex"
            >
              View Admin Dashboard
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-dark-surface/30 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How The Agent Works</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">Real-time intent detection meets contextual intervention.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
            
            {[
              { icon: Activity, title: "1. Monitor", desc: "Tracks idle time, cursor exits, and cart value in real-time." },
              { icon: BrainCircuit, title: "2. Detect", desc: "AI identifies signs of hesitation (e.g. price shock or delivery doubt)." },
              { icon: MessageSquare, title: "3. Intervene", desc: "Triggers contextual support, trust badges, or specific discounts." },
              { icon: ShoppingCart, title: "4. Convert", desc: "User completes checkout with renewed confidence." }
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative pt-8 md:pt-0">
                <div className="bg-[#0f0f13] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center h-full hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 text-zinc-300">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-white">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Solves Vertical-Specific Friction</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn>
              <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-3xl group hover:border-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-white">Fashion & Apparel</h3>
                <p className="text-zinc-500 mb-6 text-sm">Users often hesitate over sizing or return policies at checkout.</p>
                <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                  <p className="text-sm text-zinc-400">Agent Action: "Unsure about your size? Free returns within 30 days."</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-3xl group hover:border-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-white">High-Ticket Electronics</h3>
                <p className="text-zinc-500 mb-6 text-sm">Price shock and warranty confusion lead to heavy drop-off.</p>
                <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                  <p className="text-sm text-zinc-400">Agent Action: "Need time? Apply 0% EMI financing at checkout."</p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-3xl group hover:border-white/10 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-white">Health & Skincare</h3>
                <p className="text-zinc-500 mb-6 text-sm">Trust and ingredient efficacy doubts at the last minute.</p>
                <div className="p-4 rounded-xl bg-black/50 border border-white/5">
                  <p className="text-sm text-zinc-400">Agent Action: "100% Dermatologist tested. Over 2,000 positive reviews."</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-24 border-t border-white/5 relative z-10 text-center bg-black/20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8">Ready to recover lost revenue?</h2>
          <Link 
            to="/demo" 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition-colors"
          >
            Start Simulation Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
