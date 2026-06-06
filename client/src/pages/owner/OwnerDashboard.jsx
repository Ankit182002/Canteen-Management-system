import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import MenuManager from "./MenuManager";

export default function OwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("orders");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("❌ No token found");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:5000/api/owner/orders",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("ORDERS:", res.data);
      setOrders(res.data);

    } catch (err) {
      console.log("FETCH ERROR:", err.response?.data || err.message);
    }
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= SOCKET REALTIME ================= */
  useEffect(() => {
    socket.on("newOrder", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    socket.on("orderUpdated", (updated) => {
      setOrders(prev =>
        prev.map(o => (o._id === updated._id ? updated : o))
      );
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  /* ================= ANALYTICS ================= */
  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === "placed").length;
  const preparing = orders.filter(o => o.status === "preparing").length;
  const revenue = orders.reduce((acc, o) => acc + o.total, 0);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 🔥 refresh manually (backup if socket fails)
      fetchOrders();

    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔹 TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-black"
        >
          ⬅ Back
        </button>

        <h1 className="text-2xl font-bold">
          {user?.name || "My Shop"} 🏪
        </h1>

        <button
          onClick={() => navigate("/owner/menu")}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Manage Menu
        </button>
      </div>

      {/* 🔹 ANALYTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-xl font-bold">{totalOrders}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-xl font-bold">{pending}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Preparing</h3>
          <p className="text-xl font-bold">{preparing}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-xl font-bold text-green-600">₹{revenue}</p>
        </div>

      </div>

      {/* 🔹 TABS */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded ${
            tab === "orders"
              ? "bg-orange-500 text-white"
              : "bg-white"
          }`}
        >
          Orders
        </button>

        <button
          onClick={() => setTab("menu")}
          className={`px-4 py-2 rounded ${
            tab === "menu"
              ? "bg-orange-500 text-white"
              : "bg-white"
          }`}
        >
          Menu
        </button>
      </div>

      {/* 🔹 ORDERS LIST */}
      {tab === "orders" && (
        <>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            orders.map(order => (
              <div
                key={order._id}
                className="bg-white p-4 rounded shadow mb-4"
              >

                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold">
                    Order #{order._id.slice(-6)}
                  </h2>

                  <span className="text-sm text-gray-500">
                    {order.status}
                  </span>
                </div>

                <ul className="mb-2">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.menuItem?.name || "Item"} x {item.quantity}
                    </li>
                  ))}
                </ul>

                <p className="font-semibold mb-3">
                  ₹{order.total}
                </p>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(order._id, "preparing")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Preparing
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "ready")}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "delivered")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Delivered
                  </button>
                </div>

              </div>
            ))
          )}
        </>
      )}

      {/* 🔹 MENU TAB */}
      {tab === "menu" && <MenuManager />}

    </div>
  );
}