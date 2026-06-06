const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* ================= CREATE ORDER ================= */

router.post("/create", async (req, res) => {
    const order = await razorpay.orders.create({
        amount: req.body.amount * 100,
        currency: "INR"
    });

    res.json(order);
});

/* ================= VERIFY PAYMENT ================= */
router.post("/verify", (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expected = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expected === razorpay_signature) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false });
        }

    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
});

module.exports = router;