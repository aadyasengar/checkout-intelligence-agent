import OpenAI from 'openai';
<<<<<<< HEAD

// Friction type → opening message the agent sends first
export const OPENING_MESSAGES = {
  'price hesitation':
    "Hey, I noticed you've been on the payment page for a bit. Is the price giving you pause? I'm here to help — whether that's finding a discount, splitting into EMI, or just answering questions.",
  'shipping confusion':
    "I see you've been checking the shipping options a few times. Want me to help clarify delivery timelines, costs, or what's included? I can also check if you qualify for free shipping.",
  'coupon confusion':
    "Looks like you tried a discount code. I can help you find a valid one, or let you know what offers are currently available for your cart.",
  'exit intent':
    "Before you go — is there something about this order that's not quite right? I can help sort out pricing, shipping, or anything else holding you back.",
  'payment error':
    "It looks like there was a hiccup with payment. I can help troubleshoot, or walk you through alternative payment options.",
  'trust gap':
    "No worries if you have questions about our return policy, security, or product quality — happy to clear anything up before you complete your order.",
  'other':
    "I noticed you might need some help completing your checkout. What's on your mind?",
};

export async function runRecoveryConversation(session, history, userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
=======
import { ShoppingAgent } from '../agents/ShoppingAgent.js';
import { PricingAgent } from '../agents/PricingAgent.js';
import { CheckoutAgent } from '../agents/CheckoutAgent.js';
import { fetchShopifyProducts } from './shopify.js';

let productsCache = [];
const shoppingAgent = new ShoppingAgent([]);
const pricingAgent = new PricingAgent();
const checkoutAgent = new CheckoutAgent();

async function getProducts() {
  if (productsCache.length === 0) {
    productsCache = await fetchShopifyProducts();
    shoppingAgent.products = productsCache;
  }
  return productsCache;
}

export async function runRecoveryConversation(session, history, userMessage) {
  const apiKey = process.env.OPENAI_API_KEY;
  const products = await getProducts();
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561

  const updatedHistory = [
    ...history,
    { role: 'user', content: userMessage }
  ];

<<<<<<< HEAD
  if (!apiKey || apiKey === 'your_openai_api_key') {
    return runFallbackConversation(session, updatedHistory, userMessage);
  }

  const client = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt(session);
=======
  // Logic to determine which specialized agent should lead
  const lower = userMessage.toLowerCase();
  let specializedContext = "";

  if (lower.includes('price') || lower.includes('discount') || lower.includes('offer')) {
    const offer = pricingAgent.generateOffer(session);
    if (offer) specializedContext = `Pricing Insight: ${offer.message}`;
  } else if (lower.includes('recommend') || lower.includes('looking for') || lower.includes('find')) {
    const rec = shoppingAgent.recommend(session, updatedHistory);
    specializedContext = `Shopping Suggestion: ${rec}`;
  } else if (session.checkoutStage === 'started') {
    const persuasion = checkoutAgent.persuade(session);
    specializedContext = `Checkout Persuasion: ${persuasion}`;
  }

  if (!apiKey || apiKey === 'your_openai_api_key') {
    return runFallbackConversation(session, updatedHistory, userMessage, specializedContext);
  }

  const client = new OpenAI({ apiKey });
  const systemPrompt = buildSystemPrompt(session, specializedContext);
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        { role: 'system', content: systemPrompt },
        ...updatedHistory
      ],
    });

    const reply = response.choices[0].message.content;
    const resolved = detectResolution(reply);
    const offerType = detectOfferType(reply);

    updatedHistory.push({ role: 'assistant', content: reply });

    return { reply, resolved, offerType, updatedHistory };
  } catch (err) {
    console.error('OpenAI conversation error:', err.message);
<<<<<<< HEAD
    return runFallbackConversation(session, updatedHistory, userMessage);
  }
}

function buildSystemPrompt(session) {
  const itemCount = session.cartItems?.length ?? 0;
  const cartTotal = session.cartTotal ?? 0;
  const frictionType = session.interventionType ?? 'other';

  return `You are KasparAI, a checkout recovery agent for an e-commerce store. Your job is to help a buyer complete their purchase by resolving whatever is blocking them.

Cart context:
- Cart items: ${itemCount} item(s)
- Cart total: $${cartTotal.toFixed(2)}
- Detected friction: ${frictionType}

Your behavior rules:
1. Be concise and warm — max 2-3 sentences per reply.
2. Ask ONE clarifying question at a time. Never interrogate.
3. Based on what the user says, offer a SPECIFIC resolution:
   - Price hesitation → offer a 10% discount code "SAVE10", or suggest 0% EMI
   - Shipping confusion → clarify timeline, or offer free expedited shipping upgrade
   - Coupon confusion → offer code "WELCOME15" or explain current promotions
   - Exit intent → reassure with 30-day return guarantee + offer 10% off
   - Payment error → suggest alternative: UPI, card retry, or buy-now-pay-later
   - Trust gap → cite return policy, security (SSL), and customer reviews
4. When the user agrees to an offer or says they're ready to proceed, reply with exactly:
   [RESOLVED: <offer_type>] followed by a friendly confirmation message.
   offer_type must be one of: discount_10, free_shipping, discount_15, emi, trust_badge, none
5. Never make up policies. Only offer: 10% off (SAVE10), 15% off (WELCOME15), free expedited shipping, 0% EMI, or 30-day returns.
6. Keep language natural — not robotic. You're a helpful human-like agent.`;
=======
    return runFallbackConversation(session, updatedHistory, userMessage, specializedContext);
  }
}

function buildSystemPrompt(session, specializedContext) {
  const frictionType = session.interventionType ?? 'other';

  return `You are KasparAI, a multi-agent commerce intelligence system. 
Current Session Context:
- Friction: ${frictionType}
- Cart: ${session.cartItems.length} items, Total: $${session.cartTotal.toFixed(2)}
${specializedContext ? `- Agent Insights: ${specializedContext}` : ''}

Behavior:
1. Act as a personal shopping assistant, sales strategist, and behavioral analyst.
2. Be concise (max 3 sentences).
3. If the user is hesitating on price, offer code "SAVE10" (10% off).
4. If the user wants a better deal, offer "WELCOME15" (15% off) but only if they agree to complete the order.
5. If the user asks for recommendations, use the provided Shopping Suggestion or suggest trending items in the same category.
6. When resolved, use [RESOLVED: <offer_type>]. Valid types: discount_10, discount_15, free_shipping, emi, none.`;
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
}

function detectResolution(reply) {
  return reply.includes('[RESOLVED:');
}

function detectOfferType(reply) {
  const match = reply.match(/\[RESOLVED:\s*(\w+)\]/);
  return match ? match[1] : null;
}

<<<<<<< HEAD
// Rule-based fallback when no API key
function runFallbackConversation(session, history, userMessage) {
  const lower = userMessage.toLowerCase();
  let reply = '';
  let resolved = false;
  let offerType = null;

  if (lower.includes('price') || lower.includes('expensive') || lower.includes('cost') || lower.includes('discount')) {
    reply = "I can offer you 10% off right now — use code SAVE10 at checkout. It applies to your entire order. Would you like to apply it?";
  } else if (lower.includes('shipping') || lower.includes('delivery') || lower.includes('fast') || lower.includes('arrive')) {
    reply = "Our standard shipping takes 3–5 business days. I can upgrade you to free expedited shipping (1–2 days) — want me to apply that?";
  } else if (lower.includes('yes') || lower.includes('sure') || lower.includes('ok') || lower.includes('apply') || lower.includes('great')) {
    reply = "[RESOLVED: discount_10] Perfect! Your discount has been applied. Complete your order — your items are reserved for the next 10 minutes. 🎉";
    resolved = true;
    offerType = 'discount_10';
  } else if (lower.includes('return') || lower.includes('refund') || lower.includes('policy')) {
    reply = "We offer a 30-day no-questions-asked return policy on all items. Does that help?";
  } else if (lower.includes('coupon') || lower.includes('code')) {
    reply = "Try WELCOME15 for 15% off your first order. It works on everything in your cart.";
  } else {
    reply = "Happy to help! Is it the price, shipping timeline, or something else holding you back?";
  }

  history.push({ role: 'assistant', content: reply });
  return { reply, resolved, offerType, updatedHistory: history };
=======
function runFallbackConversation(session, history, userMessage, specializedContext) {
  const lower = userMessage.toLowerCase();
  let reply = "";
  
  if (specializedContext) {
    reply = `${specializedContext}. Anything else you need help with?`;
  } else if (lower.includes('price')) {
    reply = "I can offer you 10% off right now — use code SAVE10 at checkout. Would you like to apply it?";
  } else {
    reply = "I'm here to help you find the best products and deals. What's on your mind?";
  }

  history.push({ role: 'assistant', content: reply });
  return { reply, resolved: false, offerType: null, updatedHistory: history };
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
}
