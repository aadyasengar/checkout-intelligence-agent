import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
<<<<<<< HEAD
import {
  ShoppingCart, Plus, CheckCircle, Bot, X, Sparkles, Clock, TrendingUp,
  Send, Loader2, Search, SlidersHorizontal, Star, Zap, Flame, Tag,
  ChevronDown, Heart, Eye, BarChart2, ArrowUpDown, Filter, Package
=======
import { 
  ShoppingCart, Plus, CheckCircle, Bot, X, Sparkles, Clock, TrendingUp, 
  Send, Loader2, Filter, ChevronDown, Star, Zap, Eye, ShoppingBag, ArrowUpDown
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

<<<<<<< HEAD
// ─── Tag config ────────────────────────────────────────────────────────────────
const TAG_STYLES = {
  'Best Seller':   { bg: 'bg-amber-500/20',  text: 'text-amber-400',  icon: <Flame  className="w-3 h-3" /> },
  'Trending':      { bg: 'bg-blue-500/20',   text: 'text-blue-400',   icon: <TrendingUp className="w-3 h-3" /> },
  'Limited Stock': { bg: 'bg-red-500/20',    text: 'text-red-400',    icon: <Zap    className="w-3 h-3" /> },
  'New Arrival':   { bg: 'bg-emerald-500/20',text: 'text-emerald-400',icon: <Sparkles className="w-3 h-3" /> },
};

// ─── Bundle suggestions ────────────────────────────────────────────────────────
const BUNDLE_SUGGESTIONS = {
  Electronics: ['Accessories', 'Gaming'],
  Gaming:      ['Electronics', 'Accessories'],
  Fitness:     ['Beauty', 'Accessories'],
  Fashion:     ['Accessories', 'Beauty'],
  Beauty:      ['Fashion', 'Home Decor'],
};

// ─── AI trigger messages ───────────────────────────────────────────────────────
const BROWSE_TRIGGERS = {
  long_hover:        (p) => `👀 Loving "${p}"? It's been purchased 120+ times this week. Want me to reserve it or check for a discount?`,
  multiple_views:    (p) => `🔁 You keep coming back to "${p}" — it's calling you! I can apply code **SAVE10** for 10% off if price is the concern.`,
  cart_then_back:    ()  => '🛒 You added something but came back to browse. Comparing options? I can shortlist the best value bundles for you!',
  idle_30s:          ()  => '👋 Taking your time? Tell me your budget or style and I\'ll handpick the best products for you.',
  idle_60s:          ()  => '🎁 Still browsing? Use **SAVE10** at checkout for 10% off anything in your cart. Limited-time offer!',
  first_add:         (p) => `✅ Great choice adding "${p}"! Want me to find complementary items that pair perfectly with it?`,
  search_typed:      (q) => `🔍 Searching for "${q}"? I can help narrow it down — tell me your budget or preference and I'll do the hard work.`,
  high_scroll_no_click: () => '🤔 Too many options? Let me shortlist the 3 best products based on ratings, value and what others pair together.',
  repeat_category:   (c) => `📂 You keep browsing ${c} — looks like that's your focus! Want me to show only the top-rated ${c} picks?`,
  wishlist_add:      (p) => `💛 "${p}" saved to wishlist! I can alert you when it goes on sale, or apply a discount now if you're ready.`,
  compare_mode:      ()  => '⚖️ Comparing products? I can give you a side-by-side breakdown of specs, ratings and value for money.',
};

const STORE_PROACTIVE = [
  '👋 Need help picking the right item? Just describe what you\'re looking for!',
  '💡 Pro tip: **SAVE10** gives you 10% off at checkout — works on everything!',
  '🚀 Free express shipping available on orders over $150 — ask me how!',
  '⭐ Want a recommendation? Tell me your budget and I\'ll find the best pick.',
  '🎁 Bundle 2+ items from the same category for maximum value — I can suggest combos!',
  '🔥 Our Best Sellers are restocking fast — grab yours before they\'re gone!',
];

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'trending',   label: 'Trending' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'discount',   label: 'Biggest Discount' },
];

const CATEGORIES = ['All', 'Electronics', 'Gaming', 'Fashion', 'Fitness', 'Beauty', 'Home Decor', 'Accessories'];

// ─── Star rating component ─────────────────────────────────────────────────────
function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'}`} />
        ))}
      </div>
      <span className="text-zinc-400 text-xs">{rating.toFixed(1)}</span>
      <span className="text-zinc-600 text-xs">({count.toLocaleString()})</span>
    </div>
  );
}

// ─── Main Store component ──────────────────────────────────────────────────────
export default function Store() {
  const [allProducts, setAllProducts]     = useState([]);
  const [loading, setLoading]             = useState(true);
  const [added, setAdded]                 = useState({});
  const [wishlist, setWishlist]           = useState({});
  const [compareList, setCompareList]     = useState([]);
  const { addToCart, cart, sessionId }    = useCart();

  // Filters & sort
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy]               = useState('default');
  const [searchQuery, setSearchQuery]     = useState('');
  const [showFilters, setShowFilters]     = useState(false);
  const [maxPrice, setMaxPrice]           = useState(600);
  const [inStockOnly, setInStockOnly]     = useState(false);

  // Session behaviour tracking
  const categoryVisits  = useRef({});   // category → count
  const scrollDepth     = useRef(0);
  const clickCount      = useRef(0);
  const searchTyped     = useRef(false);

  // AI Agent
  const [agentVisible, setAgentVisible]   = useState(false);
  const [chatOpen, setChatOpen]           = useState(false);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [typing, setTyping]               = useState(false);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [snackbar, setSnackbar]           = useState(null);

  // Tracking refs
  const hoverTimers      = useRef({});
  const viewCounts       = useRef({});
  const cartCountRef     = useRef(cart.length);
  const hadCartItems     = useRef(false);
  const proactiveCount   = useRef(0);
  const triggerLock      = useRef(false);
  const chatEndRef       = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(r => { setAllProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── Filtered & sorted products ─────────────────────────────────────────────
  const products = useMemo(() => {
    let list = [...allProducts];

    // Category filter
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Price filter
    list = list.filter(p => {
      const minPrice = Math.min(...p.variants.map(v => v.price));
      return minPrice <= maxPrice;
    });

    // In-stock filter
    if (inStockOnly) {
      list = list.filter(p => p.variants.some(v => (v.inventory ?? 99) > 0));
    }

    // Sort
    switch (sortBy) {
      case 'trending':   list.sort((a, b) => (b.tags?.includes('Trending') ? 1 : 0) - (a.tags?.includes('Trending') ? 1 : 0)); break;
      case 'rating':     list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      case 'price_asc':  list.sort((a, b) => Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price))); break;
      case 'price_desc': list.sort((a, b) => Math.min(...b.variants.map(v => v.price)) - Math.min(...a.variants.map(v => v.price))); break;
      case 'discount':   list.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
      default: break;
    }

    return list;
  }, [allProducts, activeCategory, searchQuery, sortBy, maxPrice, inStockOnly]);

  // ── Cart tracking ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (cart.length > cartCountRef.current) hadCartItems.current = true;
    if (hadCartItems.current && cart.length < cartCountRef.current) fireStoreAgent('cart_then_back');
    cartCountRef.current = cart.length;
  }, [cart.length]);

  // ── Scroll depth tracking ──────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const depth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      if (depth > scrollDepth.current) {
        scrollDepth.current = depth;
        // Scrolled far but no click → trigger
        if (depth > 60 && clickCount.current === 0) {
          fireStoreAgent('high_scroll_no_click');
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Category visit tracking ────────────────────────────────────────────────
  useEffect(() => {
    if (activeCategory !== 'All') {
      categoryVisits.current[activeCategory] = (categoryVisits.current[activeCategory] || 0) + 1;
      if (categoryVisits.current[activeCategory] >= 3) {
        fireStoreAgent('repeat_category', activeCategory);
      }
    }
  }, [activeCategory]);

  // ── Search typing trigger ──────────────────────────────────────────────────
  useEffect(() => {
    if (searchQuery.length >= 3 && !searchTyped.current) {
      searchTyped.current = true;
      setTimeout(() => {
        fireStoreAgent('search_typed', searchQuery);
        searchTyped.current = false;
      }, 1500);
    }
  }, [searchQuery]);

  // ── Proactive 10-second tick ───────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      proactiveCount.current += 1;
      const msg = STORE_PROACTIVE[(proactiveCount.current - 1) % STORE_PROACTIVE.length];
      if (agentVisible && chatOpen) {
        addAssistantMessage(msg);
      } else if (agentVisible && !chatOpen) {
        setUnreadCount(c => c + 1);
      } else if (proactiveCount.current === 3) {
        showSnackbar('👋 KasparAI can help you choose — tap to chat!', () => fireStoreAgent('idle_30s'));
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [agentVisible, chatOpen]);

  // ── Idle detection ─────────────────────────────────────────────────────────
  useEffect(() => {
    let idleSeconds = 0;
    const resetIdle = () => { idleSeconds = 0; };
    const tick = setInterval(() => {
      idleSeconds += 5;
      if (idleSeconds === 30) fireStoreAgent('idle_30s');
      if (idleSeconds === 60) fireStoreAgent('idle_60s');
    }, 5000);
    ['mousemove', 'keypress', 'scroll', 'click'].forEach(e => window.addEventListener(e, resetIdle));
    return () => {
      clearInterval(tick);
      ['mousemove', 'keypress', 'scroll', 'click'].forEach(e => window.removeEventListener(e, resetIdle));
    };
  }, []);

  // ── Agent helpers ──────────────────────────────────────────────────────────
  const addAssistantMessage = (content) => {
    setMessages(prev => [...prev, { role: 'assistant', content }]);
    if (!chatOpen) setUnreadCount(c => c + 1);
  };

  const showSnackbar = (text, onClick = null) => {
    setSnackbar({ text, onClick });
    setTimeout(() => setSnackbar(null), 6000);
  };

  const fireStoreAgent = useCallback((triggerKey, payload = '') => {
    if (triggerLock.current) return;
    const msgFn = BROWSE_TRIGGERS[triggerKey];
    if (!msgFn) return;
    const msg = msgFn(payload);
    if (agentVisible && chatOpen) {
      addAssistantMessage(msg);
    } else if (agentVisible && !chatOpen) {
      setUnreadCount(c => c + 1);
    } else {
      setAgentVisible(true);
      setChatOpen(true);
      setMessages([{ role: 'assistant', content: msg }]);
    }
    triggerLock.current = true;
    setTimeout(() => { triggerLock.current = false; }, 20000);
  }, [agentVisible, chatOpen]);

  // ── Product hover ──────────────────────────────────────────────────────────
  const handleProductMouseEnter = (product) => {
    viewCounts.current[product.id] = (viewCounts.current[product.id] || 0) + 1;
    hoverTimers.current[product.id] = setTimeout(() => {
      if (viewCounts.current[product.id] >= 2) {
        fireStoreAgent('multiple_views', product.title);
      } else {
        fireStoreAgent('long_hover', product.title);
=======
const CATEGORIES = ["All", "Electronics", "Gaming", "Fashion", "Home Decor", "Accessories", "Beauty", "Fitness"];

const BROWSE_TRIGGERS = {
  long_hover: (product) => ({
    title: "Eyeing this? 👀",
    message: `The "${product}" is a top pick today. Over 120 people purchased it this week!`,
    action: "Need more details?"
  }),
  repeat_visit: (product) => ({
    title: "Still thinking? 🤔",
    message: `You've checked "${product}" a few times now. Want me to compare it with similar items or check for a special deal?`,
    action: "Compare now"
  }),
  idle_user: () => ({
    title: "Need a hand? 👋",
    message: "Too many options? I can curate a shortlist based on your style and budget.",
    action: "Shortlist for me"
  }),
  high_scroll: () => ({
    title: "Finding what you need? 🔍",
    message: "You've scrolled through a lot! Tell me what's on your mind and I'll find the perfect match.",
    action: "Ask KasparAI"
  }),
  cart_hesitation: () => ({
    title: "Wait, don't miss out! 🔥",
    message: "Items in your cart are trending and might sell out soon. Complete your order now for priority delivery.",
    action: "Go to Checkout"
  })
};

export default function Store() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popularity");
  const [added, setAdded] = useState({});
  const { addToCart, cart, sessionId } = useCart();

  // Agent state
  const [agentVisible, setAgentVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [trigger, setTrigger] = useState(null);

  // Tracking refs
  const hoverTimers = useRef({});
  const viewCounts = useRef({});
  const scrollDepth = useRef(0);
  const idleStartTime = useRef(Date.now());
  const triggerLock = useRef(false);
  const lastTriggerTime = useRef(0);

  useEffect(() => {
    axios.get(`${API_URL}/products`)
      .then(r => { 
        setProducts(r.data); 
        setFilteredProducts(r.data);
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtering & Sorting
  useEffect(() => {
    let result = [...products];
    if (activeCategory !== "All") {
      result = result.filter(p => p.category === activeCategory);
    }

    if (sortBy === "price_low") result.sort((a, b) => a.variants[0].price - b.variants[0].price);
    else if (sortBy === "price_high") result.sort((a, b) => b.variants[0].price - a.variants[0].price);
    else if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "popularity") result.sort((a, b) => b.reviews - a.reviews);

    setFilteredProducts(result);
  }, [activeCategory, sortBy, products]);

  // Behavior Tracking
  useEffect(() => {
    const handleScroll = () => {
      const depth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (depth > 0.8 && scrollDepth.current <= 0.8) {
        fireTrigger('high_scroll');
      }
      scrollDepth.current = depth;
    };

    const handleMouseMove = () => { idleStartTime.current = Date.now(); };
    
    const idleCheck = setInterval(() => {
      if (Date.now() - idleStartTime.current > 30000 && !triggerLock.current) {
        fireTrigger('idle_user');
      }
    }, 5000);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(idleCheck);
    };
  }, []);

  const fireTrigger = useCallback((key, payload = '') => {
    const now = Date.now();
    if (triggerLock.current || now - lastTriggerTime.current < 45000) return;
    
    const data = BROWSE_TRIGGERS[key](payload);
    setTrigger(data);
    lastTriggerTime.current = now;
    
    // Auto-hide trigger after 10s if not interacted with
    setTimeout(() => setTrigger(null), 10000);
  }, []);

  const handleProductMouseEnter = (product) => {
    viewCounts.current[product.id] = (viewCounts.current[product.id] || 0) + 1;
    hoverTimers.current[product.id] = setTimeout(() => {
      if (viewCounts.current[product.id] >= 3) {
        fireTrigger('repeat_visit', product.title);
      } else {
        fireTrigger('long_hover', product.title);
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
      }
    }, 8000);
  };

  const handleProductMouseLeave = (productId) => {
    clearTimeout(hoverTimers.current[productId]);
  };

<<<<<<< HEAD
  // ── Add to cart ────────────────────────────────────────────────────────────
  const handleAdd = (product, variant) => {
    clickCount.current += 1;
    addToCart(product, variant);
    setAdded(prev => ({ ...prev, [variant.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [variant.id]: false })), 1500);
    if (!hadCartItems.current) {
      setTimeout(() => fireStoreAgent('first_add', product.title), 800);
    }

    // Bundle suggestion after first add
    const relatedCats = BUNDLE_SUGGESTIONS[product.category] || [];
    if (relatedCats.length > 0 && hadCartItems.current) {
      setTimeout(() => {
        showSnackbar(
          `💡 Customers also buy items from ${relatedCats[0]} — want me to show pairings?`,
          () => { setActiveCategory(relatedCats[0]); }
        );
      }, 1200);
    }

    axios.post(`${API_URL}/events`, {
      sessionId,
      eventType: 'add_to_cart',
      metadata: { product: product.title, variant: variant.title, price: variant.price, category: product.category }
    }).catch(() => {});
  };

  // ── Wishlist ───────────────────────────────────────────────────────────────
  const toggleWishlist = (product) => {
    const isNew = !wishlist[product.id];
    setWishlist(prev => ({ ...prev, [product.id]: !prev[product.id] }));
    if (isNew) setTimeout(() => fireStoreAgent('wishlist_add', product.title), 600);
  };

  // ── Compare ───────────────────────────────────────────────────────────────
  const toggleCompare = (product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 3) return prev;
      const next = [...prev, product];
      if (next.length === 2) setTimeout(() => fireStoreAgent('compare_mode'), 400);
      return next;
    });
  };

  // ── Chat send ──────────────────────────────────────────────────────────────
=======
  const handleAdd = (product, variant) => {
    addToCart(product, variant);
    setAdded(prev => ({ ...prev, [variant.id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [variant.id]: false })), 1500);
    
    axios.post(`${API_URL}/events`, {
      sessionId,
      eventType: 'add_to_cart',
      metadata: { product: product.title, price: variant.price }
    }).catch(() => {});
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
      addAssistantMessage(res.data.reply.replace(/\[RESOLVED:\s*\w+\]\s*/g, '').trim());
    } catch {
      addAssistantMessage('Sorry, had a hiccup! Please try again. 😊');
=======
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of trouble connecting. Try again?" }]);
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
    } finally {
      setTyping(false);
    }
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

<<<<<<< HEAD
  // ── Helpers ────────────────────────────────────────────────────────────────
  const getDiscountedPrice = (price, discount) =>
    discount ? price * (1 - discount / 100) : price;

  const getLowStock = (variants) =>
    variants.some(v => v.inventory !== undefined && v.inventory < 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Store</h1>
          <p className="text-zinc-400 mt-1 text-sm">{allProducts.length} curated products · KasparAI assists every step</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setAgentVisible(true);
              setChatOpen(o => !o);
              setUnreadCount(0);
              if (messages.length === 0) {
                setMessages([{ role: 'assistant', content: "👋 Hi! I'm KasparAI. Tell me your budget or what you're looking for and I'll find the best picks for you. Or ask about any product!" }]);
              }
            }}
            className="relative flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
          >
            <Bot className="w-4 h-4" />
            Ask AI
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                {unreadCount}
              </div>
            )}
          </button>
          {cartCount > 0 && (
            <Link to="/checkout" className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors text-sm">
              <ShoppingCart className="w-4 h-4" />
              Checkout ({cartCount})
            </Link>
          )}
        </div>
      </div>

      {/* ── Compare bar ── */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl px-4 py-3 flex items-center gap-3 flex-wrap"
          >
            <BarChart2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-blue-300 text-sm font-medium">Comparing:</span>
            {compareList.map(p => (
              <div key={p.id} className="flex items-center gap-1.5 bg-blue-500/20 rounded-lg px-2.5 py-1 text-xs text-blue-200">
                {p.title.split(' ').slice(0, 3).join(' ')}
                <button onClick={() => toggleCompare(p)}><X className="w-3 h-3 hover:text-white" /></button>
              </div>
            ))}
            <button
              onClick={() => fireStoreAgent('compare_mode')}
              className="ml-auto text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <Bot className="w-3 h-3" /> Get AI comparison
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search + Sort row ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, categories…"
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 text-sm outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-9 py-2.5 text-white text-sm outline-none focus:border-blue-500/50 cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
          <button
            onClick={() => setShowFilters(o => !o)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* ── Expanded filters ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-5"
          >
            <div className="bg-white/3 border border-white/8 rounded-2xl p-4 flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="text-zinc-400 text-xs font-medium mb-2 block">Max Price: ${maxPrice}</label>
                <input
                  type="range" min={20} max={600} value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>$20</span><span>$600</span></div>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => setInStockOnly(o => !o)}
                    className={`w-10 h-5 rounded-full transition-colors ${inStockOnly ? 'bg-blue-600' : 'bg-white/10'} relative`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${inStockOnly ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-zinc-300 text-sm">In stock only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-7 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-white text-black'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/8'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Results count ── */}
      {!loading && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-zinc-500 text-sm">
            {searchQuery ? `${products.length} results for "${searchQuery}"` : `${products.length} products`}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </p>
          {(searchQuery || activeCategory !== 'All' || inStockOnly) && (
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); setInStockOnly(false); }}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Product grid ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Package className="w-12 h-12 text-zinc-700" />
          <p className="text-zinc-400 text-lg">No products found</p>
          <button
            onClick={() => fireStoreAgent('search_typed', searchQuery)}
            className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
          >
            <Bot className="w-4 h-4" /> Ask KasparAI for suggestions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product, i) => {
            const minPrice = Math.min(...product.variants.map(v => v.price));
            const discountedPrice = getDiscountedPrice(minPrice, product.discount);
            const isLowStock = getLowStock(product.variants);
            const isWishlisted = wishlist[product.id];
            const isComparing = compareList.some(p => p.id === product.id);

            return (
=======
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Section */}
        <div className="mb-12 relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" />
                AI-Powered Shopping Experience
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Curated Collection</h1>
              <p className="text-zinc-400 mt-4 max-w-lg text-lg">
                Discover the best in tech, fashion, and lifestyle. KasparAI is watching your preferences to give you the best deals.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => { setAgentVisible(true); setChatOpen(true); }}
                className="group relative flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                <Bot className="w-5 h-5" />
                Ask Assistant
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
              </button>
              {cartCount > 0 && (
                <Link to="/checkout" className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-white/10 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all">
                  <ShoppingBag className="w-5 h-5" />
                  Cart ({cartCount})
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                  activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 text-zinc-500 text-sm mr-2">
              <ArrowUpDown className="w-4 h-4" />
              Sort by:
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
            ))
          ) : (
            filteredProducts.map((product, i) => (
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
                transition={{ delay: Math.min(i * 0.04, 0.4) }}
                onMouseEnter={() => handleProductMouseEnter(product)}
                onMouseLeave={() => handleProductMouseLeave(product.id)}
                className="bg-[#0f0f13] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all group flex flex-col"
              >
                {/* Image area */}
                <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                  )}

                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Wishlist + Compare */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60'}`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleCompare(product)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center backdrop-blur-sm transition-colors ${isComparing ? 'bg-blue-600 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60'}`}
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Category pill */}
                  <div className="absolute bottom-2.5 left-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs bg-black/60 backdrop-blur-sm text-zinc-300 px-2 py-1 rounded-lg">{product.category}</span>
                  </div>

                  {/* Tags */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {product.tags?.slice(0, 2).map(tag => {
                      const s = TAG_STYLES[tag];
                      return s ? (
                        <div key={tag} className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${s.bg} ${s.text}`}>
                          {s.icon}
                          {tag}
                        </div>
                      ) : null;
                    })}
                  </div>

                  {/* Discount badge */}
                  {product.discount > 0 && (
                    <div className="absolute bottom-2.5 right-2.5 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 mb-1">{product.title}</h3>
                    <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                  </div>

                  {product.rating && (
                    <StarRating rating={product.rating} count={product.reviewCount} />
                  )}

                  {/* Price + stock */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div>
                      <span className="font-bold text-white text-base">${discountedPrice.toFixed(2)}</span>
                      {product.discount > 0 && (
                        <span className="ml-2 text-zinc-600 line-through text-xs">${minPrice.toFixed(2)}</span>
                      )}
                    </div>
                    {isLowStock && (
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <Clock className="w-3 h-3" />
                        Low stock
                      </div>
                    )}
                  </div>

                  {/* Variant add buttons */}
                  <div className="space-y-1.5 mt-1">
                    {product.variants.slice(0, 2).map(variant => (
                      <div key={variant.id} className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">{variant.title === 'Default Title' ? '' : variant.title}</span>
                        <button
                          onClick={() => handleAdd(product, variant)}
                          disabled={variant.inventory === 0}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          {added[variant.id]
                            ? <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Added!</>
                            : <><Plus className="w-3.5 h-3.5" /> Add</>
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Snackbar ── */}
      <AnimatePresence>
        {snackbar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-40 max-w-sm"
          >
            <button
              onClick={() => { snackbar.onClick?.(); setSnackbar(null); }}
              className="bg-zinc-800 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm shadow-xl hover:bg-zinc-700 transition-colors flex items-center gap-2 text-left"
            >
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              {snackbar.text}
            </button>
=======
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => handleProductMouseEnter(product)}
                onMouseLeave={() => handleProductMouseLeave(product.id)}
                className="group relative bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
              >
                {/* Image & Badges */}
                <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.tags?.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                        {tag === "Trending" && <TrendingUp className="w-3 h-3 text-blue-400" />}
                        {tag === "Best Seller" && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        {tag === "New Arrival" && <Zap className="w-3 h-3 text-emerald-400" />}
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg flex items-center gap-1 text-xs font-bold">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {product.rating}
                  </div>

                  {/* Quick Add Button (Hover) */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <button 
                      onClick={() => handleAdd(product, product.variants[0])}
                      className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-95 transition-all"
                    >
                      {added[product.variants[0].id] ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Plus className="w-5 h-5" />}
                      {added[product.variants[0].id] ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{product.category}</span>
                    <span className="text-zinc-500 text-xs">{product.reviews} reviews</span>
                  </div>
                  <h3 className="font-bold text-lg leading-tight group-hover:text-blue-400 transition-colors">{product.title}</h3>
                  <p className="text-zinc-500 text-sm mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-2xl font-black">${product.variants[0].price.toFixed(2)}</div>
                    {product.variants[0].inventory < 10 && (
                      <div className="text-[10px] font-bold text-red-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ONLY {product.variants[0].inventory} LEFT
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Trigger Popup */}
      <AnimatePresence>
        {trigger && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-32 right-8 z-40 max-w-[320px]"
          >
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-blue-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="font-bold">{trigger.title}</div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">{trigger.message}</p>
              <button 
                onClick={() => { setAgentVisible(true); setChatOpen(true); setTrigger(null); }}
                className="w-full py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-zinc-200 transition-colors"
              >
                {trigger.action}
              </button>
              <button 
                onClick={() => setTrigger(null)}
                className="absolute top-4 right-4 text-zinc-600 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
          </motion.div>
        )}
      </AnimatePresence>

<<<<<<< HEAD
      {/* ── KasparAI Store Agent ── */}
      <AnimatePresence>
        {agentVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[340px] shadow-2xl"
          >
            {/* Header */}
            <div
              onClick={() => { setChatOpen(o => !o); setUnreadCount(0); }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-4 py-3 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">KasparAI</div>
                  <div className="text-blue-200 text-xs">Shopping Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
                <X className="w-4 h-4 text-white/60 hover:text-white" onClick={e => { e.stopPropagation(); setAgentVisible(false); setUnreadCount(0); }} />
              </div>
            </div>

            {/* Chat panel */}
            <AnimatePresence>
              {chatOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="bg-white border-x border-b border-zinc-200 rounded-b-2xl flex flex-col" style={{ maxHeight: 400 }}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 300 }}>
                      {messages.map((m, i) => (
                        <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-blue-100' : 'bg-zinc-100'}`}>
                            {m.role === 'assistant' ? <Bot className="w-3.5 h-3.5 text-blue-600" /> : <div className="w-3.5 h-3.5 rounded-full bg-zinc-400" />}
                          </div>
                          <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant' ? 'bg-zinc-100 text-zinc-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
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

                    {/* Quick action chips */}
                    {messages.length <= 1 && (
                      <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
                        {['Best deal under $100', 'Top rated picks', 'Bundle suggestions'].map(chip => (
                          <button
                            key={chip}
                            onClick={() => { setInput(chip); }}
                            className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-3 border-t border-zinc-100 flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask about products, discounts…"
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
=======
      {/* Floating Agent Button */}
      {!chatOpen && (
        <button
          onClick={() => { setAgentVisible(true); setChatOpen(true); }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 hover:scale-110 active:scale-95 transition-all z-50 group"
        >
          <Bot className="w-8 h-8 text-white" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
          <div className="absolute right-20 bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with KasparAI
          </div>
        </button>
      )}

      {/* Chat Sidebar/Overlay */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-zinc-900 border-l border-white/10 z-[60] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">KasparAI</div>
                  <div className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Personal Shopping Assistant</div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-6 h-6 text-zinc-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">How can I help you?</h3>
                  <p className="text-zinc-500 text-sm">
                    I can recommend products, find best-sellers, or help you with your order.
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-xs text-zinc-500 font-medium">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-zinc-900/50">
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask KasparAI..."
                  className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-14"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || typing}
                  className="absolute right-2 top-2 bottom-2 w-10 bg-blue-600 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
