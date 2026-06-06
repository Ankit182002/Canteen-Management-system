const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Shop = require("../models/Shop");
const Order = require("../models/Order");

const { protect, authorize } = require("../middleware/authMiddleware");

// 🔐 ADMIN ONLY
router.use(protect, authorize("admin"));

/* ================= USERS ================= */

// GET USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ APPROVE OWNER
router.put("/users/:id/approve", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.isApproved = true;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= SHOPS ================= */

// GET SHOPS
router.get("/shops", async (req, res) => {
  try {
    const shops = await Shop.find().populate("owner");
    res.json(shops);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ➕ CREATE SHOP
router.post("/shops", async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.json(shop);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✏️ UPDATE SHOP
router.put("/shops/:id", async (req, res) => {
  try {
    const updated = await Shop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🔁 TOGGLE SHOP
router.put("/shops/:id/toggle", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) return res.status(404).json({ msg: "Shop not found" });

    shop.isActive = !shop.isActive;
    await shop.save();

    res.json(shop);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🗑 DELETE SHOP
router.delete("/shops/:id", async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🧠 ASSIGN SHOP TO OWNER (IMPORTANT FIX)
router.put("/shops/:id/assign", async (req, res) => {
  try {
    const { ownerId } = req.body;

    const shop = await Shop.findById(req.params.id);
    const user = await User.findById(ownerId);

    if (!shop) return res.status(404).json({ msg: "Shop not found" });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.role !== "owner") {
      return res.status(400).json({ msg: "User is not an owner" });
    }

    shop.owner = ownerId;
    await shop.save();

    res.json(shop);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= ORDERS ================= */

// GET ALL ORDERS
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer")
      .populate("items.menuItem");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= STATS ================= */

router.get("/stats", async (req, res) => {
  try {
    const users = await User.countDocuments();
    const shops = await Shop.countDocuments();
    const orders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const revenue = revenueData[0]?.total || 0;

    res.json({ users, shops, orders, revenue });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;