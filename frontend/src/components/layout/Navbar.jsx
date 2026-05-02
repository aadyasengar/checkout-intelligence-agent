import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainCircuit, Menu, X, ChevronRight, LogOut, User, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/store' },
    { name: 'Live Demo', path: '/demo' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#000000]/80 backdrop-blur-lg border-b border-white/5 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white border border-white/10 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <BrainCircuit className="text-black w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Kaspar<span className="text-zinc-500">AI</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
                {link.name}
              </Link>
            ))}
            <div className="h-4 w-px bg-white/10" />

            {/* Cart */}
            {cartCount > 0 && (
              <Link to="/checkout" className="relative text-zinc-400 hover:text-white transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                    <User className="w-4 h-4 text-zinc-400" />
                  </div>
                  {user.name}
                </div>
                <button onClick={logout} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Sign In</Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-medium transition-all flex items-center gap-2 group">
                  Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden text-zinc-400 hover:text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#000000]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden">
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium px-4 py-2 rounded-lg ${location.pathname === link.path ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
