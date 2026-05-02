# Decision Log — Checkout Intelligence Agent

**Project:** Checkout Intelligence Agent  
**Team:** Seven Up  
**Version:** 1.0  
**Last Updated:** 2025

---

## Overview

This document records all significant architectural, technical, and product decisions made during the development of the Checkout Intelligence Agent. Each entry captures the context, the options considered, the decision taken, and the rationale behind it.

---

## Decision Index

| ID | Title | Category | Status |
|----|-------|----------|--------|
| [DEC-001](#dec-001) | Backend Runtime: Node.js over Python | Architecture | Accepted |
| [DEC-002](#dec-002) | AI Provider: OpenAI GPT-4o-mini | AI / ML | Accepted |
| [DEC-003](#dec-003) | Database: MongoDB over PostgreSQL | Data | Accepted |
| [DEC-004](#dec-004) | Frontend Framework: React + Vite | Frontend | Accepted |
| [DEC-005](#dec-005) | Styling: Tailwind CSS 4 | Frontend | Accepted |
| [DEC-006](#dec-006) | Animation Library: Framer Motion | Frontend | Accepted |
| [DEC-007](#dec-007) | Friction Scoring: Server-side with client-side events | Architecture | Accepted |
| [DEC-008](#dec-008) | AI Fallback: Rule-based deterministic system | AI / ML | Accepted |
| [DEC-009](#dec-009) | Multi-Agent Design: Three specialized agents | Architecture | Accepted |
| [DEC-010](#dec-010) | Shopify Integration: GraphQL Admin API | Integration | Accepted |
| [DEC-011](#dec-011) | Conversation Persistence: MongoDB vs in-memory | Data | Accepted |
| [DEC-012](#dec-012) | Offer Strategy: Tiered discount codes | Product | Accepted |
| [DEC-013](#dec-013) | Session Identity: Client-generated UUID | Security | Accepted |
| [DEC-014](#dec-014) | Intervention Trigger: Score threshold + AI classifier | AI / ML | Accepted |
| [DEC-015](#dec-015) | [OPEN] Unresolved git merge conflict in conversation.js | Technical Debt | Open |

---

## Decision Records

---

### DEC-001

**Title:** Backend Runtime — Node.js over Python  
**Date:** 2025  
**Status:** Accepted  
**Category:** Architecture

#### Context
The backend needs to serve a REST API, connect to MongoDB, call the OpenAI API, and integrate with the Shopify Admin API. Two primary runtime options were evaluated.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Node.js + Express** | Shares JS ecosystem with frontend; strong async I/O; OpenAI JS SDK; Shopify JS SDK; Mongoose ORM | Less mature ML tooling natively |
| Python + FastAPI | Richer ML/AI ecosystem; strong typing with Pydantic | Different language from frontend; no advantage for this AI use-case (OpenAI SDK is available in both) |

#### Decision
**Node.js with Express 5** was chosen as the backend runtime.

#### Rationale
- The project's AI logic is entirely delegated to OpenAI APIs — no custom model training or inference is required locally, eliminating Python's ML advantage.
- Using JavaScript across both layers reduces context switching and allows sharing type patterns.
- Express 5 provides modern async/await error handling out of the box.
- The Shopify Admin API has a first-class JavaScript client.

---

### DEC-002

**Title:** AI Provider — OpenAI GPT-4o-mini  
**Date:** 2025  
**Status:** Accepted  
**Category:** AI / ML

#### Context
The system requires two distinct AI capabilities: classifying checkout hesitation reason, and conducting multi-turn conversational recovery with shoppers. The choice of model directly impacts cost, latency, and output quality.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **GPT-4o-mini** | Low cost; fast response; structured JSON output via response_format; sufficient reasoning for e-commerce context | Weaker than GPT-4o on complex reasoning |
| GPT-4o | Highest reasoning quality | ~10x more expensive; higher latency; overkill for discount/shipping conversations |
| Claude Sonnet | Strong instruction following | Adds a second vendor dependency; less widely integrated |
| Local / open-source LLM | No API cost; offline | Requires GPU infrastructure; deployment complexity out of scope |

#### Decision
**GPT-4o-mini** via the OpenAI Chat Completions API was selected for both the hesitation classifier and the conversational recovery engine.

#### Rationale
- The structured JSON `response_format` parameter ensures reliable classifier output without prompt engineering fragility.
- Response times are well within the 2s (p95) latency target.
- Cost is acceptable for a prototype/hackathon-scale deployment.
- The optional nature of the API key (with a full rule-based fallback) means the system works even without a paid account.

---

### DEC-003

**Title:** Database — MongoDB over PostgreSQL  
**Date:** 2025  
**Status:** Accepted  
**Category:** Data

#### Context
The system needs to persist sessions, behavioral event logs, and conversation histories. The data structures are variable — cart items are arbitrary JSON arrays, conversation histories are growing arrays of role/content objects, and event metadata is schema-free.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **MongoDB (Mongoose)** | Schema-flexible; native JSON arrays for cartItems and conversationHistory; horizontal scaling | Weaker JOIN capabilities (not needed here) |
| PostgreSQL | ACID compliance; strong relational queries | Requires serializing JSON arrays (cartItems, history) to JSONB; more setup overhead |
| Redis | Ultra-fast; TTL-based session expiry | Not suitable as primary persistent store for event logs |

#### Decision
**MongoDB with Mongoose 9** was selected.

#### Rationale
- Session documents contain dynamically-shaped arrays (cart items, event logs, conversation history) that map naturally to MongoDB documents without ORM gymnastics.
- Mongoose schemas provide just enough structure (required fields, defaults, types) for data integrity.
- The analytics aggregation pipeline (`$group`, `$match`, `$sum`) is sufficient for the required dashboard queries without needing SQL joins.

---

### DEC-004

**Title:** Frontend Framework — React 19 + Vite 8  
**Date:** 2025  
**Status:** Accepted  
**Category:** Frontend

#### Context
The frontend needs a component-based UI framework to build a multi-page store, checkout flow, and real-time chat widget. Build tool selection affects developer experience and production bundle performance.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **React 19 + Vite 8** | Fastest HMR; React Hooks for complex state; vast ecosystem; Context API for cart state | More boilerplate than Next.js |
| Next.js | SSR/SSG; file-based routing | Overkill for a client-side SPA; SSR adds complexity for auth context |
| Vue 3 + Vite | Simpler reactivity; Options API familiarity | Smaller ecosystem; team more familiar with React |

#### Decision
**React 19 with Vite 8** was chosen.

#### Rationale
- Vite's instant HMR and optimized production builds are ideal for a fast-iteration development cycle.
- React's useContext, useEffect, useCallback, and useRef hooks provide the granular control needed for the friction tracker and chat widget state machine.
- React Router DOM 7 handles client-side navigation without server overhead.
- The team's existing React proficiency reduces ramp-up time.

---

### DEC-005

**Title:** Styling — Tailwind CSS 4  
**Date:** 2025  
**Status:** Accepted  
**Category:** Frontend

#### Context
The UI requires a dark, premium aesthetic with custom color tokens, responsive layouts, and consistent spacing. Options ranged from utility-first CSS to component libraries.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Tailwind CSS 4** | Utility-first; zero unused CSS with JIT; dark mode native; design system through config | Verbose class strings in JSX |
| CSS Modules | Scoped styles; familiar | No design system primitives; more files to manage |
| shadcn/ui + Radix | Accessible components | Harder to achieve a fully custom dark aesthetic; adds component opinions |
| Styled Components | Co-located styles | Runtime CSS-in-JS overhead; harder to scan visually |

#### Decision
**Tailwind CSS 4** with the `@tailwindcss/vite` plugin was chosen.

#### Rationale
- The design requires fine-grained control over spacing, color, and border-radius that a component library would constrain.
- Tailwind 4's new Vite-native plugin eliminates the PostCSS config file overhead.
- Utility classes map directly to design tokens, enforcing visual consistency across pages without a separate design system.

---

### DEC-006

**Title:** Animation Library — Framer Motion  
**Date:** 2025  
**Status:** Accepted  
**Category:** Frontend

#### Context
The checkout page requires smooth animations for: widget open/close, step transitions, modal entry/exit, proactive message rotation, and progress bar fills. Native CSS transitions were evaluated against JS animation libraries.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Framer Motion 12** | Declarative `motion` components; `AnimatePresence` for exit animations; spring physics; layout animations | Bundle size (~50KB gzipped) |
| CSS Transitions + Keyframes | Zero JS overhead | Cannot orchestrate complex enter/exit sequences; no spring physics |
| React Spring | Similar capabilities; tree-shakeable | Less intuitive API for entry/exit paired with conditional rendering |

#### Decision
**Framer Motion 12** was chosen.

#### Rationale
- `AnimatePresence` is critical for the chat widget: it allows the panel to animate out before being unmounted from the DOM — impossible with pure CSS transitions tied to React conditional rendering.
- The declarative `initial / animate / exit` API is readable and maintainable.
- Step transition animations (`x: -20 → 0`, `opacity: 0 → 1`) are concisely expressed.

---

### DEC-007

**Title:** Friction Scoring — Server-side Computation with Client-side Event Emission  
**Date:** 2025  
**Status:** Accepted  
**Category:** Architecture

#### Context
The friction scoring system needs to be reliable, tamper-resistant, and able to trigger server-side AI analysis. Two approaches were evaluated.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Server-side score + client event emission** | Score is authoritative; AI trigger is controlled server-side; tamper-resistant | Extra network call per event |
| Client-side score + API trigger only at threshold | Fewer API calls; faster local feedback | Client can manipulate score; AI trigger logic lives in frontend |

#### Decision
**Server-side friction scoring with client-side event emission** was chosen.

#### Rationale
- The server is the single source of truth for when to trigger AI intervention — this prevents clients from artificially inflating or suppressing scores.
- Persisting all events in MongoDB enables retrospective analysis and replayability.
- The 5-second polling interval for intervention state (`/api/intervention/:sessionId`) provides near-real-time response without WebSocket complexity.

---

### DEC-008

**Title:** AI Fallback — Full Rule-based Deterministic System  
**Date:** 2025  
**Status:** Accepted  
**Category:** AI / ML

#### Context
The system must function in environments where an OpenAI API key is not available (demo mode, CI, development without credentials). An unconditional hard dependency on the API would make the system unusable offline.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Full rule-based fallback** | Zero external dependency; deterministic; fast | Less nuanced than GPT |
| Hard dependency on OpenAI | Simpler code | System non-functional without API key |
| Cached responses | Works offline for known patterns | Stale; no novelty handling |

#### Decision
**A complete rule-based fallback** was implemented for both the hesitation classifier and the conversation engine.

#### Rationale
- The fallback classifier uses event frequency counting — a reliable heuristic that covers the six most common friction types.
- The fallback conversation engine uses keyword matching against common intent phrases and returns pre-written offer responses including [RESOLVED] tokens.
- This ensures the product can be demonstrated end-to-end without any paid API subscription.

---

### DEC-009

**Title:** Multi-Agent Design — Three Specialized Agents  
**Date:** 2025  
**Status:** Accepted  
**Category:** Architecture

#### Context
The conversational recovery system needs to handle diverse user intents: pricing questions, product recommendations, and checkout persuasion. A single monolithic prompt vs. specialized agents was evaluated.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Three specialized agents (Checkout, Pricing, Shopping)** | Separation of concerns; each agent has focused context; extensible | Routing logic adds complexity |
| Single GPT prompt with all capabilities | Simpler | Prompt becomes unwieldy; harder to tune individual behaviors |
| Full LangChain/LangGraph agent framework | Production-grade orchestration | Heavy dependency; over-engineered for current scope |

#### Decision
**Three lightweight ES6 class-based agents** with keyword-based routing were implemented.

#### Rationale
- Each agent encapsulates a coherent domain: pricing logic, shopping recommendations, and checkout persuasion.
- Keyword routing (`price`/`discount` → PricingAgent, `recommend`/`find` → ShoppingAgent, checkout stage → CheckoutAgent) is simple, auditable, and does not require an additional LLM call.
- The architecture allows adding new agents (e.g., a ReturnsPolicyAgent) without restructuring the conversation engine.
- Agent-generated context strings are injected into the GPT system prompt as "Agent Insights", keeping the LLM as the final language generator while specialized agents handle business logic.

---

### DEC-010

**Title:** Shopify Integration — GraphQL Admin API with Mock Fallback  
**Date:** 2025  
**Status:** Accepted  
**Category:** Integration

#### Context
The product catalog must come from a live Shopify store for production use, but the system should be independently developable and demonstrable without a Shopify account.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Shopify Admin GraphQL API + mock fallback** | Real data in production; dev/demo mode without credentials | Two code paths to maintain |
| Shopify Storefront API | Public; no secret token needed | Read-only; no inventory data |
| Mock-only catalog | No integration complexity | Not production-ready |

#### Decision
**Shopify Admin GraphQL API** (`/admin/api/2024-01/graphql.json`) with a comprehensive 30-item mock catalog fallback was implemented.

#### Rationale
- The Admin API provides inventory quantity data needed for "Limited Stock" urgency messaging.
- The GraphQL query fetches only required fields (id, title, description, images, variants, price, inventoryQuantity), minimizing payload size.
- The 30-item mock catalog covers 7 categories (Electronics, Fashion, Home Decor, Beauty, Fitness, Gaming, Accessories) — sufficient for realistic demonstration.
- Automatic fallback on missing credentials or API errors ensures zero disruption in demo environments.

---

### DEC-011

**Title:** Conversation Persistence — MongoDB Document Array  
**Date:** 2025  
**Status:** Accepted  
**Category:** Data

#### Context
Multi-turn conversations must be persisted so that the AI has full context on each user message. Options for storing the history were evaluated.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **MongoDB Session.conversationHistory array** | Co-located with session; single document read on each chat request | Growing array increases document size over long conversations |
| Separate ConversationMessage collection | Normalized; efficient queries | Requires JOIN-like lookups; more complex |
| In-memory (server process) | Fastest | Lost on server restart; not horizontally scalable |
| Redis with TTL | Fast; automatic expiry | Additional infrastructure |

#### Decision
**MongoDB Session document array** was chosen.

#### Rationale
- The maximum realistic conversation length during a checkout session is 10–20 turns, keeping document size well within MongoDB's 16MB BSON limit.
- Co-locating history with session data means a single `Session.findOne()` call retrieves everything the AI needs.
- Session TTL can be managed at the collection level without separate infrastructure.

---

### DEC-012

**Title:** Offer Strategy — Tiered Discount Codes  
**Date:** 2025  
**Status:** Accepted  
**Category:** Product

#### Context
The recovery agent needs to make concrete, actionable offers to hesitating shoppers. The offer structure must be simple enough for the AI to apply consistently and memorable enough for shoppers to use.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Fixed tiered codes (SAVE10, WELCOME15, FREESHIP)** | Easy to communicate in chat; deterministic validation; no backend order mutation | Fixed discount values may not be optimal per shopper |
| Dynamic personalized discounts | Optimal per user | Requires integration with Shopify discount API; complexity |
| Free shipping only | Lower margin impact | Less effective for price-hesitant shoppers |

#### Decision
**Three fixed discount codes** with tiered application logic were implemented:

- `SAVE10` — 10% off, offered for any cart value
- `WELCOME15` — 15% off, offered for carts above $500
- `FREESHIP` — Free standard shipping upgrade

#### Rationale
- Named codes are conversational — the AI can say "use SAVE10" naturally, and the shopper can copy-paste.
- The tiered logic (higher cart value → higher discount) aligns incentive with revenue impact.
- Validation is implemented in `PricingAgent.validateCoupon()` with zero external API dependency.
- Offer types map to a `RESOLVED` token vocabulary (`discount_10`, `discount_15`, `free_shipping`, `emi`, `none`) that both the AI and frontend understand.

---

### DEC-013

**Title:** Session Identity — Client-generated UUID  
**Date:** 2025  
**Status:** Accepted  
**Category:** Security

#### Context
Each checkout session needs a unique identifier to correlate behavioral events, cart state, and conversation history. Authentication is out of scope for v1.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Client-generated UUID stored in localStorage** | No server round-trip to obtain ID; works without auth | Can be spoofed (acceptable for prototype) |
| Server-issued session token | Tamper-resistant | Requires auth endpoint; more infrastructure |
| Browser fingerprint | No storage required | Privacy concerns; unreliable across devices |

#### Decision
**Client-generated UUID** persisted to localStorage was adopted.

#### Rationale
- For a prototype/hackathon deployment, spoof risk is acceptable since no real payment data is processed.
- localStorage persistence means the session survives page refreshes within the same browser tab.
- The pattern is trivially replaceable with a server-issued JWT token in a future security hardening phase.

---

### DEC-014

**Title:** Intervention Trigger — Combined Score Threshold + AI Confidence Filter  
**Date:** 2025  
**Status:** Accepted  
**Category:** AI / ML

#### Context
Triggering the AI agent too eagerly would be disruptive and erode trust; triggering too late means the shopper has already abandoned. The trigger mechanism needed to balance sensitivity with precision.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **Score threshold (≥ 50) + AI confidence filter (> 0.55)** | Two-stage gate prevents false positives; AI adds reason context | Two conditions means slightly slower trigger |
| Score threshold only | Simple; fast | High false positive rate; agent opens for benign browsing |
| AI classifier on every event | Most nuanced | Expensive; high API call volume |
| Exit intent only | Zero false positives for a specific trigger | Misses most pre-abandonment friction types |

#### Decision
**A combined friction score threshold (≥ 50) followed by an AI confidence filter (> 0.55)** was implemented.

#### Rationale
- The score threshold acts as a cheap first gate, ensuring the AI is only invoked for genuinely hesitant sessions.
- The AI confidence filter eliminates ambiguous cases where the classifier is uncertain — emitting `null` when confidence ≤ 0.55 or when the reason is `other`, which triggers a soft score reset to 25 rather than an intervention.
- This two-stage approach keeps AI API costs low while maintaining precision.

---

### DEC-015

**Title:** [OPEN] Unresolved Git Merge Conflict in conversation.js and shopify.js  
**Date:** 2025  
**Status:** Open  
**Category:** Technical Debt

#### Context
During branch integration, a merge conflict was introduced between the HEAD branch and feature branch `3a7b0503def1321cfab6468e55a0ec3afbe34561`. The conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) are present in `backend/utils/conversation.js` and `backend/utils/shopify.js`. Both versions contain valid logic — the HEAD version has more features (OPENING_MESSAGES map, richer fallback), while the feature branch version integrates the multi-agent architecture.

#### Impact
- The backend will **fail to start** if these files are run as-is, because the merge conflict syntax is not valid JavaScript.
- This is a **blocker for production deployment**.

#### Options

| Option | Description |
|--------|-------------|
| **Merge manually (recommended)** | Combine the OPENING_MESSAGES from HEAD with the multi-agent logic from the feature branch; retain the richer fallback conversation handler |
| Accept HEAD version entirely | Loses multi-agent integration |
| Accept feature branch version entirely | Loses OPENING_MESSAGES map and richer fallback |

#### Recommended Resolution
Manually resolve by:
1. Keeping the `OPENING_MESSAGES` map from HEAD.
2. Keeping the multi-agent imports and `getProducts()` function from the feature branch.
3. Merging `buildSystemPrompt` to include both the friction type context (HEAD) and the `specializedContext` injection (feature branch).
4. Using the richer `runFallbackConversation` from HEAD (which emits `[RESOLVED]` tokens).

#### Owner
Team Seven Up — to be resolved before production deployment.

---

## Change History

| Date | Entry | Change |
|------|-------|--------|
| 2025 | DEC-001 through DEC-014 | Initial decision log created |
| 2025 | DEC-015 | Merge conflict documented as open issue |

---

*This document is maintained by Team Seven Up. All decisions should be reviewed and updated as the project evolves.*
