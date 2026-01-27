import { useCart } from "../cart/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Cart() {

  const { cart, removeFromCart, changeQty, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((a, b) => a + b.price * b.qty, 0);

  const checkout = async () => {

    if (cart.length === 0) return;

    setLoading(true);

    try {

      const payload = {
        items: cart.map(p => ({
          productId: p.id,
          quantity: p.qty
        }))
      };

      await api.post("/api/orders", payload);

      clearCart();

      alert("Order placed successfully!");

      navigate("/customer");

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-12">

      <h1 className="text-3xl font-semibold mb-10">Your Cart</h1>

      {cart.length === 0 && <p>Your cart is empty.</p>}

      {cart.map(p => (
        <div key={p.id} className="bg-white p-6 mb-4 rounded-xl shadow flex justify-between">

          <div>
            <h2 className="font-medium">{p.name}</h2>
            <p className="text-gray-500">₹{p.price}</p>

            <input
              type="number"
              min="1"
              value={p.qty}
              onChange={e => changeQty(p.id, Number(e.target.value))}
              className="border w-16 mt-2"
            />
          </div>

          <button onClick={() => removeFromCart(p.id)} className="text-red-500">
            Remove
          </button>

        </div>
      ))}

      {cart.length > 0 && (
        <div className="bg-white p-6 mt-6 rounded-xl shadow flex justify-between items-center">

          <h2 className="text-xl">Total: ₹{total}</h2>

          <button
            disabled={loading}
            onClick={checkout}
            className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
          >
            {loading ? "Placing order..." : "Checkout"}
          </button>

        </div>
      )}

    </div>
  );
}
