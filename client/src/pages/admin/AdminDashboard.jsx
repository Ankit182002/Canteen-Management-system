import { useEffect, useState } from "react";
import axios from "axios";

import UsersTab from "./UsersTab";
import ShopsTab from "./ShopsTab";
import OrdersTab from "./OrdersTab";
import AdminCharts from "./AdminCharts";

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState("dashboard");
    const [filter, setFilter] = useState("7d"); // 🔥 filter state

    const token = localStorage.getItem("token");

    // 🔥 FETCH STATS
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/stats", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setStats(res.data))
            .catch(err => console.log(err));
    }, []);

    // 🔥 FETCH ORDERS
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/orders", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setOrders(res.data))
            .catch(err => console.log(err));
    }, []);

    // 🔥 FILTER LOGIC
    const getFilteredOrders = () => {
        if (filter === "all") return orders;

        const days = filter === "7d" ? 7 : 30;
        const now = new Date();

        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const diff = (now - orderDate) / (1000 * 60 * 60 * 24);
            return diff <= days;
        });
    };

    const filteredOrders = getFilteredOrders();

    return (
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <h1 className="text-3xl font-bold mb-6">Admin Panel ⚙️</h1>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 shadow rounded">
                    <p className="text-sm text-gray-500">Users</p>
                    <h2 className="text-xl font-bold">{stats.users}</h2>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-sm text-gray-500">Shops</p>
                    <h2 className="text-xl font-bold">{stats.shops}</h2>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-sm text-gray-500">Orders</p>
                    <h2 className="text-xl font-bold">{stats.orders}</h2>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <h2 className="text-xl font-bold text-green-600">
                        ₹{stats.revenue}
                    </h2>
                </div>
            </div>

            {/* NAV */}
            <div className="flex gap-4 mb-6 flex-wrap">
                {["dashboard", "users", "shops", "orders", "analytics"].map(item => (
                    <button
                        key={item}
                        onClick={() => setTab(item)}
                        className={`px-3 py-1 rounded capitalize ${tab === item ? "bg-orange-500 text-white" : "bg-white"
                            }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* ================= DASHBOARD ================= */}
            {tab === "dashboard" && (
                <>
                    {/* 🔥 FILTER BUTTONS */}
                    <div className="flex gap-3 mb-4">
                        {["7d", "30d", "all"].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded ${filter === f ? "bg-orange-500 text-white" : "bg-white"
                                    }`}
                            >
                                {f === "7d"
                                    ? "Last 7 Days"
                                    : f === "30d"
                                        ? "Last 30 Days"
                                        : "All Time"}
                            </button>
                        ))}
                    </div>

                    {/* 🔥 FILTER LABEL */}
                    <p className="text-sm text-gray-500 mb-2">
                        Showing:{" "}
                        {filter === "7d"
                            ? "Last 7 Days"
                            : filter === "30d"
                                ? "Last 30 Days"
                                : "All Time"}
                    </p>

                    {/* 🔥 CHARTS */}
                    <AdminCharts orders={filteredOrders} />

                    {/* 🔥 RECENT ORDERS */}
                    <div className="bg-white p-4 rounded shadow mt-6">
                        <h2 className="font-bold mb-3">Recent Orders</h2>

                        {filteredOrders.length === 0 ? (
                            <p>No orders</p>
                        ) : (
                            filteredOrders.slice(0, 5).map(order => (
                                <div
                                    key={order._id}
                                    className="flex justify-between border-b py-2 text-sm"
                                >
                                    <span>#{order._id.slice(-6)}</span>
                                    <span>₹{order.total}</span>
                                    <span className="capitalize">{order.status}</span>
                                </div>
                            ))
                        )}
                    </div>
                </>
            )}

            {/* ================= USERS ================= */}
            {tab === "users" && <UsersTab />}

            {/* ================= SHOPS ================= */}
            {tab === "shops" && <ShopsTab />}

            {/* ================= ORDERS ================= */}
            {tab === "orders" && <OrdersTab />}

            {/* ================= ANALYTICS ================= */}
            {tab === "analytics" && (
                <div className="bg-white p-6 rounded shadow">
                    <AdminCharts orders={filteredOrders} />
                </div>
            )}
        </div>
    );
}