import { useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * useCheckoutTracker — Enhanced Agentic Edition
 *
 * Tracks idle, section dwell, micro-events, proactive 10s ticks, exit intent.
 */
export const useCheckoutTracker = (stage = 'checkout', { onProactiveTick } = {}) => {
  const { sessionId, cart, getCartTotal } = useCart();
  const idleTimeout   = useRef(null);
  const idleInterval  = useRef(null);
  const proactiveRef  = useRef(null);
  const sectionTimers = useRef({});
  const currentSection = useRef(null);
  const proactiveCount = useRef(0);

  // Register/sync session
  useEffect(() => {
    axios.post(`${API_URL}/sessions`, {
      sessionId, cartItems: cart, cartTotal: getCartTotal(),
    }).catch(() => {});
  }, [sessionId]);

  // Core event logger
  const logEvent = useCallback((eventType, metadata = {}) => {
    axios.post(`${API_URL}/events`, { sessionId, eventType, metadata }).catch(() => {});
  }, [sessionId]);

  // Idle detection — fires idle_checkout every 10s of inactivity
  useEffect(() => {
    const startIdleInterval = () => {
      if (idleInterval.current) clearInterval(idleInterval.current);
      idleInterval.current = setInterval(() => {
        logEvent('idle_checkout', { stage, section: currentSection.current });
      }, 10000);
    };
    const resetIdle = () => {
      clearTimeout(idleTimeout.current);
      clearInterval(idleInterval.current);
      idleTimeout.current = setTimeout(startIdleInterval, 10000);
    };
    ['mousemove','keypress','scroll','click'].forEach(e => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      ['mousemove','keypress','scroll','click'].forEach(e => window.removeEventListener(e, resetIdle));
      clearTimeout(idleTimeout.current);
      clearInterval(idleInterval.current);
    };
  }, [sessionId, stage, logEvent]);

  // Proactive 10-second tick — fires REGARDLESS of user activity
  useEffect(() => {
    if (!onProactiveTick) return;
    proactiveRef.current = setInterval(() => {
      proactiveCount.current += 1;
      onProactiveTick(proactiveCount.current);
    }, 10000);
    return () => clearInterval(proactiveRef.current);
  }, [onProactiveTick]);

  // Section dwell tracking
  const enterSection = useCallback((sectionName) => {
    if (currentSection.current && sectionTimers.current[currentSection.current]) {
      const elapsed = Date.now() - sectionTimers.current[currentSection.current];
      if (elapsed > 8000) {
        logEvent('section_dwell', { section: currentSection.current, dwell_ms: elapsed });
      }
    }
    currentSection.current = sectionName;
    sectionTimers.current[sectionName] = Date.now();
  }, [logEvent]);

  // Convenience wrappers
  const trackShippingChange  = useCallback((method) => logEvent('shipping_method_changed', { method }), [logEvent]);
  const trackAddressEdit     = useCallback((field)  => logEvent('address_edited', { field }), [logEvent]);
  const trackPaymentFocus    = useCallback((field)  => logEvent('payment_field_focused', { field }), [logEvent]);
  const trackCouponFail      = useCallback((code)   => logEvent('coupon_failed', { code }), [logEvent]);
  const trackRemoveAttempt   = useCallback((item)   => {
    logEvent('remove_item_attempted', { item });
    logEvent('exit_intent', { reason: 'remove_item_attempt', item });
  }, [logEvent]);
  const trackQuantityChange  = useCallback((item, oldQty, newQty) => logEvent('quantity_changed', { item, oldQty, newQty }), [logEvent]);
  const trackExitIntent      = useCallback(() => logEvent('exit_intent', { stage }), [logEvent, stage]);
  const trackProductHover    = useCallback((product, ms) => logEvent('product_hover', { product, dwell_ms: ms }), [logEvent]);

  return {
    logEvent,
    enterSection,
    trackShippingChange,
    trackAddressEdit,
    trackPaymentFocus,
    trackCouponFail,
    trackRemoveAttempt,
    trackQuantityChange,
    trackExitIntent,
    trackProductHover,
  };
};
