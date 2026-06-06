import { useNavigate } from "react-router-dom";

export default function ShopCard({ shop }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/menu`)} // 👈 STEP 3 HERE
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
        >

            <img
                src={shop.image}
                alt={shop.name}
                className="w-full h-40 object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-semibold">{shop.name}</h2>

                <p className="text-gray-500 text-sm">
                    {shop.category}
                </p>

                <div className="mt-2 text-yellow-500">
                    ⭐ {shop.rating}
                </div>
            </div>
        </div>
    );
}