import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (


        <div className="bg-gray-50 min-h-screen font-sans">
            

            {/* HERO */}
            <section className="max-w-7xl mx-auto grid md:grid-cols-2 items-center px-6 py-16 gap-10">

                {/* LEFT */}
                <div>
                    <h1 className="text-5xl font-bold leading-tight mb-4">
                        Delicious Food,
                        <span className="text-orange-500"> Delivered Fast</span> 🍔
                    </h1>

                    <p className="text-gray-600 mb-6">
                        Order from your favorite campus shops in seconds
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/shops")}
                            className="bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-orange-600 transition"
                        >
                            Explore Shops
                        </button>

                        <button
                            onClick={() => navigate("/register")}
                            className="border border-orange-500 text-orange-500 px-6 py-3 rounded-xl hover:bg-orange-100 transition"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* IMAGE */}
                <div className="flex justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                        className="rounded-2xl shadow-xl w-full max-w-md"
                    />
                </div>
            </section>

            {/* FEATURES */}
            <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6 pb-16">
                {[
                    { title: "Fast Delivery", icon: "⚡" },
                    { title: "Best Quality", icon: "🥗" },
                    { title: "Easy Ordering", icon: "📱" },
                ].map((f, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center">
                        <div className="text-3xl mb-2">{f.icon}</div>
                        <h3 className="text-lg font-semibold">{f.title}</h3>
                        <p className="text-gray-500 text-sm mt-2">
                            Simple and seamless experience
                        </p>
                    </div>
                ))}
            </section>

            {/* CTA */}
            <section className="bg-orange-500 text-white text-center py-12">
                <h2 className="text-3xl font-bold mb-2">Partner With Us</h2>
                <p className="mb-4">Grow your business with FoodApp</p>

                <button
                    onClick={() => navigate("/register")}
                    className="bg-white text-orange-500 px-6 py-3 rounded-xl font-semibold shadow"
                >
                    Register Your Shop
                </button>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">

                    <div>
                        <h2 className="text-xl font-bold text-orange-400">FoodApp</h2>
                        <p className="text-sm mt-2">
                            Your favorite campus food delivery platform
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Company</h3>
                        <p className="hover:text-white cursor-pointer">About</p>
                        <p className="hover:text-white cursor-pointer">Contact</p>
                        <p className="hover:text-white cursor-pointer">Partner</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Contact</h3>
                        <p>Email: support@foodapp.com</p>
                        <p>Phone: +91 9999999999</p>
                    </div>
                </div>

                <p className="text-center text-sm mt-6">
                    © 2026 FoodApp
                </p>
            </footer>
        </div>
    );
}