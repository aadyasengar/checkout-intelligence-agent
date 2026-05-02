export class ShoppingAgent {
  constructor(products) {
    this.products = products;
  }

  recommend(session, history) {
    // Recommend based on category of items in cart
    const cartCategories = session.cartItems.map(item => item.product.category);
    const recommendations = this.products.filter(p => 
      cartCategories.includes(p.category) && 
      !session.cartItems.some(item => item.product.id === p.id)
    ).slice(0, 3);

    if (recommendations.length > 0) {
      return `Based on what's in your cart, you might also like the ${recommendations[0].title}. It's a perfect match!`;
    }
    return "I can help you find the best tech, fashion, or fitness gear. What are you looking for today?";
  }

  search(query) {
    const q = query.toLowerCase();
    return this.products.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);
  }
}
