const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Menu = require("../models/Menu");
const Shop = require("../models/Shop");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= PUBLIC MENU ================= */
// ✅ Used by customers
router.get("/shop/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ msg: "Invalid shop ID" });
    }

    const items = await Menu.find({
      shop: shopId,
      isAvailable: true
    });

    res.json(items);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= OWNER MENU ================= */
// ✅ Used by owner dashboard
router.get("/owner", protect, authorize("owner"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      return res.status(404).json({ msg: "No shop assigned" });
    }

    const items = await Menu.find({ shop: shop._id });
    res.json(items);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= CREATE ================= */
router.post("/", protect, authorize("owner"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop) {
      return res.status(404).json({ msg: "No shop assigned" });
    }

    const item = await Menu.create({
      ...req.body,
      shop: shop._id
    });

    res.json(item);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", protect, authorize("owner"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const item = await Menu.findById(req.params.id);

    if (!item || item.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", protect, authorize("owner"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    const item = await Menu.findById(req.params.id);

    if (!item || item.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.json({ msg: "Deleted" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;