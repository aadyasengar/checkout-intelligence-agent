# Checkout Intelligence Agent

> An AI-powered checkout recovery platform that detects shopper hesitation in real time and intervenes with a conversational agent to reduce cart abandonment.

Built by **Team Seven Up**.

---

## What It Does

When a shopper stalls during checkout — idling on the payment page, toggling shipping options, failing a coupon code, or moving toward exit — the system automatically:

1. **Scores the friction** based on behavioral events
2. **Classifies the hesitation reason** using GPT-4o-mini
3. **Opens KasparAI**, a chat widget that offers targeted help (discounts, shipping upgrades, trust reassurance)
4. **Recovers the sale** through a natural conversation

Everything works without an OpenAI API key too — a full rule-based fallback kicks in automatically.

---

## Demo

| Page | Description |
|------|-------------|
| `/` | Landing page |
| `/store` | Product catalog (30 items across 7 categories) |
| `/checkout` | Full checkout flow with live KasparAI agent |
| `/dashboard` | Analytics — recovered revenue, interventions, conversion lift |

---

## Tech Stack

**Frontend**
- React 19 + Vite 8
- Tailwind CSS 4
- Framer Motion 12
- React Router DOM 7
- Axios, Lucide React

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose 9
- OpenAI SDK (`gpt-4o-mini`)
- Shopify Admin GraphQL API

---

## Project Structure

```
checkout-intelligence-agent/
├── backend/
│   ├── agents/
│   │   ├── CheckoutAgent.js      # Hesitation analysis + persuasion
│   │   ├── PricingAgent.js       # Discount generation + coupon validation
│   │   └── ShoppingAgent.js      # Product recommendations + search
│   ├── models/
│   │   ├── Session.js            # Checkout session schema
│   │   └── EventLog.js           # Behavioral event schema
│   ├── utils/
│   │   ├── analyzer.js           # GPT-4o-mini hesitation classifier
│   │   ├── conversation.js       # Multi-turn recovery engine
│   │   └── shopify.js            # Shopify GraphQL client + mock catalog
│   ├── server.js                 # Express app + API routes
│   └── .env.template
└── frontend/
    ├── src/
    │   ├── context/              # CartContext, AuthContext
    │   ├── hooks/
    │   │   └── useCheckoutTracker.js   # Behavioral event tracker
    │   └── pages/
    │       ├── Store.jsx
    │       ├── Checkout.jsx      # Main checkout + KasparAI widget
    │       └── Dashboard.jsx
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) OpenAI API key
- (Optional) Shopify store credentials

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**Backend** — copy `.env.template` to `.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/checkout-recovery
PORT=5000

# Optional — enables GPT-4o-mini. Falls back to rule-based logic if missing.
OPENAI_API_KEY=your_openai_api_key

# Optional — enables live product catalog. Falls back to 30-item mock catalog if missing.
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
```

**Frontend** — copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start the App

```bash
# Terminal 1 — backend (auto-restarts with nodemon)
cd backend
npm run dev

# Terminal 2 — frontend (Vite HMR)
cd frontend
npm run dev
```

Open **http://localhost:5173** — the store is live.

> The app works fully without any API keys. Mock products load automatically and the rule-based fallback handles all AI interactions.

---

## How the Agent Works

### Friction Scoring

Every behavioral event increments a session score (0–100):

| Event | Score |
|-------|-------|
| Exit intent | +30 |
| Coupon failed | +25 |
| Idle on checkout | +20 |
| Payment error | +20 |
| Shipping method changed | +15 |
| Price hover | +15 |
| Address edited | +10 |
| Cart modified | +10 |

When the score hits **50**, the AI classifier runs.

### Hesitation Classification

GPT-4o-mini receives the full event log and session context, and returns one of:

`price hesitation` · `shipping confusion` · `coupon confusion` · `exit intent` · `payment error` · `trust gap` · `other`

Only classifications with **confidence > 0.55** trigger an intervention.

### KasparAI Recovery

The widget opens with a friction-specific message and runs a multi-turn conversation powered by three specialized agents:

- **CheckoutAgent** — persuasion copy and navigation analysis
- **PricingAgent** — discount offers (`SAVE10`, `WELCOME15`) and coupon validation
- **ShoppingAgent** — product recommendations and catalog search

When the shopper accepts an offer, the AI emits `[RESOLVED: <offer_type>]` and the session is marked complete.

### Discount Codes

| Code | Discount | Trigger |
|------|----------|---------|
| `SAVE10` | 10% off | Any cart |
| `WELCOME15` | 15% off | Carts > $500 |
| `FREESHIP` | Free shipping | Shipping confusion |

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Fetch product catalog |
| `POST` | `/api/sessions` | Create or update a session |
| `POST` | `/api/events` | Log a behavioral event |
| `GET` | `/api/intervention/:sessionId` | Poll for intervention trigger |
| `POST` | `/api/chat` | Send a message to KasparAI |
| `POST` | `/api/sessions/:sessionId/complete` | Mark checkout as complete |
| `GET` | `/api/analytics` | Aggregated recovery analytics |

---

## Known Issues

- **Merge conflict** in `backend/utils/conversation.js` and `backend/utils/shopify.js` — conflict markers from a branch merge are present and must be resolved before the backend will start. See the Decision Log for the recommended resolution.
- Payment fields are UI prototypes only — no real charges are processed.
- The analytics dashboard uses mock chart data; live wiring to `/api/analytics` is pending.

---

## Team

**Seven Up**
