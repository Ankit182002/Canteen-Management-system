import { Link } from "react-router-dom";

export default function OrderSuccess() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">

            <h1 className="text-4xl font-bold text-green-600 mb-4">
                🎉 Order Placed Successfully!
            </h1>

            <p className="text-gray-600 mb-6">
                Your food is being prepared 🍳
            </p>

            <Link
                to="/orders"
                className="bg-orange-500 text-white px-6 py-2 rounded"
            >
                View Orders
            </Link>
        </div>
    );
}