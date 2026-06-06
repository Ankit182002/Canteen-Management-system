const express = require("express");
const router = express.Router();

const Shop = require("../models/Shop");
const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= PUBLIC ================= */

// ✅ GET ALL ACTIVE SHOPS (CUSTOMER)
router.get("/", async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ GET SINGLE SHOP (IMPORTANT)
router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ msg: "Shop not found" });
    }

    res.json(shop);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


/* ================= ADMIN ================= */

// ➕ CREATE SHOP
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    res.json(shop);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✏️ UPDATE SHOP
router.put("/:id", protect, authorize("admin"), async (req, res) => {
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

// 🔁 TOGGLE ACTIVE
router.put("/:id/toggle", protect, authorize("admin"), async (req, res) => {
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
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    await Shop.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;