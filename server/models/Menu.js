const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: true // 🔥 VERY IMPORTANT
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },

  isAvailable: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

// 🔥 index for fast queries
menuSchema.index({ shop: 1 });

module.exports = mongoose.model("Menu", menuSchema);