import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ProductDetails() {

  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    api.get(`/api/products/${id}`).then(r => setP(r.data));
  }, []);

  if (!p) return null;

  return (
    <div className="p-10 flex gap-10">

      <img src={p.imageUrl || "https://via.placeholder.com/400"} className="w-96"/>

      <div>
        <h1 className="text-3xl">{p.name}</h1>
        <p className="text-xl mt-2">₹{p.price}</p>
        <p className="mt-4">{p.description}</p>

        <button className="bg-black text-white px-6 py-2 mt-6">
          Add to Cart
        </button>
      </div>

    </div>
  );
}
