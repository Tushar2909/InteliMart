import { useEffect, useState } from "react";
import api from "../../api/axios";

const CATEGORIES = [
  "CLOTHING",
  "ACCESSORIES",
  "SHOES",
  "CROCKERY",
  "ELECTRONICS",
  "GROCERIES"
];

export default function SellerDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    pcategory: "CLOTHING",
    unitsAvailable: 1,
    description: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  // ================= PRODUCTS =================

  const loadProducts = async () => {
    try {
      const res = await api.get("/api/seller/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price),
      unitsAvailable: Number(form.unitsAvailable)
    };

    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
        alert("Product updated");
      } else {
        await api.post("/api/products", payload);
        alert("Product added");
      }

      setForm({
        name: "",
        price: "",
        pcategory: "CLOTHING",
        unitsAvailable: 1,
        description: ""
      });

      setEditingId(null);
      loadProducts();

    } catch (err) {
      console.error(err.response?.data || err);
      alert("Save failed");
    }
  };

  const edit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      pcategory: p.pcategory,
      unitsAvailable: p.unitsAvailable || 1,
      description: p.description || ""
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/api/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10">

      <h1 className="text-3xl font-semibold mb-8">Seller Dashboard</h1>

      {/* ADD PRODUCT */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow mb-10 grid grid-cols-2 gap-4 max-w-3xl"
      >

        <input name="name" placeholder="Product name" value={form.name}
          onChange={handleChange} className="border p-2 rounded" required />

        <input name="price" placeholder="Price" type="number" value={form.price}
          onChange={handleChange} className="border p-2 rounded" required />

        <div className="col-span-2">
          <p className="font-medium mb-2">Category</p>
          <div className="flex gap-4 flex-wrap">
            {CATEGORIES.map(c => (
              <label key={c} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="pcategory"
                  value={c}
                  checked={form.pcategory === c}
                  onChange={handleChange}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <input name="unitsAvailable" type="number" min="1"
          value={form.unitsAvailable} onChange={handleChange}
          className="border p-2 rounded" />

        <input name="description" placeholder="Description"
          value={form.description} onChange={handleChange}
          className="border p-2 rounded" />

        <button className="bg-black text-white py-2 rounded col-span-2 hover:bg-gray-800">
          {editingId ? "Update Product" : "Add Product"}
        </button>

      </form>

      {/* PRODUCTS */}
      <h2 className="text-2xl font-medium mb-4">My Products</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden mb-12">

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-center">₹{p.price}</td>
                <td className="p-3 text-center">{p.pcategory}</td>
                <td className="p-3 text-center space-x-3">
                  <button onClick={() => edit(p)} className="text-blue-600">Edit</button>
                  <button onClick={() => remove(p.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* ORDERS */}
      <h2 className="text-2xl font-medium mb-4">Orders</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.orderId} className="border-t text-center">
                <td className="p-3">{o.productName}</td>
                <td className="p-3">{o.quantity}</td>
                <td className="p-3">₹{o.amount}</td>
                <td className="p-3">{o.status}</td>
                <td className="p-3">{o.orderDate}</td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}
