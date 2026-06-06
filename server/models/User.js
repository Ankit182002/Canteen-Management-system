const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"]
    },

    password: {
      type: String,
      required: true,
      select: false // 🔥 hide password
    },

    role: {
      type: String,
      enum: ["customer", "owner", "admin"],
      default: "customer"
    },

    isApproved: {
      type: Boolean,
      default: function () {
        return this.role !== "owner";
      }
    },

    // 🔥 optional (recommended)
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop"
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);