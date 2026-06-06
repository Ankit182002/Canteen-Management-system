const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Shop = require("../models/Shop");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= CREATE ORDER ================= */
router.post("/", protect, async (req, res) => {
  try {
    const firstItem = req.body.items[0];

    const menuItem = await Menu.findById(firstItem.menuItem);

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    const order = await Order.create({
      items: req.body.items,
      total: req.body.total,
      address: req.body.address,
      phone: req.body.phone,
      customer: req.user._id, // ✅ FIXED
      shop: menuItem.shop,
      status: "placed"
    });

    // 🔥 EMIT TO OWNER ROOM (BETTER)
    const io = req.app.get("io");
    io.emit("newOrder", order);

    res.json(order);

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
});


/* ================= GET USER ORDERS ================= */
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }) // ✅ FIXED
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


/* ================= UPDATE STATUS ================= */
router.put("/:id/status", protect, authorize("admin", "owner"), async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ VALID STATUSES
    const validStatuses = ["placed", "preparing", "ready", "delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // 🔒 OWNER SECURITY CHECK
    if (req.user.role === "owner") {
      const shop = await Shop.findOne({ owner: req.user._id });

      if (!shop || order.shop.toString() !== shop._id.toString()) {
        return res.status(403).json({ msg: "Unauthorized" });
      }
    }

    order.status = status;
    await order.save();

    // 🔥 REAL-TIME UPDATE
    const io = req.app.get("io");
    io.emit("orderUpdated", order);

    res.json(order);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;