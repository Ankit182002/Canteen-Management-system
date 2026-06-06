const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  description: String,

  category: {
    type: String,
    default: "General"
  },

  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
  },

  rating: {
    type: Number,
    default: 4.0,
    min: 0,
    max: 5
  },

  isActive: {
    type: Boolean,
    default: true
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
    // unique: true // enable if 1 shop per owner
  }

}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);