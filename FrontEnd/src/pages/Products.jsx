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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

        {products.map(p => (

          <div
            key={p.id}
            className="bg-white rounded-2xl border shadow hover:shadow-xl transition transform hover:-translate-y-1"
          >

            <div
              onClick={() => navigate(`/product/${p.id}`)}
              className="cursor-pointer"
            >
              <img
                src="https://via.placeholder.com/400x420"
                className="w-full h-[260px] object-cover rounded-t-2xl hover:scale-105 transition"
              />
            </div>

            <div className="p-6 text-center">

              <h2
                onClick={() => navigate(`/product/${p.id}`)}
                className="font-medium cursor-pointer hover:text-indigo-600"
              >
                {p.name}
              </h2>

              <p className="text-gray-500 mt-1">₹{p.price}</p>

              <button
                onClick={() => {
                  addToCart(p);
                  alert("Added to cart");
                }}
                className="mt-5 w-full py-2 rounded-lg border hover:bg-black hover:text-white transition"
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
