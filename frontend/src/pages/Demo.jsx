import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CreditCard, AlertTriangle, CheckCircle, Terminal, Activity, Eye, Zap, MousePointerClick, RefreshCcw, Box, Truck } from 'lucide-react';

const MOCK_CART = {
  items: [
    { id: 1, name: 'Sony WH-1000XM5 Noise Cancelling Headphones', price: 349.99, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=200&h=200' },
  ],
  subtotal: 349.99,
  shipping: 12.00,
  tax: 28.50,
  total: 390.49
};

const Demo = () => {
  const [agentState, setAgentState] = useState('monitoring'); // monitoring, detecting, intervening, resolved
  const [logs, setLogs] = useState([]);
  const [interventionApplied, setInterventionApplied] = useState(null);
  const [activeSignal, setActiveSignal] = useState(null);

  // Agent State Machine & Logging
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev.slice(-7), { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), message, type }]);
  };

  useEffect(() => {
    if (agentState === 'monitoring') {
      addLog('KasparAI Core Online. Monitoring user session via telemetry...', 'system');
    }
  }, []);

  // SIMULATION TRIGGERS
  const triggerPriceHesitation = () => {
    if (agentState !== 'monitoring') return;
    setActiveSignal('price');
    setAgentState('detecting');
    addLog('[SIGNAL RECEIVED] User hovered over Order Total 4 times in 10s.', 'warning');
    
    setTimeout(() => {
      addLog('Analyzing intent model: High probability of price shock.', 'system');
      setTimeout(() => {
        addLog('Action determined: Deploy 10% salvage discount.', 'system');
        setInterventionApplied('price_discount');
        setAgentState('intervening');
      }, 1000);
    }, 1500);
  };

  const triggerShippingConfusion = () => {
    if (agentState !== 'monitoring') return;
    setActiveSignal('shipping');
    setAgentState('detecting');
    addLog('[SIGNAL RECEIVED] User clicked shipping timeline info but did not proceed.', 'warning');
    
    setTimeout(() => {
      addLog('Analyzing intent model: Ambiguity drop-off risk (Shipping).', 'system');
      setTimeout(() => {
        addLog('Action determined: Deploy Free Expedited Shipping upgrade.', 'system');
        setInterventionApplied('free_shipping');
        setAgentState('intervening');
      }, 1000);
    }, 1500);
  };

  const triggerExitIntent = () => {
    if (agentState !== 'monitoring') return;
    setActiveSignal('exit');
    setAgentState('detecting');
    addLog('[SIGNAL RECEIVED] Mouse velocity indicates exit intent (leaving viewport).', 'warning');
    
    setTimeout(() => {
      addLog('Analyzing intent model: Imminent cart abandonment detected.', 'system');
      setTimeout(() => {
        addLog('Action determined: Deploy urgency trust badge + discount.', 'system');
        setInterventionApplied('exit_save');
        setAgentState('intervening');
      }, 1000);
    }, 1000);
  };

  const handleApplyOffer = () => {
    setAgentState('resolved');
    addLog(`User accepted the ${interventionApplied} offer. Conversion secured.`, 'success');
  };

  const resetSimulation = () => {
    setAgentState('monitoring');
    setInterventionApplied(null);
    setActiveSignal(null);
    setLogs([]);
    addLog('Simulation reset. Telemetry hooks re-initialized.', 'system');
  };

  // Calculate totals based on active intervention
  let currentTotal = MOCK_CART.total;
  if (interventionApplied === 'price_discount' || interventionApplied === 'exit_save') {
    currentTotal = currentTotal - (currentTotal * 0.1); // 10% off
  } else if (interventionApplied === 'free_shipping') {
    currentTotal = currentTotal - MOCK_CART.shipping;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-5rem)] flex flex-col">
      
      {/* Simulation Controls Banner */}
      <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Simulation Triggers</h3>
            <p className="text-xs text-zinc-500">Trigger user behavior to see how the Agent reacts.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={triggerPriceHesitation}
            disabled={agentState !== 'monitoring'}
            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Simulate Price Hesitation
          </button>
          <button 
            onClick={triggerShippingConfusion}
            disabled={agentState !== 'monitoring'}
            className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Simulate Shipping Confusion
          </button>
          <button 
            onClick={triggerExitIntent}
            disabled={agentState !== 'monitoring'}
            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Simulate Exit Intent
          </button>
          <button 
            onClick={resetSimulation}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 rounded-lg text-sm font-medium transition-colors ml-2"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1">
        
        {/* LEFT PANEL: Mock Application (The "User" View) */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden flex flex-col border border-zinc-200 shadow-xl relative">
          {/* Fake Browser Chrome */}
          <div className="bg-zinc-100 border-b border-zinc-200 px-4 py-3 flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex-1 bg-white rounded-md h-7 flex items-center px-3 text-xs text-zinc-500 font-mono shadow-sm">
              <Shield className="w-3 h-3 mr-2 text-emerald-500" />
              secure.store.com/checkout
            </div>
          </div>

          <div className="flex-1 p-8 text-black bg-zinc-50 relative overflow-y-auto">
            <div className="max-w-xl mx-auto">
              <h1 className="text-2xl font-bold mb-8 text-zinc-900 border-b pb-4">Secure Checkout</h1>
              
              <div className="flex gap-6 mb-8 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <img src={MOCK_CART.items[0].image} alt="Product" className="w-24 h-24 object-cover rounded-md bg-zinc-100 relative z-10" />
                <div className="flex-1 relative z-10">
                  <h3 className="font-semibold text-zinc-800">{MOCK_CART.items[0].name}</h3>
                  <p className="text-zinc-500 text-sm mt-1">Qty: 1</p>
                  <p className="font-bold text-lg mt-2">${MOCK_CART.items[0].price}</p>
                </div>
              </div>

              <div className={`bg-white p-6 rounded-xl border shadow-sm mb-8 transition-all ${
                activeSignal === 'price' || activeSignal === 'shipping' ? 'border-amber-400 ring-4 ring-amber-400/20' : 'border-zinc-200'
              }`}>
                <h3 className="font-semibold text-zinc-800 mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm text-zinc-600">
                  <div className="flex justify-between"><span>Subtotal</span><span>${MOCK_CART.subtotal}</span></div>
                  
                  {interventionApplied === 'free_shipping' ? (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span>Shipping (Upgraded)</span><span>FREE</span>
                    </div>
                  ) : (
                    <div className={`flex justify-between ${activeSignal === 'shipping' ? 'bg-amber-50 px-2 flex-1 rounded font-medium' : ''}`}>
                      <span>Shipping</span><span>${MOCK_CART.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between"><span>Estimated Tax</span><span>${MOCK_CART.tax.toFixed(2)}</span></div>
                  
                  {['price_discount', 'exit_save'].includes(interventionApplied) && (
                    <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">
                      <span>Agent Discount (10%)</span><span>-${(MOCK_CART.total * 0.1).toFixed(2)}</span>
                    </div>
                  )}

                  <div className={`pt-3 border-t flex justify-between font-bold text-lg text-zinc-900 ${activeSignal === 'price' ? 'bg-amber-50 px-2 rounded' : ''}`}>
                    <span>Total</span><span>${currentTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2">
                Complete Purchase <CreditCard className="w-5 h-5" />
              </button>
            </div>

            {/* INTERVENTION POPUPS */}
            <AnimatePresence>
              {agentState === 'intervening' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute bottom-8 right-8 z-50 max-w-sm"
                >
                  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 ring-4 ring-blue-500/20">
                    <div className="bg-blue-600 px-4 py-3 text-white flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold text-sm">KasparAI Assistant</span>
                    </div>
                    <div className="p-5">
                      {interventionApplied === 'free_shipping' && (
                        <>
                          <h4 className="font-bold text-zinc-900 text-lg mb-2">Need it faster?</h4>
                          <p className="text-zinc-600 text-sm mb-4">We noticed you looking at shipping options. Complete your order now and we'll upgrade you to <strong>Free Expedited Shipping</strong>.</p>
                        </>
                      )}
                      {interventionApplied === 'price_discount' && (
                        <>
                          <h4 className="font-bold text-zinc-900 text-lg mb-2">Special Price Unlock!</h4>
                          <p className="text-zinc-600 text-sm mb-4">Take <strong>10% off</strong> your entire order if you complete checkout in the next 5 minutes.</p>
                        </>
                      )}
                      {interventionApplied === 'exit_save' && (
                        <>
                          <h4 className="font-bold text-zinc-900 text-lg mb-2">Wait! Before you go...</h4>
                          <p className="text-zinc-600 text-sm mb-4">This item is in high demand. Secure it now with a <strong>10% discount</strong> and 30-day money-back guarantee.</p>
                        </>
                      )}
                      <button 
                        onClick={handleApplyOffer}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                      >
                        Apply Offer & Checkout
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* RIGHT PANEL: Agent Dashboard (Dark Mode) */}
        <div className="w-full md:w-[450px] flex flex-col gap-4">
          <div className="bg-[#0f0f13] rounded-2xl p-6 flex flex-col relative overflow-hidden group border border-white/5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-blue-400" />
              Machine Intent Layer
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-zinc-500 font-bold mb-2">AGENT STATE</p>
                <div className="flex gap-2">
                  <div className={`px-3 py-1.5 rounded-md border text-sm font-semibold flex items-center gap-2 transition-colors ${
                    agentState === 'monitoring' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    agentState === 'detecting' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    agentState === 'intervening' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                    'bg-zinc-800 border-zinc-600 text-white'
                  }`}>
                    {agentState === 'monitoring' && <Activity className="w-4 h-4 animate-pulse" />}
                    {agentState === 'detecting' && <Eye className="w-4 h-4 animate-pulse" />}
                    {agentState === 'intervening' && <Zap className="w-4 h-4" />}
                    {agentState === 'resolved' && <CheckCircle className="w-4 h-4" />}
                    {agentState.toUpperCase()}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-zinc-500 font-bold mb-2">ACTIVE SIGNAL</p>
                <div className="bg-black border border-white/5 rounded-xl p-4">
                  {activeSignal ? (
                    <div className="flex items-center gap-3 text-amber-400 font-mono text-sm">
                      <AlertTriangle className="w-4 h-4" /> 
                      {activeSignal === 'price' ? 'PRICE_SENSITIVITY_DETECTED' : 
                       activeSignal === 'shipping' ? 'SHIPPING_AMBIGUITY' : 'EXIT_INTENT'}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-zinc-500 font-mono text-sm">
                      <Terminal className="w-4 h-4" /> WAITING_FOR_SIGNAL...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0f0f13] flex-1 rounded-2xl p-6 flex flex-col border border-white/5">
            <h2 className="text-xs font-bold text-zinc-500 mb-4 pb-2 border-b border-white/10 uppercase tracking-wider">
              Reasoning Logs
            </h2>
            <div className="flex-1 space-y-3 font-mono text-xs overflow-y-auto pr-2 pb-4">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border flex flex-col gap-1 ${
                      log.type === 'system' ? 'bg-black border-white/5 text-zinc-400' :
                      log.type === 'warning' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
                      log.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' :
                      'bg-blue-500/5 border-blue-500/20 text-blue-400'
                    }`}
                  >
                    <span className="text-[10px] opacity-40">{log.time}</span>
                    <span className="leading-relaxed">{log.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Demo;
