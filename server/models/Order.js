const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true
  },

  items: {
    type: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    validate: v => v.length > 0
  },

  total: {
    type: Number,
    required: true,
    min: 0
  },

  status: {
    type: String,
    enum: ["placed", "preparing", "ready", "delivered"],
    default: "placed"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  address: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  }

}, { timestamps: true });

// 🔥 indexes
orderSchema.index({ shop: 1 });
orderSchema.index({ customer: 1 });

module.exports = mongoose.model("Order", orderSchema);