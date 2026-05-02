export class CheckoutAgent {
  analyzeHesitation(session, events) {
    const lastEvents = events.slice(-5);
    
    // Check for rapid navigation
    const navigations = lastEvents.filter(e => e.eventType === 'section_dwell');
    if (navigations.length >= 3) {
      return "I noticed you're moving between sections quite a bit. Is there something about shipping or payment I can clarify?";
    }

    // Check for long idle on payment
    const paymentIdle = events.find(e => e.eventType === 'idle_checkout' && e.metadata.section === 'payment');
    if (paymentIdle) {
      return "Taking your time with the payment details? Don't worry, your connection is secure. Need help with UPI or card options?";
    }

    return null;
  }

  persuade(session) {
    const persuasion = [
      "Items in your cart are in high demand and might sell out soon.",
      "Complete your purchase now and we'll prioritize your delivery.",
      "You're just one step away from joining 25,000+ happy customers!"
    ];
    return persuasion[Math.floor(Math.random() * persuasion.length)];
  }
}
