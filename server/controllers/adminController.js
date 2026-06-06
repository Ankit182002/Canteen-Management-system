const User = require("../models/User");
const Shop = require("../models/Shop");
const Order = require("../models/Order");

/* ================= USERS ================= */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================= SHOPS ================= */
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner");
    res.json(shops);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================= TOGGLE SHOP ================= */
exports.toggleShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ msg: "Shop not found" });
    }

    shop.isActive = !shop.isActive;
    await shop.save();

    res.json(shop);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================= ORDERS ================= */
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("shop")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================= REVENUE ================= */
exports.getRevenue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total" },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(result[0] || { total: 0, count: 0 });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};