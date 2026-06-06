import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { setIsOpen, cart } = useCart();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

            {/* LOGO */}
            <h1
                onClick={() => navigate("/")}
                className="text-xl font-bold text-orange-500 cursor-pointer"
            >
                FoodApp 🍔
            </h1>

            {/* NAV LINKS */}
            <div className="flex items-center gap-6">

                {/* ✅ IF NOT LOGGED IN */}
                {!user && (
                    <>
                        <Link to="/login" className="hover:text-orange-500">
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="bg-orange-500 text-white px-3 py-1 rounded"
                        >
                            Sign Up
                        </Link>
                    </>
                )}

                {/* ✅ CUSTOMER */}
                {user?.role === "customer" && (
                    <>
                        <Link to="/shops" className="hover:text-orange-500">
                            Shops
                        </Link>

                        <Link to="/orders" className="hover:text-orange-500">
                            Orders
                        </Link>

                        {/* CART */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="relative text-xl"
                        >
                            🛒
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </>
                )}

                {/* ✅ OWNER */}
                {user?.role === "owner" && (
                    <>
                        <Link to="/owner" className="hover:text-orange-500">
                            Dashboard
                        </Link>
                    </>
                )}

                {user?.role === "admin" && (
                    <Link to="/admin">Admin</Link>
                )}

                {/* ✅ SHOW LOGOUT ONLY IF LOGGED IN */}
                {user && (
                    <>
                        <span className="text-sm text-gray-600">
                            {user.role}
                        </span>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}