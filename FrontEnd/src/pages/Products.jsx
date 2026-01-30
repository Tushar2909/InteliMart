import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/api/products").then(res => setProducts(res.data));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen px-14 py-12">
      <h1 className="text-3xl font-semibold mb-10">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

        {products.map(p => (

          <div
            key={p.id}
            className="bg-white rounded-2xl border shadow
                       hover:shadow-xl hover:-translate-y-1
                       transition-all duration-300"
          >

            <div
              onClick={() => navigate(`/product/${p.id}`)}
              className="cursor-pointer overflow-hidden rounded-t-2xl"
            >
              <img
                src={p.imageUrl || "https://via.placeholder.com/400x350"}
                alt={p.name}
                className="w-full h-[240px] object-cover
                           hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="p-6 text-center">

              <h2
                onClick={() => navigate(`/product/${p.id}`)}
                className="font-medium text-lg cursor-pointer hover:text-indigo-600"
              >
                {p.name}
              </h2>

              <p className="text-gray-500 mt-1">₹{p.price}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(p.id, 1);
                }}
                className="mt-5 w-full py-2 rounded-lg border font-medium
                           hover:bg-black hover:text-white transition"
              >
                Add to Cart
              </button>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}
