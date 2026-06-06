import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ APPROVE USER
  const approveUser = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // update UI
      setUsers(prev =>
        prev.map(u =>
          u._id === id ? { ...u, isApproved: true } : u
        )
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Users</h2>

      {users.map(u => (
        <div
          key={u._id}
          className="bg-white p-3 shadow mb-2 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{u.email}</p>
            <p className="text-sm text-gray-500">
              Role: {u.role}
            </p>

            {/* STATUS */}
            {u.role === "owner" && (
              <p className={`text-sm ${
                u.isApproved ? "text-green-600" : "text-red-500"
              }`}>
                {u.isApproved ? "Approved" : "Pending"}
              </p>
            )}
          </div>

          {/* APPROVE BUTTON */}
          {u.role === "owner" && !u.isApproved && (
            <button
              onClick={() => approveUser(u._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}