import { useEffect, useState } from "react";
import axios from "axios";
import OrderTracking from "./OrderTracking";

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios
            .get("http://localhost:5000/api/orders/my", {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => setOrders(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">My Orders 📦</h1>

            {orders.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                orders.map(order => (
                    
                    <div key={order._id} className="bg-white p-4 rounded shadow mb-4">

                        <h2 className="font-bold mb-2">
                            Order ID: {order._id}
                        </h2>

                        <p className="text-sm text-gray-500 mb-2">
                            Status: {order.status}
                        </p>
                        <OrderTracking order={order} />
                        <ul className="mb-2">
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.menuItem?.name || "Deleted Item"} x {item.quantity}
                                </li>
                            ))}
                        </ul>

                        <p className="font-semibold">
                            Total: ₹{order.total}
                        </p>

                    </div>
                ))
            )}
        </div>
    );
}