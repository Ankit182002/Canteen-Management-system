import { useEffect, useState } from "react";
import { socket } from "../../socket";

export default function OrderTracking({ order }) {
    const [status, setStatus] = useState(order.status);

    useEffect(() => {
        // join room
        socket.emit("joinOrderRoom", order._id);

        // listen for updates
        socket.on("orderUpdated", (updatedOrder) => {
            if (updatedOrder._id === order._id) {
                setStatus(updatedOrder.status);
            }
        });

        return () => {
            socket.off("orderUpdated");
        };
    }, [order._id]);

    return (
        <div className="mt-4">
            <p className="font-semibold mb-2">Order Status:</p>

            <div className="flex gap-3 flex-wrap">
                {["placed", "preparing", "ready", "delivered"].map((step) => (
                    <div
                        key={step}
                        className={`px-3 py-1 rounded text-white text-sm ${status === step
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                    >
                        {step}
                    </div>
                ))}
            </div>
        </div>
    );
}