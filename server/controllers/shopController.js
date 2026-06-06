const mongoose = require("mongoose");
const Shop = require("../models/Shop");
const Menu = require("../models/Menu");

/* ================= GET ALL SHOPS ================= */
const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* ================= GET MENU BY SHOP ================= */
const getMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid shop ID" });
    }

    // 🔥 check shop exists & active
    const shop = await Shop.findById(id);

    if (!shop || !shop.isActive) {
      return res.status(404).json({ msg: "Shop not available" });
    }

    // 🔥 only available items
    const menu = await Menu.find({
      shop: id,
      isAvailable: true
    });

    res.json(menu);

  } catch (err) {
    console.error("GET MENU ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getShops,
  getMenu
};