import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    phone: ""
  });

  /* ================= PAYMENT HANDLER ================= */
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!form.address || !form.phone) {
        alert("Please fill address & phone");
        return;
      }

      /* 🔥 STEP 1: CREATE RAZORPAY ORDER */
      const { data } = await axios.post(
        "http://localhost:5000/api/payment/create",
        { amount: total }
      );

      /* 🔥 STEP 2: OPEN RAZORPAY */
      const options = {
        key: "rzp_test_SkpqWFZX1WOiJU", // 🔥 replace with your key
        amount: data.amount,
        currency: "INR",
        name: "Campus Canteen",
        description: "Food Order",
        order_id: data.id,

        handler: async function (response) {
          try {
            /* 🔥 STEP 3: VERIFY PAYMENT */
            const verify = await axios.post(
              "http://localhost:5000/api/payment/verify",
              response
            );

            if (verify.data.success) {
              /* 🔥 STEP 4: CREATE ORDER (AFTER PAYMENT) */
              const orderData = {
                items: cart.map(item => ({
                  menuItem: item._id,
                  quantity: item.quantity
                })),
                total,
                address: form.address,
                phone: form.phone
              };

              await axios.post(
                "http://localhost:5000/api/orders",
                orderData,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );

              clearCart();
              navigate("/success");

            } else {
              alert("Payment verification failed ❌");
            }

          } catch (err) {
            console.log(err);
            alert("Order creation failed ❌");
          }
        },

        theme: {
          color: "#f97316"
        }
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (err) {
      console.log(err);
      alert("Payment failed ❌");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout 🧾</h1>

      {/* ADDRESS */}
      <input
        type="text"
        placeholder="Enter Address"
        className="w-full border p-2 mb-4"
        value={form.address}
        onChange={(e) =>
          setForm({ ...form, address: e.target.value })
        }
      />

      {/* PHONE */}
      <input
        type="text"
        placeholder="Phone Number"
        className="w-full border p-2 mb-4"
        value={form.phone}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      {/* CART PREVIEW */}
      <div className="mb-4">
        {cart.map(item => (
          <div key={item._id} className="flex justify-between">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">
        Total: ₹{total}
      </h2>

      <button
        onClick={handlePayment}
        className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
      >
        Pay & Place Order 💳
      </button>
    </div>
  );
}