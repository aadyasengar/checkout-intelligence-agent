import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  const [sessionId] = useState(() => {
    const saved = localStorage.getItem('sessionId');
    if (saved) return saved;
    const newId = 'sess_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('sessionId', newId);
    return newId;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Sync cart to backend whenever it changes
    if (cart.length > 0) {
      const total = cart.reduce((s, i) => s + i.variant.price * i.quantity, 0);
      axios.post(`${API_URL}/sessions`, { sessionId, cartItems: cart, cartTotal: total }).catch(() => {});
    }
  }, [cart, sessionId]);

  const addToCart = (product, variant) => {
    setCart(prev => {
      const existing = prev.find(i => i.variant.id === variant.id);
      if (existing) return prev.map(i => i.variant.id === variant.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const updateQuantity = (variantId, qty) => {
    if (qty < 1) setCart(prev => prev.filter(i => i.variant.id !== variantId));
    else setCart(prev => prev.map(i => i.variant.id === variantId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => cart.reduce((s, i) => s + i.variant.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getCartTotal, sessionId }}>
      {children}
    </CartContext.Provider>
  );
};
