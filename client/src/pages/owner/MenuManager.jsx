import { useEffect, useState } from "react";
import axios from "axios";

export default function MenuManager() {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        image: ""
    });

    const [editing, setEditing] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchMenu();
    }, []);

    /* ================= FETCH MENU ================= */
    const fetchMenu = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/menu/owner", // ✅ FIXED
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setItems(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= ADD ================= */
    const handleAdd = async () => {
        if (!form.name || !form.price) return;

        try {
            await axios.post(
                "http://localhost:5000/api/menu",
                form,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setForm({ name: "", description: "", price: "", image: "" });
            fetchMenu();
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/menu/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            fetchMenu();
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= TOGGLE ================= */
    const toggleAvailability = async (item) => {
        try {
            await axios.put(
                `http://localhost:5000/api/menu/${item._id}`,
                { isAvailable: !item.isAvailable },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            fetchMenu();
        } catch (err) {
            console.log(err);
        }
    };

    /* ================= EDIT ================= */
    const startEdit = (item) => {
        setEditing(item);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:5000/api/menu/${editing._id}`,
                editing,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setEditing(null);
            fetchMenu();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="mt-4 px-4">

            {/* ================= ADD FORM ================= */}
            <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
                <h2 className="font-bold text-lg">Add New Item</h2>

                <input
                    placeholder="Name"
                    className="border p-2 w-full"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    placeholder="Description"
                    className="border p-2 w-full"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <input
                    placeholder="Price"
                    type="number"
                    className="border p-2 w-full"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                />

                <input
                    placeholder="Image URL"
                    className="border p-2 w-full"
                    value={form.image}
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                    }
                />

                {/* IMAGE PREVIEW */}
                {form.image && (
                    <img
                        src={form.image}
                        alt=""
                        className="h-24 w-full object-cover rounded"
                    />
                )}

                <button
                    onClick={handleAdd}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    Add Item
                </button>
            </div>

            {/* ================= MENU GRID ================= */}
            <div className="grid md:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item._id} className="bg-white p-4 rounded shadow">

                        <img
                            src={item.image}
                            alt=""
                            className="h-32 w-full object-cover rounded mb-2"
                        />

                        <h2 className="font-bold">{item.name}</h2>
                        <p className="text-sm text-gray-500">
                            {item.description}
                        </p>

                        <p className="font-semibold">₹{item.price}</p>

                        <p className={`text-sm ${item.isAvailable ? "text-green-600" : "text-red-500"
                            }`}>
                            {item.isAvailable ? "Available" : "Unavailable"}
                        </p>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            <button
                                onClick={() => startEdit(item)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => toggleAvailability(item)}
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                                Toggle
                            </button>

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= EDIT MODAL ================= */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded w-96 space-y-3">

                        <h2 className="font-bold text-lg">Edit Item</h2>

                        <input
                            value={editing.name}
                            onChange={(e) =>
                                setEditing({ ...editing, name: e.target.value })
                            }
                            className="border p-2 w-full"
                        />

                        <input
                            value={editing.description}
                            onChange={(e) =>
                                setEditing({ ...editing, description: e.target.value })
                            }
                            className="border p-2 w-full"
                        />

                        <input
                            type="number"
                            value={editing.price}
                            onChange={(e) =>
                                setEditing({ ...editing, price: e.target.value })
                            }
                            className="border p-2 w-full"
                        />

                        <input
                            value={editing.image}
                            onChange={(e) =>
                                setEditing({ ...editing, image: e.target.value })
                            }
                            className="border p-2 w-full"
                        />

                        {/* PREVIEW */}
                        {editing.image && (
                            <img
                                src={editing.image}
                                className="h-24 w-full object-cover rounded"
                            />
                        )}

                        <div className="flex justify-between">
                            <button
                                onClick={() => setEditing(null)}
                                className="text-gray-500"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}