const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Menu = require("../models/Menu");
const Shop = require("../models/Shop");
const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= TEST ================= */
router.get("/test", (req, res) => {
  res.json({ msg: "Owner routes working" });
});

/* ================= GET OWNER SHOP ================= */
router.get("/shop", protect, authorize("owner"), async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) return res.status(404).json({ msg: "No shop assigned" });

  res.json(shop);
});

/* ================= GET OWNER ORDERS ================= */
router.get("/orders", protect, authorize("owner"), async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) return res.status(404).json({ msg: "No shop assigned" });

  const orders = await Order.find({ shop: shop._id })
    .populate("items.menuItem")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/* ================= GET OWNER MENU ================= */
router.get("/menu", protect, authorize("owner"), async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) return res.status(404).json({ msg: "No shop assigned" });

  const items = await Menu.find({ shop: shop._id });

  res.json(items);
});

/* ================= ADD MENU ================= */
router.post("/menu", protect, authorize("owner"), async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) return res.status(404).json({ msg: "No shop assigned" });

  const item = await Menu.create({
    ...req.body,
    shop: shop._id
  });

  res.json(item);
});

module.exports = router;