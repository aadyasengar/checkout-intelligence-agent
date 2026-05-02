import fetch from 'node-fetch';

export async function fetchShopifyProducts() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
<<<<<<< HEAD
  const token  = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    console.warn('Shopify credentials missing. Returning mock data for development.');
    return mockProducts;
  }

  const query = `{
    products(first: 30) {
      edges {
        node {
          id title description
          images(first: 1) { edges { node { url } } }
          variants(first: 10) {
            edges { node { id title price inventoryQuantity } }
=======
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    console.warn("Shopify credentials missing. Returning mock data for development.");
    return mockProducts;
  }

  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            description
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price
                  inventoryQuantity
                }
              }
            }
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
          }
        }
      }
    }
<<<<<<< HEAD
  }`;
=======
  `;
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561

  try {
    const response = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
<<<<<<< HEAD
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (data.errors) throw new Error('Failed to fetch products from Shopify');
    return mapShopifyProducts(data.data.products.edges);
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return mockProducts;
=======
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    if (data.errors) {
      console.error("Shopify GraphQL Errors:", data.errors);
      throw new Error("Failed to fetch products from Shopify");
    }

    return mapShopifyProducts(data.data.products.edges);
  } catch (error) {
    console.error("Shopify fetch error:", error);
    return mockProducts; // fallback for resilience
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
  }
}

function mapShopifyProducts(edges) {
<<<<<<< HEAD
  return edges.map(({ node }) => ({
    id:          node.id,
    title:       node.title,
    description: node.description,
    image:       node.images.edges[0]?.node?.url || null,
    variants:    node.variants.edges.map(v => ({
      id:        v.node.id,
      title:     v.node.title,
      price:     parseFloat(v.node.price),
      inventory: v.node.inventoryQuantity,
    })),
  }));
}

// ─── Expanded Mock Catalog — 18 products · 7 categories ────────────────────
const mockProducts = [
  // Electronics
  {
    id: 'elec_1',
    title: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with 30-hour battery life. Adaptive Sound Control adjusts settings based on your activity and surroundings.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 2847,
    tags: ['Best Seller', 'Trending'],
    discount: 18,
    variants: [
      { id: 'elec_1_v1', title: 'Midnight Black', price: 279.99, inventory: 42 },
      { id: 'elec_1_v2', title: 'Platinum Silver', price: 279.99, inventory: 15 },
    ],
  },
  {
    id: 'elec_2',
    title: 'Apple AirPods Pro (3rd Gen)',
    description: 'H2 chip delivers 2x more Active Noise Cancellation. Adaptive Audio adjusts sound for your environment.',
    image: 'https://images.unsplash.com/photo-1588423771073-b8903fead714?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 5213,
    tags: ['New Arrival', 'Trending'],
    discount: 0,
    variants: [
      { id: 'elec_2_v1', title: 'White', price: 249.00, inventory: 60 },
    ],
  },
  {
    id: 'elec_3',
    title: 'Keychron Q3 Mechanical Keyboard',
    description: 'QMK/VIA compatible, gasket-mounted, hot-swappable switches. Full aluminium body with sound-dampening foam layers.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 1432,
    tags: ['Best Seller'],
    discount: 10,
    variants: [
      { id: 'elec_3_v1', title: 'RGB Backlit', price: 169.00, inventory: 28 },
      { id: 'elec_3_v2', title: 'No Backlight', price: 149.00, inventory: 19 },
    ],
  },
  {
    id: 'elec_4',
    title: 'Logitech MX Master 3S Mouse',
    description: '8K DPI sensor, whisper-quiet clicks, MagSpeed electromagnetic scrolling. Works seamlessly across Mac, Windows and Linux.',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 3610,
    tags: ['Best Seller', 'Trending'],
    discount: 12,
    variants: [
      { id: 'elec_4_v1', title: 'Graphite', price: 99.99, inventory: 55 },
      { id: 'elec_4_v2', title: 'Pale Grey', price: 99.99, inventory: 4 },
    ],
  },
  // Fashion
  {
    id: 'fash_1',
    title: 'Premium Leather Sneakers',
    description: 'Hand-stitched full-grain leather upper, memory foam insole, Vibram outsole. Built for a decade of daily wear.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    category: 'Fashion',
    rating: 4.6,
    reviewCount: 987,
    tags: ['Trending', 'Limited Stock'],
    discount: 0,
    variants: [
      { id: 'fash_1_v1', title: 'UK 8', price: 189.00, inventory: 3 },
      { id: 'fash_1_v2', title: 'UK 9', price: 189.00, inventory: 2 },
      { id: 'fash_1_v3', title: 'UK 10', price: 189.00, inventory: 6 },
    ],
  },
  {
    id: 'fash_2',
    title: 'Merino Wool Crewneck Sweater',
    description: '100% extra-fine Merino wool, temperature-regulating, machine washable. Timeless cut with a lifetime guarantee.',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    category: 'Fashion',
    rating: 4.7,
    reviewCount: 723,
    tags: ['New Arrival'],
    discount: 15,
    variants: [
      { id: 'fash_2_v1', title: 'Navy / M', price: 129.00, inventory: 22 },
      { id: 'fash_2_v2', title: 'Charcoal / M', price: 129.00, inventory: 17 },
    ],
  },
  // Home Decor
  {
    id: 'home_1',
    title: 'Himalayan Salt Lamp (XL)',
    description: 'Authentic hand-carved pink Himalayan salt crystal, 8-10 kg. Warm amber glow, UL-certified dimmer cord included.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a35e97843?auto=format&fit=crop&w=800&q=80',
    category: 'Home Decor',
    rating: 4.5,
    reviewCount: 1845,
    tags: ['Best Seller'],
    discount: 20,
    variants: [
      { id: 'home_1_v1', title: 'Natural Pink', price: 59.99, inventory: 35 },
    ],
  },
  {
    id: 'home_2',
    title: 'Minimalist Desk Organiser Set',
    description: 'Solid walnut + brushed steel. 5-piece modular system with cable management, pen holder, phone stand, tray and planter.',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    category: 'Home Decor',
    rating: 4.8,
    reviewCount: 612,
    tags: ['New Arrival', 'Trending'],
    discount: 0,
    variants: [
      { id: 'home_2_v1', title: 'Walnut / Steel', price: 139.00, inventory: 18 },
    ],
  },
  // Beauty
  {
    id: 'beau_1',
    title: 'Dyson Airwrap Complete Long',
    description: 'Curl, wave, smooth and dry simultaneously using Coanda effect. No extreme heat damage. Includes 6 styling attachments.',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80',
    category: 'Beauty',
    rating: 4.7,
    reviewCount: 4201,
    tags: ['Best Seller', 'Limited Stock'],
    discount: 0,
    variants: [
      { id: 'beau_1_v1', title: 'Nickel / Copper', price: 549.00, inventory: 7 },
      { id: 'beau_1_v2', title: 'Black / Purple', price: 549.00, inventory: 4 },
    ],
  },
  {
    id: 'beau_2',
    title: 'Vitamin C Glow Serum (30ml)',
    description: '20% L-Ascorbic Acid + Ferulic Acid + Hyaluronic Acid. Clinically proven to reduce dark spots by up to 40% in 4 weeks.',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80',
    category: 'Beauty',
    rating: 4.6,
    reviewCount: 2190,
    tags: ['Trending'],
    discount: 25,
    variants: [
      { id: 'beau_2_v1', title: '30ml', price: 44.99, inventory: 80 },
    ],
  },
  // Fitness
  {
    id: 'fit_1',
    title: 'Adjustable Dumbbells (5–52.5 lb)',
    description: 'Replace 15 pairs of weights. Dial-select system with 2.5 lb increments, ergonomic grip, commercial-grade steel plates.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    category: 'Fitness',
    rating: 4.9,
    reviewCount: 3354,
    tags: ['Best Seller', 'Trending'],
    discount: 10,
    variants: [
      { id: 'fit_1_v1', title: 'Pair (Both Sides)', price: 419.00, inventory: 12 },
      { id: 'fit_1_v2', title: 'Single', price: 219.00, inventory: 20 },
    ],
  },
  {
    id: 'fit_2',
    title: 'Whoop 4.0 Fitness Tracker',
    description: 'Continuous heart rate, HRV, SpO2, skin temperature monitoring. No screen — pure data. 5-day battery, 10 ATM waterproof.',
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80',
    category: 'Fitness',
    rating: 4.5,
    reviewCount: 1760,
    tags: ['New Arrival'],
    discount: 0,
    variants: [
      { id: 'fit_2_v1', title: 'Onyx Black', price: 239.00, inventory: 50 },
    ],
  },
  // Gaming
  {
    id: 'game_1',
    title: 'Razer DeathAdder V3 Pro',
    description: '30K Focus Pro optical sensor, 90-hour battery, HyperSpeed Wireless. The tournament-proven asymmetric form factor.',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    category: 'Gaming',
    rating: 4.8,
    reviewCount: 2102,
    tags: ['Best Seller'],
    discount: 15,
    variants: [
      { id: 'game_1_v1', title: 'Matte Black', price: 149.99, inventory: 33 },
    ],
  },
  {
    id: 'game_2',
    title: 'Samsung Odyssey G7 27" Monitor',
    description: '1440p 240Hz VA panel, 1ms GTG, 1000R curve, HDR600. G-Sync Compatible and FreeSync Premium Pro certified.',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    category: 'Gaming',
    rating: 4.7,
    reviewCount: 1893,
    tags: ['Trending', 'Limited Stock'],
    discount: 8,
    variants: [
      { id: 'game_2_v1', title: '27" / 240Hz', price: 499.00, inventory: 8 },
    ],
  },
  {
    id: 'game_3',
    title: 'SteelSeries Arctis Nova Pro',
    description: 'Dual wireless system, hot-swappable batteries, lossless 2.4GHz. Multi-system connect for PC, PS5 and Xbox simultaneously.',
    image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&w=800&q=80',
    category: 'Gaming',
    rating: 4.6,
    reviewCount: 927,
    tags: ['New Arrival'],
    discount: 0,
    variants: [
      { id: 'game_3_v1', title: 'Black', price: 349.99, inventory: 25 },
      { id: 'game_3_v2', title: 'White', price: 349.99, inventory: 14 },
    ],
  },
  // Accessories
  {
    id: 'acc_1',
    title: 'Anker 100W USB-C GaN Charger',
    description: 'Charge MacBook Pro, iPad, iPhone and Android simultaneously. Foldable prongs, 4-port, airline-carry-on approved.',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    rating: 4.8,
    reviewCount: 6741,
    tags: ['Best Seller', 'Trending'],
    discount: 20,
    variants: [
      { id: 'acc_1_v1', title: 'Black', price: 55.99, inventory: 200 },
      { id: 'acc_1_v2', title: 'White', price: 55.99, inventory: 150 },
    ],
  },
  {
    id: 'acc_2',
    title: 'Peak Design Everyday Backpack 20L',
    description: 'FlexFold dividers, MagLatch closure, recycled weatherproof ripstop. Fits 15" laptop + full-frame camera kit.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    rating: 4.9,
    reviewCount: 3248,
    tags: ['Best Seller'],
    discount: 0,
    variants: [
      { id: 'acc_2_v1', title: 'Black / 20L', price: 299.95, inventory: 22 },
      { id: 'acc_2_v2', title: 'Sage / 20L', price: 299.95, inventory: 11 },
    ],
  },
  {
    id: 'acc_3',
    title: 'Bellroy Card Sleeve Wallet',
    description: 'RFID protection, holds 4-8 cards + cash, slim profile under 10mm. Premium leather, lifetime guarantee.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    category: 'Accessories',
    rating: 4.7,
    reviewCount: 2104,
    tags: ['Best Seller', 'Trending'],
    discount: 0,
    variants: [
      { id: 'acc_3_v1', title: 'Charcoal', price: 79.00, inventory: 65 },
      { id: 'acc_3_v2', title: 'Caramel', price: 79.00, inventory: 40 },
    ],
  },
];

export { mockProducts };
=======
  return edges.map(({ node }) => {
    return {
      id: node.id,
      title: node.title,
      description: node.description,
      image: node.images.edges[0]?.node?.url || null,
      variants: node.variants.edges.map(v => ({
        id: v.node.id,
        title: v.node.title,
        price: parseFloat(v.node.price),
        inventory: v.node.inventoryQuantity
      })),
      category: "General",
      rating: 4.5,
      reviews: 120,
      tags: ["Trending"]
    };
  });
}

const mockProducts = [
  {
    id: "p1",
    title: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling with 2 microphones.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.9,
    reviews: 2540,
    tags: ["Best Seller", "Trending"],
    variants: [{ id: "p1_v1", title: "Black", price: 349.99, inventory: 15 }]
  },
  {
    id: "p2",
    title: "Keychron K2 Mechanical Keyboard",
    description: "Compact 75% layout with Gateron G Pro switches.",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.8,
    reviews: 1820,
    tags: ["Trending"],
    variants: [{ id: "p2_v1", title: "RGB Brown", price: 89.00, inventory: 45 }]
  },
  {
    id: "p3",
    title: "Logitech MX Master 3S",
    description: "Iconic quiet clicking mouse with 8K DPI tracking.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.9,
    reviews: 3100,
    tags: ["Best Seller"],
    variants: [{ id: "p3_v1", title: "Graphite", price: 99.00, inventory: 60 }]
  },
  {
    id: "p4",
    title: "Apple Watch Series 9",
    description: "Smarter, brighter, and more powerful health tracking.",
    image: "https://images.unsplash.com/photo-1544117518-30dd5f29910d?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.7,
    reviews: 4500,
    tags: ["New Arrival"],
    variants: [{ id: "p4_v1", title: "Midnight", price: 399.00, inventory: 12 }]
  },
  {
    id: "p5",
    title: "Nintendo Switch OLED",
    description: "Vibrant 7-inch OLED screen with enhanced audio.",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80",
    category: "Gaming",
    rating: 4.9,
    reviews: 8200,
    tags: ["Trending", "Best Seller"],
    variants: [{ id: "p5_v1", title: "White", price: 349.99, inventory: 8 }]
  },
  {
    id: "p6",
    title: "Razor BlackShark V2 Pro",
    description: "Wireless esports gaming headset with THX audio.",
    image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80",
    category: "Gaming",
    rating: 4.6,
    reviews: 1450,
    tags: ["Limited Stock"],
    variants: [{ id: "p6_v1", title: "Wireless", price: 179.99, inventory: 3 }]
  },
  {
    id: "p7",
    title: "Nike Air Max 270",
    description: "Nike's first lifestyle Air Max with 270 degrees of air.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    category: "Fashion",
    rating: 4.8,
    reviews: 2100,
    tags: ["Trending"],
    variants: [{ id: "p7_v1", title: "Red/Black", price: 160.00, inventory: 25 }]
  },
  {
    id: "p8",
    title: "Levi's 501 Original Jeans",
    description: "The original straight-fit jean since 1873.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    category: "Fashion",
    rating: 4.5,
    reviews: 5600,
    tags: ["Best Seller"],
    variants: [{ id: "p8_v1", title: "Dark Wash", price: 79.50, inventory: 100 }]
  },
  {
    id: "p9",
    title: "Herschel Little America",
    description: "Mountain-inspired backpack with timeless style.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    category: "Fashion",
    rating: 4.7,
    reviews: 1100,
    tags: ["New Arrival"],
    variants: [{ id: "p9_v1", title: "Black", price: 110.00, inventory: 30 }]
  },
  {
    id: "p10",
    title: "Dyson V15 Detect",
    description: "Most powerful, intelligent cordless vacuum.",
    image: "https://images.unsplash.com/photo-1558317374-067df5f15430?auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    rating: 4.8,
    reviews: 950,
    tags: ["Trending"],
    variants: [{ id: "p10_v1", title: "Total Clean", price: 749.99, inventory: 5 }]
  },
  {
    id: "p11",
    title: "Nespresso Vertuo Next",
    description: "Compact design for a premium coffee experience.",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    rating: 4.4,
    reviews: 2300,
    tags: ["Best Seller"],
    variants: [{ id: "p11_v1", title: "Matte Black", price: 169.00, inventory: 18 }]
  },
  {
    id: "p12",
    title: "Kindle Paperwhite (16 GB)",
    description: "6.8\" display and adjustable warm light.",
    image: "https://images.unsplash.com/photo-1594980596247-87c52a3479bb?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.8,
    reviews: 12400,
    tags: ["Best Seller"],
    variants: [{ id: "p12_v1", title: "Standard", price: 139.99, inventory: 50 }]
  },
  {
    id: "p13",
    title: "YETI Rambler 20 oz Tumbler",
    description: "Insulated stainless steel tumbler with MagSlider lid.",
    image: "https://images.unsplash.com/photo-1610398041455-a2840650d31b?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.9,
    reviews: 15600,
    tags: ["Best Seller", "Trending"],
    variants: [{ id: "p13_v1", title: "Seafoam", price: 35.00, inventory: 200 }]
  },
  {
    id: "p14",
    title: "Ray-Ban Classic Wayfarer",
    description: "Iconic sunglasses since 1952.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.7,
    reviews: 4200,
    tags: ["Trending"],
    variants: [{ id: "p14_v1", title: "Black", price: 163.00, inventory: 40 }]
  },
  {
    id: "p15",
    title: "The Ordinary Niacinamide 10%",
    description: "High-strength vitamin and mineral blemish formula.",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80",
    category: "Beauty",
    rating: 4.6,
    reviews: 8900,
    tags: ["Best Seller"],
    variants: [{ id: "p15_v1", title: "30ml", price: 6.50, inventory: 500 }]
  },
  {
    id: "p16",
    title: "Bowflex SelectTech 552",
    description: "Adjustable dumbbells (Pair) for full-body workouts.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    category: "Fitness",
    rating: 4.8,
    reviews: 3400,
    tags: ["Limited Stock"],
    variants: [{ id: "p16_v1", title: "Pair", price: 429.00, inventory: 2 }]
  },
  {
    id: "p17",
    title: "Fitbit Charge 6",
    description: "Advanced fitness and health tracker with Google apps.",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80",
    category: "Fitness",
    rating: 4.5,
    reviews: 1200,
    tags: ["Trending"],
    variants: [{ id: "p17_v1", title: "Coral", price: 159.95, inventory: 25 }]
  },
  {
    id: "p18",
    title: "Theragun Mini 2nd Gen",
    description: "Portable percussive therapy device.",
    image: "https://images.unsplash.com/photo-1620331311520-246422ff83fb?auto=format&fit=crop&w=800&q=80",
    category: "Fitness",
    rating: 4.7,
    reviews: 850,
    tags: ["New Arrival"],
    variants: [{ id: "p18_v1", title: "Desert Rose", price: 199.00, inventory: 15 }]
  },
  {
    id: "p19",
    title: "Adidas Ultraboost Light",
    description: "Our lightest Ultraboost yet, made with parley ocean plastic.",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    category: "Fashion",
    rating: 4.8,
    reviews: 2800,
    tags: ["Trending"],
    variants: [{ id: "p19_v1", title: "Core Black", price: 190.00, inventory: 40 }]
  },
  {
    id: "p20",
    title: "Hydro Flask 32 oz",
    description: "Wide mouth with straw lid, double wall insulation.",
    image: "https://images.unsplash.com/photo-1602143399827-bd95967c7c40?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.9,
    reviews: 7800,
    tags: ["Best Seller"],
    variants: [{ id: "p20_v1", title: "Pacific", price: 44.95, inventory: 120 }]
  },
  {
    id: "p21",
    title: "Fujifilm Instax Mini 12",
    description: "Instant film camera with automatic exposure.",
    image: "https://images.unsplash.com/photo-1526170315873-3a92121e263c?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.6,
    reviews: 3200,
    tags: ["Trending"],
    variants: [{ id: "p21_v1", title: "Lilac Purple", price: 79.95, inventory: 35 }]
  },
  {
    id: "p22",
    title: "CeraVe Moisturizing Cream",
    description: "Developed with dermatologists, 3 essential ceramides.",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
    category: "Beauty",
    rating: 4.8,
    reviews: 25000,
    tags: ["Best Seller"],
    variants: [{ id: "p22_v1", title: "16 oz", price: 18.99, inventory: 1000 }]
  },
  {
    id: "p23",
    title: "Razer DeathAdder V3 Pro",
    description: "Ultra-lightweight wireless ergonomic gaming mouse.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
    category: "Gaming",
    rating: 4.8,
    reviews: 1100,
    tags: ["Trending"],
    variants: [{ id: "p23_v1", title: "White", price: 149.99, inventory: 20 }]
  },
  {
    id: "p24",
    title: "Anker 737 Power Bank",
    description: "140W fast charging 24,000mAh portable charger.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.7,
    reviews: 4200,
    tags: ["Trending"],
    variants: [{ id: "p24_v1", title: "GaNPrime", price: 149.99, inventory: 50 }]
  },
  {
    id: "p25",
    title: "Le Creuset Dutch Oven",
    description: "Enameled cast iron 5.5 qt. Dutch oven.",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80",
    category: "Home Decor",
    rating: 4.9,
    reviews: 1800,
    tags: ["Best Seller"],
    variants: [{ id: "p25_v1", title: "Flame", price: 419.95, inventory: 10 }]
  },
  {
    id: "p26",
    title: "Stanley Quencher H2.0",
    description: "FlowState Tumbler 40 oz with straw.",
    image: "https://images.unsplash.com/photo-1678125482390-48e025859187?auto=format&fit=crop&w=800&q=80",
    category: "Accessories",
    rating: 4.8,
    reviews: 12000,
    tags: ["Trending", "Limited Stock"],
    variants: [{ id: "p26_v1", title: "Rose Quartz", price: 45.00, inventory: 5 }]
  },
  {
    id: "p27",
    title: "Beats Studio Pro",
    description: "Premium wireless noise canceling headphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    category: "Electronics",
    rating: 4.7,
    reviews: 1500,
    tags: ["Trending"],
    variants: [{ id: "p27_v1", title: "Deep Brown", price: 349.99, inventory: 20 }]
  },
  {
    id: "p28",
    title: "Dyson Airwrap Multi-Styler",
    description: "Dry, curl, shape and smooth with no extreme heat.",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=800&q=80",
    category: "Beauty",
    rating: 4.8,
    reviews: 3200,
    tags: ["Trending", "Best Seller"],
    variants: [{ id: "p28_v1", title: "Prussian Blue", price: 599.99, inventory: 8 }]
  },
  {
    id: "p29",
    title: "Lululemon Align High-Rise Pant",
    description: "Butter-soft Nulu fabric for yoga and beyond.",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80",
    category: "Fitness",
    rating: 4.7,
    reviews: 8500,
    tags: ["Best Seller"],
    variants: [{ id: "p29_v1", title: "Black", price: 98.00, inventory: 150 }]
  },
  {
    id: "p30",
    title: "Patagonia Better Sweater",
    description: "Full-zip fleece with sweater-knit aesthetic.",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    category: "Fashion",
    rating: 4.8,
    reviews: 2100,
    tags: ["Best Seller"],
    variants: [{ id: "p30_v1", title: "Stonewash", price: 149.00, inventory: 60 }]
  }
];
>>>>>>> 3a7b0503def1321cfab6468e55a0ec3afbe34561
