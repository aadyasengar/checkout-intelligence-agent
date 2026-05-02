<<<<<<< HEAD
import React, { useState, useEffect, useRef, useCallback } from 'react';
=======
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CreditCard, ChevronRight, ShoppingCart, Send, Bot, User,
  Loader2, Tag, CheckCircle2, X, Trash2, Gift, Bell, Minus, Plus,
<<<<<<< HEAD
  Truck, Zap, AlertCircle, Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckoutTracker } from '../hooks/useCheckoutTracker';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Agent Message Library ───────────────────────────────────────────────────

const TRIGGER_MESSAGES = {
  // Backend-driven
  'price hesitation':   "Hey! I noticed you've been on this page a while. Is price a concern? I can apply SAVE10 for 10% off, or set up 0% EMI — just say the word! 💸",
  'shipping confusion': "Switching between shipping options? I can clarify timelines — or upgrade you to FREE express shipping right now. Just ask! 🚀",
  'coupon confusion':   "That code didn't work? No worries — try WELCOME15 for 15% off, or I can check which offers apply to your exact cart. 🎟️",
  'exit intent':        "Before you go — I can offer 10% off (SAVE10) + a 30-day no-questions return guarantee. Want me to apply it? 🎁",
  'payment error':      "Had a payment hiccup? I can help troubleshoot, or walk you through UPI / buy-now-pay-later alternatives. 💳",
  'trust gap':          "Any questions about returns, security, or product quality? Happy to clear things up before you complete! 🔒",
  'other':              "Hi! Something holding you back? I'm here to help — ask me anything about your order. 👋",
  // Frontend-immediate
  shipping_switched:    null, // set dynamically
  payment_focused:      "Your payment info is protected with 256-bit SSL encryption. 🔒 Need help with card details or want to use UPI/EMI instead?",
  remove_attempt:       "Wait! Before removing that — I can apply SAVE10 for 10% off so you can keep it at a better price. Want me to do that? 🎁",
  coupon_failed:        "That code didn't work, but don't worry! Try WELCOME15 for 15% off, or SAVE10 for 10% off. Want me to apply one now? 🎟️",
  quantity_decreased:   "Reducing quantity? I can check if there's a bundle deal that saves you more. Want me to look? 📦",
  section_dwell_shipping: "Spending time on shipping? I can unlock FREE express delivery on your order — no minimum required. Interested? 🚚",
  section_dwell_payment:  "Taking your time on payment? I can offer 0% EMI across 6 months, or help with UPI / wallet payment. What works best? 💳",
};

// Proactive messages shown every 10s — rotate through these
const PROACTIVE_SEQUENCE = [
  { tick: 1, msg: "👋 Just checking in — any questions about your order or shipping? I'm here to help!" },
  { tick: 2, msg: "💡 Quick tip: Use code **SAVE10** right now for 10% off your entire order!" },
  { tick: 3, msg: "⚡ 47 people completed checkout in the last hour — your items are going fast!" },
  { tick: 4, msg: "🔒 All payments are 256-bit SSL encrypted. Your data is always protected." },
  { tick: 5, msg: "🎁 First time ordering? **WELCOME15** gives you 15% off — want me to apply it?" },
  { tick: 6, msg: "🚀 Add $30 more to your cart to unlock FREE express shipping — want a suggestion?" },
  { tick: 7, msg: "⭐ 96% of our customers rate delivery satisfaction 5/5. You're in great hands!" },
  { tick: 8, msg: "💎 Your cart is reserved for the next 10 minutes. Complete checkout now!" },
];

const OFFER_LABELS = {
  discount_10:   '10% discount applied — code: SAVE10',
  discount_15:   '15% discount applied — code: WELCOME15',
  free_shipping: 'Free express shipping unlocked! 🚀',
  emi:           '0% EMI option activated — 6 months',
  trust_badge:   '30-day return guarantee confirmed ✓',
  none:          'Order confirmed!',
};

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Checkout() {
  const { cart, getCartTotal, sessionId, clearCart, updateQuantity } = useCart();
=======
  Truck, Zap, AlertCircle, Sparkles, Trophy, ArrowLeft, Info, Eye
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckoutTracker } from '../hooks/useCheckoutTracker';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PERSUASION_MESSAGES = [
  "🎉 Free shipping unlocked for this order!",
  "⚡ 7 people purchased similar items in the last hour.",
  "🔥 Complete your order now and receive priority delivery.",
  "🕒 Your cart items are reserved for a limited time.",
  "💎 Premium choice — highest rated in this category.",
  "✅ 100% Secure Checkout with 256-bit encryption."
];

export default function Checkout() {
  const { cart, getCartTotal, sessionId, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561

  // Form state
  const [form, setForm] = useState({ firstName: '', lastName: '', address: '', shipping: 'standard' });
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState(null);
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [completed, setCompleted] = useState(false);
<<<<<<< HEAD

  // Agent/chat state
  const [agentVisible, setAgentVisible] = useState(false);   // is the widget mounted
  const [chatOpen, setChatOpen]         = useState(false);   // is the chat panel expanded
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [typing, setTyping]             = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);       // badge on minimised header
  const [triggerType, setTriggerType]   = useState(null);    // what caused current intervention
  const [offerPulse, setOfferPulse]     = useState(false);   // flash on header to grab attention

  // Remove-item intercept
  const [removeTarget, setRemoveTarget] = useState(null);

  // Notification snackbar (for non-intrusive hints)
  const [snackbar, setSnackbar]         = useState(null);

  const chatEndRef    = useRef(null);
  const lastTrigger   = useRef(null);     // debounce: don't re-trigger same type within 30s
  const triggerLock   = useRef(false);    // prevent simultaneous triggers

  // Auto-scroll chat
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // ── Proactive 10-second callback ─────────────────────────────────────────
  const handleProactiveTick = useCallback((tick) => {
    if (completed || triggerLock.current) return;

    const cycleTick = ((tick - 1) % PROACTIVE_SEQUENCE.length) + 1;
    const item = PROACTIVE_SEQUENCE.find(p => p.tick === cycleTick);
    if (!item) return;

    if (agentVisible && chatOpen) {
      // Chat is open — inject proactive message as new assistant bubble
      addAssistantMessage(item.msg);
    } else if (agentVisible && !chatOpen) {
      // Widget minimised — flash badge + pulse
      setUnreadCount(c => c + 1);
      setOfferPulse(true);
      setTimeout(() => setOfferPulse(false), 2000);
    } else {
      // Widget not visible yet — show subtle snackbar first 2 ticks, then full widget
      if (tick <= 1) {
        showSnackbar("👋 Need help? KasparAI is here!", () => openAgent('proactive', item.msg));
      } else {
        openAgent('proactive', item.msg);
      }
    }
  }, [completed, agentVisible, chatOpen]);
=======
  const [step, setStep] = useState(1);

  // Agent/chat state
  const [agentVisible, setAgentVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [persuasionIndex, setPersuasionIndex] = useState(0);

  const chatEndRef = useRef(null);
  const triggerLock = useRef(false);

  // Persuasion message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPersuasionIndex(prev => (prev + 1) % PERSUASION_MESSAGES.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleProactiveTick = useCallback((tick) => {
    // We could inject a message into the chat or show a snackbar
  }, []);
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561

  const { logEvent, enterSection, trackShippingChange, trackAddressEdit,
          trackPaymentFocus, trackCouponFail, trackRemoveAttempt,
          trackQuantityChange, trackExitIntent } = useCheckoutTracker('checkout', {
    onProactiveTick: handleProactiveTick,
  });

<<<<<<< HEAD
  // ── Poll backend for intervention (5s) ──────────────────────────────────
  useEffect(() => {
    if (agentVisible || completed) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/intervention/${sessionId}`);
        if (res.data.triggered && res.data.type) {
          openAgent(res.data.type);
          clearInterval(interval);
        }
      } catch {}
    }, 5000);
    return () => clearInterval(interval);
  }, [sessionId, agentVisible, completed]);

  // ── Exit intent on mouse leave ───────────────────────────────────────────
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !completed) {
        trackExitIntent();
        fireImmediateTrigger('exit intent');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [trackExitIntent, completed]);

  // ── Section entry tracking ───────────────────────────────────────────────
  useEffect(() => { enterSection('shipping'); }, []);

  // ─── Core agent functions ─────────────────────────────────────────────────

  const canTrigger = (type) => {
    if (triggerLock.current) return false;
    if (lastTrigger.current === type) return false; // same type debounce
    return true;
  };

  const openAgent = useCallback((type, customMsg = null) => {
    if (completed) return;
    const msg = customMsg || TRIGGER_MESSAGES[type] || TRIGGER_MESSAGES['other'];
    setTriggerType(type);
    setAgentVisible(true);
    setChatOpen(true);
    setUnreadCount(0);
    lastTrigger.current = type;
    addAssistantMessage(msg);
    triggerLock.current = true;
    setTimeout(() => { triggerLock.current = false; }, 30000); // 30s cooldown
  }, [completed]);

  const fireImmediateTrigger = useCallback((type, customMsg = null) => {
    if (!canTrigger(type)) return;
    if (agentVisible && chatOpen) {
      // Already open — just push message
      const msg = customMsg || TRIGGER_MESSAGES[type] || TRIGGER_MESSAGES['other'];
      addAssistantMessage(msg);
      lastTrigger.current = type;
    } else {
      openAgent(type, customMsg);
    }
  }, [agentVisible, chatOpen, openAgent]);

  const addAssistantMessage = (content) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
    if (!chatOpen) {
      setUnreadCount(c => c + 1);
      setOfferPulse(true);
      setTimeout(() => setOfferPulse(false), 2000);
    }
  };

  const showSnackbar = (text, onClick = null) => {
    setSnackbar({ text, onClick });
    setTimeout(() => setSnackbar(null), 5000);
  };

  // ─── User Action Handlers (all trigger agent) ─────────────────────────────

  const handleShippingChange = (val) => {
    const prev = form.shipping;
    setForm(f => ({ ...f, shipping: val }));
    trackShippingChange(val);

    const msg = val === 'express'
      ? "Switched to Express (1-2 days)! 🚀 I can unlock FREE express shipping if the cost is a concern — just say 'free shipping' and I'll apply it!"
      : "Switched back to Standard (3-5 days). Need faster delivery without the extra cost? I can unlock free express shipping for you! 🚚";

    fireImmediateTrigger('shipping_switched', msg);
  };

  const handleAddressChange = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    trackAddressEdit(field);
  };

  const handleAddressBlur = (field) => {
    // After user leaves a field, check if they've been struggling
    logEvent('address_field_completed', { field });
  };

  const handlePaymentFocus = (fieldName) => {
    trackPaymentFocus(fieldName);
    fireImmediateTrigger('payment_focused');
    enterSection('payment');
  };

  const handleCouponApply = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setCouponStatus('valid');
      setAppliedOffer('discount_10');
      addAssistantMessage("✅ SAVE10 applied — 10% off your order! Great choice. Let me know if I can help with anything else before you complete.");
      if (!agentVisible) { setAgentVisible(true); setChatOpen(true); }
    } else if (code === 'WELCOME15') {
      setCouponStatus('valid');
      setAppliedOffer('discount_15');
      addAssistantMessage("✅ WELCOME15 applied — 15% off your order! You saved big. Ready to complete checkout?");
      if (!agentVisible) { setAgentVisible(true); setChatOpen(true); }
    } else {
      setCouponStatus('invalid');
      trackCouponFail(code);
      fireImmediateTrigger('coupon_failed');
    }
  };

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      handleRemoveClick(item.variant.id, item.product.title);
      return;
    }
    trackQuantityChange(item.product.title, item.quantity, newQty);
    updateQuantity(item.variant.id, newQty);

    if (delta < 0) {
      // Decreasing quantity — offer bundle or discount
      setTimeout(() => fireImmediateTrigger('quantity_decreased'), 500);
    }
  };

  const handleRemoveClick = (variantId, productTitle) => {
    trackRemoveAttempt(productTitle);
    setRemoveTarget({ variantId, productTitle });
    // Also immediately open agent with retention offer
    fireImmediateTrigger('remove_attempt');
  };

  const confirmRemove = () => {
    if (removeTarget) {
      updateQuantity(removeTarget.variantId, 0);
      setRemoveTarget(null);
      // After removal, offer alternative
      setTimeout(() => {
        addAssistantMessage(`"${removeTarget.productTitle}" removed. Your cart is updated! 🛒 Can I help find a similar item or apply a discount to what's left?`);
      }, 800);
    }
  };

  const handleCouponInputChange = (val) => {
    setCouponCode(val);
    setCouponStatus(null);
    if (val.length > 0) enterSection('coupon');
  };

  const handleSectionEnter = (section) => {
    enterSection(section);
    // Section-specific proactive triggers after 15s dwell (handled via section_dwell events from tracker)
    if (section === 'payment') {
      logEvent('payment_section_entered', {});
    }
  };

  // ─── Chat API ─────────────────────────────────────────────────────────────

=======
  useEffect(() => {
    // Track back-and-forth navigation if user just came from Store with items
    if (document.referrer.includes('/store') && cart.length > 0) {
      logEvent('returned_to_checkout', { itemsCount: cart.length });
    }
  }, []);

  const addAssistantMessage = (content) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
    if (!chatOpen) setUnreadCount(c => c + 1);
  };

  const handlePayNow = async () => {
    setTyping(true);
    try { 
      await axios.post(`${API_URL}/sessions/${sessionId}/complete`); 
      setCompleted(true);
      clearCart();
    } catch {
      addAssistantMessage("Payment service is a bit slow. Let me try to process that again for you.");
    } finally {
      setTyping(false);
    }
  };

>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
  const handleSendMessage = async () => {
    const msg = input.trim();
    if (!msg || typing) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setTyping(true);
    try {
      const res = await axios.post(`${API_URL}/chat`, { sessionId, userMessage: msg });
<<<<<<< HEAD
      const { reply, resolved, offerType } = res.data;
      const displayReply = reply.replace(/\[RESOLVED:\s*\w+\]\s*/g, '').trim();
      addAssistantMessage(displayReply);
      if (resolved && offerType) setAppliedOffer(offerType);
    } catch {
      addAssistantMessage("Sorry, had a connection hiccup. Please try again! 😊");
=======
      addAssistantMessage(res.data.reply);
    } catch {
      addAssistantMessage("I'm here to help, but I'm having trouble connecting to the brain! Try again?");
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
    } finally {
      setTyping(false);
    }
  };

<<<<<<< HEAD
  // Quick-reply shortcuts
  const QUICK_REPLIES = [
    { label: '10% Off', action: () => { setAppliedOffer('discount_10'); setCouponCode('SAVE10'); setCouponStatus('valid'); addAssistantMessage("✅ 10% discount applied! Total updated below."); } },
    { label: 'Free Shipping', action: () => { setAppliedOffer('free_shipping'); addAssistantMessage("🚀 Free express shipping unlocked! Enjoy fast delivery."); } },
    { label: 'Payment Help', action: () => { setInput('I need help with payment'); } },
    { label: 'Return Policy', action: () => { setInput('What is the return policy?'); } },
  ];

  // ─── Pay Now ─────────────────────────────────────────────────────────────

  const handlePayNow = async () => {
    try { await axios.post(`${API_URL}/sessions/${sessionId}/complete`); } catch {}
    clearCart?.();
    setCompleted(true);
  };

  // ─── Pricing ─────────────────────────────────────────────────────────────

  const subtotal      = getCartTotal();
  const shippingCost  = form.shipping === 'express' ? 35 : 15;
  const tax           = subtotal * 0.08;
  let discount        = 0;
  if (appliedOffer === 'discount_10') discount = (subtotal + shippingCost + tax) * 0.10;
  if (appliedOffer === 'discount_15') discount = (subtotal + shippingCost + tax) * 0.15;
  const effectiveShipping = appliedOffer === 'free_shipping' ? 0 : shippingCost;
  const total         = subtotal + effectiveShipping + tax - discount;

  // ─── Completed screen ────────────────────────────────────────────────────
  if (completed) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0f0f13] border border-emerald-500/20 rounded-3xl p-12 text-center max-w-md w-full">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed! 🎉</h2>
        <p className="text-zinc-400 mb-8">Thank you for your purchase. A confirmation will arrive shortly.</p>
        <Link to="/store" className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
          Continue Shopping
=======
  const subtotal = getCartTotal();
  const shippingCost = form.shipping === 'express' ? 35 : 15;
  const freeShippingThreshold = 500;
  const awayFromFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  
  const total = subtotal + (subtotal >= freeShippingThreshold ? 0 : shippingCost);

  if (completed) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-900 border border-emerald-500/20 rounded-[40px] p-12 text-center max-w-lg w-full shadow-2xl">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.5)]">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4">Order Confirmed!</h2>
        <p className="text-zinc-400 mb-10 text-lg">Your items are being prepared for shipment. You've earned 150 loyalty points with this purchase! 🏆</p>
        <Link to="/store" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all active:scale-95">
          Back to Store <ArrowLeft className="w-5 h-5 rotate-180" />
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
        </Link>
      </motion.div>
    </div>
  );

<<<<<<< HEAD
  // ─── Empty cart ──────────────────────────────────────────────────────────
  if (cart.length === 0) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-zinc-500 px-4">
      <ShoppingCart size={48} className="mb-4 opacity-50" />
      <h2 className="text-2xl font-semibold mb-2 text-white">Your cart is empty</h2>
      <Link to="/store" className="mt-4 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors">Browse Store</Link>
    </div>
  );

  // ─── Main layout ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 relative">

      {/* ── LEFT — Forms ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-7 space-y-6">

        {/* Shipping */}
        <div
          className="bg-[#0f0f13] border border-white/5 rounded-2xl p-7"
          onMouseEnter={() => handleSectionEnter('shipping')}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">1</div>
            <h2 className="text-lg font-bold text-white">Shipping Information</h2>
            <Truck className="w-4 h-4 text-zinc-500 ml-auto" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { ph: 'First Name', field: 'firstName' },
              { ph: 'Last Name',  field: 'lastName'  },
            ].map(({ ph, field }) => (
              <input key={field} type="text" placeholder={ph} value={form[field]}
                onChange={e => handleAddressChange(field, e.target.value)}
                onBlur={() => handleAddressBlur(field)}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            ))}
            <input type="text" placeholder="Delivery Address" value={form.address}
              onChange={e => handleAddressChange('address', e.target.value)}
              onBlur={() => handleAddressBlur('address')}
              className="col-span-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />

            <div className="col-span-2 mt-2">
              <label className="text-sm font-semibold text-zinc-300 block mb-3">Shipping Method</label>
              <div className="space-y-3">
                {[
                  { val: 'standard', label: 'Standard Shipping', sub: '3–5 Business Days', price: '$15.00', icon: Truck },
                  { val: 'express',  label: 'Express Shipping',  sub: '1–2 Business Days', price: '$35.00', icon: Zap  },
                ].map(opt => (
                  <label key={opt.val} onClick={() => handleShippingChange(opt.val)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      form.shipping === opt.val
                        ? 'border-blue-500/60 bg-blue-500/5'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.shipping === opt.val ? 'border-blue-500' : 'border-zinc-600'}`}>
                        {form.shipping === opt.val && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                      </div>
                      <opt.icon className="w-4 h-4 text-zinc-400" />
                      <div>
                        <div className="font-medium text-white text-sm">{opt.label}</div>
                        <div className="text-zinc-500 text-xs">{opt.sub}</div>
                      </div>
                    </div>
                    <div className="font-semibold text-white text-sm">
                      {appliedOffer === 'free_shipping'
                        ? <span className="text-emerald-400 line-through mr-1">{opt.price}</span>
                        : opt.price}
                      {appliedOffer === 'free_shipping' && <span className="text-emerald-400 text-xs font-bold">FREE</span>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div
          className="bg-[#0f0f13] border border-white/5 rounded-2xl p-7"
          onMouseEnter={() => handleSectionEnter('payment')}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-7 h-7 rounded-full bg-white/10 text-zinc-300 flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-lg font-bold text-white">Payment</h2>
            <CreditCard className="w-4 h-4 text-zinc-500 ml-auto" />
          </div>
          <div className="relative">
            <input type="text" placeholder="1234 5678 9012 3456"
              onFocus={() => handlePaymentFocus('card_number')}
              className="w-full p-4 pl-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input type="text" placeholder="MM / YY"
              onFocus={() => handlePaymentFocus('expiry')}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            <input type="text" placeholder="CVV"
              onFocus={() => handlePaymentFocus('cvv')}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
          </div>
          <div className="mt-4 flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-emerald-300 text-xs">256-bit SSL encryption — your details are always safe.</span>
          </div>
        </div>

        {/* Coupon */}
        <div
          className="bg-[#0f0f13] border border-white/5 rounded-2xl p-7"
          onMouseEnter={() => handleSectionEnter('coupon')}
        >
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-4 h-4 text-zinc-400" />
            <h2 className="text-base font-semibold text-white">Discount Code</h2>
            <span className="ml-auto text-xs text-zinc-500">Try: SAVE10 or WELCOME15</span>
          </div>
          <div className="flex gap-3">
            <input type="text" placeholder="Enter discount code…" value={couponCode}
              onChange={e => handleCouponInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCouponApply()}
              className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50" />
            <button onClick={handleCouponApply}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl transition-colors text-sm">
              Apply
            </button>
          </div>
          {couponStatus === 'valid'   && <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Code applied!</p>}
          {couponStatus === 'invalid' && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Invalid code. KasparAI can help find a working one!</p>}
        </div>
      </div>

      {/* ── RIGHT — Order Summary ─────────────────────────────────────────── */}
      <div className="lg:col-span-5">
        <div className="bg-[#0f0f13] border border-white/5 rounded-2xl p-7 sticky top-24">
          <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

          {/* Free shipping progress bar */}
          {appliedOffer !== 'free_shipping' && subtotal < 150 && (
            <div className="mb-5 p-3 bg-blue-500/8 border border-blue-500/15 rounded-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-blue-300 font-medium">🚚 Free shipping progress</span>
                <span className="text-blue-400 font-bold">${(150 - subtotal).toFixed(2)} away!</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((subtotal / 150) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {appliedOffer === 'free_shipping' && (
            <div className="mb-5 p-3 bg-emerald-500/8 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-emerald-300 text-xs font-medium">🎉 Free express shipping unlocked!</span>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {cart.map((item, i) => (
              <div key={i} className="flex gap-3 items-center group">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative">
                  {item.product.image && <img src={item.product.image} className="w-full h-full object-cover" alt="" />}
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-600 text-white text-xs flex items-center justify-center rounded-full font-bold">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm line-clamp-1">{item.product.title}</div>
                  <div className="text-xs text-zinc-500 mb-1">{item.variant.title}</div>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, +1)}
                      className="w-5 h-5 rounded-md bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="font-semibold text-white text-sm">${(item.variant.price * item.quantity).toFixed(2)}</div>
                  <button
                    onClick={() => handleRemoveClick(item.variant.id, item.product.title)}
                    className="w-6 h-6 rounded-full bg-red-500/10 hover:bg-red-500/25 text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="border-t border-white/5 pt-5 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-zinc-400">
              <span>Shipping</span>
              {appliedOffer === 'free_shipping'
                ? <span className="text-emerald-400 font-medium">FREE 🚀</span>
                : <span>${shippingCost.toFixed(2)}</span>}
            </div>
            <div className="flex justify-between text-zinc-400"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount ({appliedOffer === 'discount_15' ? '15%' : '10%'}) 🎉</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-3 flex justify-between items-center border-t border-white/5">
              <span className="font-bold text-white text-base">Total</span>
              <span className="font-bold text-white text-xl">${total.toFixed(2)}</span>
            </div>
          </div>

          <AnimatePresence>
            {appliedOffer && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-300 text-sm font-medium">{OFFER_LABELS[appliedOffer]}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Savings visualization */}
          {discount > 0 && (
            <div className="mt-4 p-3 bg-emerald-500/8 border border-emerald-500/15 rounded-xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-emerald-300 text-xs font-semibold">You're saving ${discount.toFixed(2)} on this order! 🎉</div>
                <div className="text-zinc-500 text-xs">Applied: {appliedOffer === 'discount_15' ? 'WELCOME15 (15%)' : 'SAVE10 (10%)'}</div>
              </div>
            </div>
          )}

          {/* Social proof nudge */}
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <div className="flex -space-x-1.5">
              {['bg-blue-400', 'bg-purple-400', 'bg-pink-400', 'bg-amber-400'].map((c, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-[#0f0f13]`} />
              ))}
            </div>
            <span>47 people checked out in the last hour</span>
          </div>

          <button onClick={handlePayNow}
            className="w-full mt-5 bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group">
            Pay Now <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-3 text-center text-xs text-zinc-500 flex items-center justify-center gap-1">
            <ShieldCheck size={13} /> Secure SSL · 30-day returns · 24/7 support
          </p>
        </div>
      </div>

      {/* ── REMOVE ITEM CONFIRMATION MODAL ───────────────────────────────── */}
      <AnimatePresence>
        {removeTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0f0f13] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-white font-bold text-lg text-center mb-1">Wait — don't leave empty-handed!</h3>
              <p className="text-zinc-400 text-sm text-center mb-2">
                Keep <span className="text-white font-semibold">"{removeTarget.productTitle}"</span> and save 10% with code{' '}
                <span className="text-emerald-400 font-bold">SAVE10</span>.
              </p>
              <p className="text-zinc-500 text-xs text-center mb-5">KasparAI has also opened the chat to help with alternatives or bundle deals.</p>
              <button
                onClick={() => {
                  setAppliedOffer('discount_10');
                  setCouponCode('SAVE10');
                  setCouponStatus('valid');
                  setRemoveTarget(null);
                  addAssistantMessage("✅ Great choice! SAVE10 applied — 10% off your order. Your item is staying in the cart. Anything else I can help with?");
                }}
                className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors mb-3">
                Apply 10% Off & Keep Item ✨
              </button>
              <button onClick={confirmRemove}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 text-sm rounded-xl transition-colors">
                Remove anyway
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SNACKBAR ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-40 max-w-xs"
          >
            <button
              onClick={() => { snackbar.onClick?.(); setSnackbar(null); }}
              className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm shadow-xl hover:bg-zinc-700 transition-colors flex items-center gap-2 w-full text-left"
            >
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              {snackbar.text}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KASPARAI AGENT WIDGET ─────────────────────────────────────────── */}
      <AnimatePresence>
        {agentVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] shadow-2xl"
          >
            {/* Header */}
            <motion.div
              animate={offerPulse ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`rounded-t-2xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${
                offerPulse
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700'
              }`}
              onClick={() => { setChatOpen(o => !o); setUnreadCount(0); }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">KasparAI</div>
                  <div className="text-blue-200 text-xs">Checkout Recovery Agent</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
                <X
                  className="w-4 h-4 text-white/60 hover:text-white transition-colors"
                  onClick={(e) => { e.stopPropagation(); setAgentVisible(false); setUnreadCount(0); }}
                />
              </div>
            </motion.div>

            {/* Chat panel */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white border-x border-b border-zinc-200 rounded-b-2xl flex flex-col" style={{ maxHeight: 420 }}>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 290 }}>
                      {messages.map((m, i) => (
                        <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-blue-100' : 'bg-zinc-100'}`}>
                            {m.role === 'assistant'
                              ? <Bot className="w-3.5 h-3.5 text-blue-600" />
                              : <User className="w-3.5 h-3.5 text-zinc-600" />}
                          </div>
                          <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                            m.role === 'assistant'
                              ? 'bg-zinc-100 text-zinc-800 rounded-tl-none'
                              : 'bg-blue-600 text-white rounded-tr-none'
                          }`}>
                            {m.content}
                          </div>
                        </div>
                      ))}
                      {typing && (
                        <div className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <Bot className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <div className="bg-zinc-100 rounded-2xl rounded-tl-none px-3 py-2 flex items-center gap-1">
                            <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
                            <span className="text-xs text-zinc-400">Thinking…</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick replies */}
                    {messages.length <= 2 && (
                      <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-t border-zinc-100">
                        {QUICK_REPLIES.map((q, i) => (
                          <button key={i} onClick={() => { q.action(); }}
                            className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium transition-colors border border-blue-200">
                            {q.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t border-zinc-100 flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your reply…"
                        className="flex-1 px-3 py-2 rounded-xl bg-zinc-100 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={typing || !input.trim()}
                        className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 flex items-center justify-center transition-colors shrink-0"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
=======
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Progress & Gamification Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <Link to="/store" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4" /> Back to Shopping
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-xl">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">SMART SHOPPER LEVEL 1</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between mb-4">
              {['Shipping', 'Payment', 'Review'].map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                    step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-zinc-900 text-zinc-600'
                  }`}>
                    {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${step === i + 1 ? 'text-white' : 'text-zinc-600'}`}>{s}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-900 -z-0">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: `${(step - 1) * 50}%` }}
                className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Free Shipping Progress */}
            {subtotal < freeShippingThreshold && (
              <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Truck className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="font-bold">Almost there!</h3>
                      <p className="text-xs text-zinc-400">Add ${awayFromFreeShipping.toFixed(2)} more for FREE Express Shipping</p>
                    </div>
                  </div>
                  <Trophy className="w-6 h-6 text-amber-500/50" />
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Steps Container */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-8"
                >
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-blue-500" />
                    </div>
                    Shipping Details
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">First Name</label>
                      <input type="text" placeholder="John" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Last Name</label>
                      <input type="text" placeholder="Doe" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Shipping Address</label>
                      <input type="text" placeholder="123 Agentic Way, Silicon Valley" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full mt-10 py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95">
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                      </div>
                      Payment Method
                    </h2>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Encrypted</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Card Number</label>
                      <input type="text" placeholder="**** **** **** ****" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 pl-14 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                      <CreditCard className="absolute left-5 bottom-4.5 text-zinc-500" size={20} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">CVV</label>
                        <input type="text" placeholder="***" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-10">
                    <button onClick={() => setStep(1)} className="flex-1 py-5 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all">
                      Back
                    </button>
                    <button onClick={() => setStep(3)} className="flex-[2] py-5 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95">
                      Review Order <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-8"
                >
                  <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-blue-500" />
                    </div>
                    Final Review
                  </h2>
                  <div className="space-y-6">
                    {cart.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-2xl border border-white/5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                          <img src={item.product.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm line-clamp-1">{item.product.title}</h4>
                          <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-black">${(item.variant.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-10">
                    <button onClick={() => setStep(2)} className="flex-1 py-5 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all">
                      Edit
                    </button>
                    <button onClick={handlePayNow} disabled={typing} className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-600/20">
                      {typing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ShieldCheck className="w-5 h-5" /> Complete Purchase</>}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Order Summary & Persuasion */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-zinc-900/50 border border-white/5 rounded-[40px] p-10 sticky top-12">
              <h2 className="text-xl font-black mb-8 uppercase tracking-widest text-zinc-500">Summary</h2>
              
              {/* Rotating Persuasion Message */}
              <div className="mb-10 min-h-[60px] flex items-center gap-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={persuasionIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 w-full"
                  >
                    <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                    <p className="text-xs font-bold text-blue-100 leading-relaxed">
                      {PERSUASION_MESSAGES[persuasionIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="font-black text-lg">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Shipping</span>
                  <span className={`font-black text-lg ${subtotal >= freeShippingThreshold ? 'text-emerald-400' : ''}`}>
                    {subtotal >= freeShippingThreshold ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-zinc-500 font-black uppercase tracking-widest text-lg">Total</span>
                  <span className="text-3xl font-black text-blue-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Quick Coupon */}
              <div className="relative mb-8">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code" 
                  className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black font-black text-[10px] rounded-xl hover:bg-zinc-200 uppercase tracking-widest">
                  Apply
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-zinc-800/30 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 leading-tight">
                    TRUSTED BY 25,000+ CUSTOMERS WORLDWIDE. SECURE PAYMENTS ONLY.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating KasparAI Assistant */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <AnimatePresence>
          {chatOpen ? (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-[32px] w-[380px] shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-blue-600">
                <div className="flex items-center gap-3">
                  <Bot className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="font-bold text-white text-sm">KasparAI</h3>
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Checkout Assistant</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed font-medium ${
                      m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 p-4 rounded-2xl flex items-center gap-2">
                      <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Analyzing...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-4 border-t border-white/5 bg-zinc-900/50">
                <div className="relative">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about shipping, returns..." 
                    className="w-full bg-zinc-800 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button onClick={handleSendMessage} className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <button 
              onClick={() => { setChatOpen(true); setUnreadCount(0); }}
              className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all group relative"
            >
              <Bot className="w-8 h-8 text-white" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-4 border-[#050505]">
                  {unreadCount}
                </div>
              )}
            </button>
          )}
        </AnimatePresence>
      </div>
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
    </div>
  );
}
