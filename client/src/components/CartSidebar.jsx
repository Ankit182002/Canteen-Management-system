import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
    const { cart, total, isOpen, setIsOpen } = useCart();
    const navigate = useNavigate();

    return (
        <>
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold">Cart 🛒</h2>
                    <button onClick={() => setIsOpen(false)}>✖</button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto h-[70%]">
                    {cart.length === 0 ? (
                        <p>No items</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="flex justify-between">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t">
                    <h3 className="font-bold">Total: ₹{total}</h3>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/checkout");
                        }}
                        className="bg-orange-500 text-white w-full py-2 mt-3 rounded"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        </>
    );
}