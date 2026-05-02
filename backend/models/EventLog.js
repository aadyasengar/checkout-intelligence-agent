import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  eventType: { type: String, required: true }, // e.g., 'idle_checkout', 'cart_modified', 'shipping_selected'
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('EventLog', eventLogSchema);
