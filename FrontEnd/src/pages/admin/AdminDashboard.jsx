import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const { logout } = useAuth();

  useEffect(() => {
    api.get("/api/products?page=0&size=50")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-10">

      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {products.map(p => (
        <div key={p.id} className="border p-2 mb-2">
          {p.name} — seller {p.sellerId}
        </div>
      ))}

    </div>
  );
}
