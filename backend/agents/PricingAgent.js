export class PricingAgent {
  generateOffer(session) {
    const total = session.cartTotal || 0;
    
    if (total > 500) {
      return {
        type: 'discount_15',
        code: 'WELCOME15',
        message: "Since you're placing a high-value order, I've unlocked a 15% discount for you! Use code WELCOME15."
      };
    }
    
    if (total > 0) {
      return {
        type: 'discount_10',
        code: 'SAVE10',
        message: "I can give you 10% off your order right now. Use code SAVE10 at checkout!"
      };
    }

    return null;
  }

  validateCoupon(code) {
    const coupons = {
      'SAVE10': { discount: 0.10, type: 'percentage' },
      'WELCOME15': { discount: 0.15, type: 'percentage' },
      'FREESHIP': { discount: 0, type: 'free_shipping' }
    };
    return coupons[code.toUpperCase()] || null;
  }
}
