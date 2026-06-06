import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function MenuPage() {
    const { shopId } = useParams(); // ✅ get shop id from URL
    const [items, setItems] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/menu/shop/${shopId}`) 
            .then(res => setItems(res.data))
            .catch(err => console.log(err));
    }, [shopId]);

    return (
        <div className="bg-gray-50 min-h-screen px-6 py-10">

            <h1 className="text-3xl font-bold mb-6">
                Menu 🍔
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {items.map(item => (
                    <div key={item._id} className="bg-white rounded-xl shadow-md p-4">

                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded"
                        />

                        <h2 className="font-bold mt-2">{item.name}</h2>
                        <p className="text-sm text-gray-500">{item.description}</p>

                        <div className="flex justify-between items-center mt-3">
                            <span className="text-orange-500 font-bold">
                                ₹{item.price}
                            </span>

                            <button
                                onClick={() => addToCart(item)}
                                className="bg-orange-500 text-white px-3 py-1 rounded"
                            >
                                Add
                            </button>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}