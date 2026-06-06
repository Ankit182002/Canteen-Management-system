import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function OrderStatus({ orderId }) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    socket.emit("joinOrderRoom", orderId);

    socket.on("statusUpdate", (newStatus) => {
      setStatus(newStatus);
    });

    return () => socket.disconnect();
  }, [orderId]);

  return <h3>Status: {status}</h3>;
}