/* ================= UPDATE ORDER STATUS ================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["placed", "preparing", "ready", "delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // 🔥 verify owner owns this shop
    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop || order.shop.toString() !== shop._id.toString()) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    // 🔥 correct socket usage
    const io = req.app.get("io");
    io.emit("orderUpdated", order);

    res.json(order);

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};