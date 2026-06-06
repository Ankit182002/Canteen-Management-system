import { useEffect, useState } from "react";
import axios from "axios";
import ShopCard from "../../components/ShopCard";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/shops")
      .then((res) => setShops(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Available Shops 🍽️
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
        {shops.map((shop) => (
          <div
            key={shop._id}
            onClick={() => navigate(`/menu/${shop._id}`)} // ✅ FIX
            className="cursor-pointer"
          >
            <ShopCard shop={shop} />
          </div>
        ))}

      </div>
    </div>
  );
}