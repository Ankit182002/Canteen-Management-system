import { useEffect, useState } from "react";
import axios from "axios";

export default function ShopsTab() {
    const [shops, setShops] = useState([]);
    const [form, setForm] = useState({
        name: "",
        location: "",
        description: "",
        image: "",
        rating: 4
    });
    const [editing, setEditing] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        const res = await axios.get("http://localhost:5000/api/admin/shops", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setShops(res.data);
    };

    const saveShop = async () => {
        if (editing) {
            const res = await axios.put(
                `http://localhost:5000/api/admin/shops/${editing._id}`,
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShops(prev =>
                prev.map(s => (s._id === editing._id ? res.data : s))
            );

            setEditing(null);
        } else {
            const res = await axios.post(
                "http://localhost:5000/api/admin/shops",
                form,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShops([res.data, ...shops]);
        }

        setForm({ name: "", location: "" });
    };

    const toggleShop = async (id) => {
        await axios.put(
            `http://localhost:5000/api/admin/shops/${id}/toggle`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchShops();
    };

    const deleteShop = async (id) => {
        await axios.delete(
            `http://localhost:5000/api/admin/shops/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        fetchShops();
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Shops</h2>

            {/* FORM */}
            <div className="bg-white p-4 mb-4 shadow space-y-2">

                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Image URL"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    type="number"
                    placeholder="Rating"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="border p-2 w-full"
                />

                <button onClick={saveShop} className="bg-green-500 text-white px-3 py-2">
                    {editing ? "Update Shop" : "Add Shop"}
                </button>

            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {shops.map(shop => (
                    <div
                        key={shop._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                    >

                        {/* IMAGE */}
                        <img
                            src={shop.image}
                            alt={shop.name}
                            className="w-full h-40 object-cover"
                        />

                        {/* CONTENT */}
                        <div className="p-4">

                            <h2 className="text-lg font-bold">{shop.name}</h2>

                            <p className="text-sm text-gray-500">
                                {shop.location}
                            </p>

                            <p className="text-sm mb-2 line-clamp-2">
                                {shop.description}
                            </p>

                            {/* RATING */}
                            <p className="text-yellow-600 font-semibold mb-2">
                                ⭐ {shop.rating}
                            </p>

                            {/* STATUS */}
                            <p className={`text-sm mb-3 ${shop.isActive ? "text-green-600" : "text-red-500"
                                }`}>
                                {shop.isActive ? "Active" : "Inactive"}
                            </p>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 flex-wrap">

                                <button
                                    onClick={() => {
                                        setEditing(shop);
                                        setForm(shop);
                                    }}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => toggleShop(shop._id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Toggle
                                </button>

                                <button
                                    onClick={() => deleteShop(shop._id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}