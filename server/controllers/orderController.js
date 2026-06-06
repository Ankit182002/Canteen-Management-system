const Order = require("../models/Order");
const Menu = require("../models/Menu");

/* ================= CREATE ORDER ================= */
exports.createOrder = async (req, res) => {
  try {
    const { items, total, address, phone } = req.body;

    // 🔥 validation
    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No items in order" });
    }

    if (!address || !phone) {
      return res.status(400).json({ msg: "Address and phone required" });
    }

    // 🔥 derive shop from menu item (IMPORTANT FIX)
    const firstItem = items[0];

    const menuItem = await Menu.findById(firstItem.menuItem);

    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    const order = await Order.create({
      customer: req.user._id, // ✅ FIXED
      items,
      total,
      shop: menuItem.shop, // 🔥 NEVER trust frontend
      address,
      phone,
      status: "placed"
    });

    res.json(order);

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

/* ================= GET USER ORDERS ================= */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }) // ✅ FIXED
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error("GET ORDERS ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};