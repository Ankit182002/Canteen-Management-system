import { useCart } from "../../context/CartContext";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, total } = useCart();

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Your Cart 🛒</h1>

            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <div className="space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                        >
                            <div>
                                <h2 className="font-semibold">{item.name}</h2>
                                <p>₹{item.price}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(item._id, item.quantity - 1)
                                    }
                                    className="px-2 bg-gray-200"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() =>
                                        updateQuantity(item._id, item.quantity + 1)
                                    }
                                    className="px-2 bg-gray-200"
                                >
                                    +
                                </button>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 ml-4"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* TOTAL */}
                    <div className="text-right text-xl font-bold mt-6">
                        Total: ₹{total}
                    </div>

                    <button className="bg-green-500 text-white px-6 py-2 rounded mt-4">
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
}