import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders</h2>

      {orders.map(o => (
        <div key={o._id} className="bg-white p-3 shadow mb-2">
          Order #{o._id.slice(-6)} - ₹{o.total} - {o.status}
        </div>
      ))}
    </div>
  );
}