import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionId:              { type: String, required: true, unique: true },
  checkoutStage:          { type: String, default: 'cart' }, // cart | checkout | payment | completed
  cartItems:              { type: Array,  default: [] },
  cartTotal:              { type: Number, default: 0 },
  frictionScore:          { type: Number, default: 0 },
  interventionTriggered:  { type: Boolean, default: false },
  interventionType:       { type: String, default: null },
  conversationHistory:    { type: Array,  default: [] }, // [{role, content}]
  recoveredAt:            { type: Date,   default: null },
  createdAt:              { type: Date,   default: Date.now },
  updatedAt:              { type: Date,   default: Date.now },
});

export default mongoose.model('Session', sessionSchema);
