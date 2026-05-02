import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fetchShopifyProducts } from './utils/shopify.js';
import { analyzeHesitation } from './utils/analyzer.js';
import { runRecoveryConversation } from './utils/conversation.js';

dotenv.config();

import Session from './models/Session.js';
import EventLog from './models/EventLog.js';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/checkout-recovery';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 1. Get Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await fetchShopifyProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Initialize / Update Session
app.post('/api/sessions', async (req, res) => {
  try {
    const { sessionId, cartItems, cartTotal } = req.body;
    if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
    let session = await Session.findOne({ sessionId });
    if (!session) {
      session = new Session({ sessionId, cartItems, cartTotal });
    } else {
      session.cartItems = cartItems;
      session.cartTotal = cartTotal;
      session.updatedAt = new Date();
    }
    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Track event → friction → trigger AI
app.post('/api/events', async (req, res) => {
  try {
    const { sessionId, eventType, metadata } = req.body;
    if (!sessionId || !eventType) return res.status(400).json({ error: 'Missing fields' });

    await new EventLog({ sessionId, eventType, metadata }).save();

    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    if (session.interventionTriggered) {
      return res.json({ success: true, status: 'already_intervened', intervention: session.interventionType });
    }

    const frictionMap = {
      idle_checkout: 20,
      cart_modified: 10,
      shipping_method_changed: 15,
      address_edited: 10,
      coupon_failed: 25,
      exit_intent: 30,
      price_hover: 15,
      payment_error: 20,
    };

    session.frictionScore = Math.min(session.frictionScore + (frictionMap[eventType] ?? 5), 100);
    session.updatedAt = new Date();
    await session.save();

    console.log(`[${sessionId}] ${eventType} → friction: ${session.frictionScore}`);

    if (session.frictionScore >= 50 && session.checkoutStage !== 'completed') {
      const allEvents = await EventLog.find({ sessionId }).sort({ timestamp: 1 });
      const reason = await analyzeHesitation(session, allEvents);

      if (reason) {
        session.interventionTriggered = true;
        session.interventionType = reason;
        session.conversationHistory = [];
        await session.save();
        return res.json({ success: true, intervention: reason });
      } else {
        session.frictionScore = 25;
        await session.save();
        return res.json({ success: true, message: 'High friction, no confident reason yet' });
      }
    }

    res.json({ success: true, frictionScore: session.frictionScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Poll intervention state
app.get('/api/intervention/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ triggered: session.interventionTriggered, type: session.interventionType, frictionScore: session.frictionScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Conversational recovery chat
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, userMessage } = req.body;
    if (!sessionId || !userMessage) return res.status(400).json({ error: 'sessionId and userMessage required' });

    const session = await Session.findOne({ sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const history = session.conversationHistory || [];
    const { reply, resolved, offerType, updatedHistory } = await runRecoveryConversation(session, history, userMessage);

    session.conversationHistory = updatedHistory;
    if (resolved) {
      session.checkoutStage = 'completed';
      session.recoveredAt = new Date();
    }
    await session.save();

    res.json({ reply, resolved, offerType });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Mark completed
app.post('/api/sessions/:sessionId/complete', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    session.checkoutStage = 'completed';
    await session.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const totalSessions = await Session.countDocuments();
    const recovered = await Session.countDocuments({ checkoutStage: 'completed', interventionTriggered: true });
    const interventions = await Session.countDocuments({ interventionTriggered: true });
    const byType = await Session.aggregate([
      { $match: { interventionTriggered: true } },
      { $group: { _id: '$interventionType', count: { $sum: 1 } } }
    ]);
    res.json({ totalSessions, recovered, interventions, byType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
