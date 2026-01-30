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

  const [imageFile, setImageFile] = useState(null);

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

  // ================= LOAD =================

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

  // ================= FORM =================

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();

    if (!editingId && !imageFile) {
      alert("Please select image");
      return;
    }

    const fd = new FormData();

    if (imageFile) fd.append("image", imageFile);

    fd.append(
      "data",
      new Blob([JSON.stringify({
        name: form.name,
        price: Number(form.price),
        pcategory: form.pcategory,
        unitsAvailable: Number(form.unitsAvailable),
        description: form.description
      })], { type: "application/json" })
    );

    try {
      if (editingId)
        await api.put(`/api/seller/products/${editingId}`, fd);
      else
        await api.post("/api/seller/products", fd);

      alert("Saved");

      setForm({
        name: "",
        price: "",
        pcategory: "CLOTHING",
        unitsAvailable: 1,
        description: ""
      });

      setImageFile(null);
      setEditingId(null);
      loadProducts();

    } catch (err) {
      console.error(err.response?.data || err);
      alert("Save failed");
    }
  };

  const edit = p => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      pcategory: p.pcategory,
      unitsAvailable: p.unitsAvailable || 1,
      description: p.description || ""
    });
  };

  const remove = async id => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/api/seller/products/${id}`);
    loadProducts();
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10">

      <h1 className="text-3xl font-semibold mb-8">Seller Dashboard</h1>

      {/* ADD PRODUCT */}
      <form onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow mb-10 grid grid-cols-2 gap-4 max-w-3xl">

        <input name="name" placeholder="Product name"
          value={form.name} onChange={handleChange}
          className="border p-2 rounded" required />

        <input name="price" placeholder="Price" type="number"
          value={form.price} onChange={handleChange}
          className="border p-2 rounded" required />

        {/* FILE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files[0])}
          className="border p-2 rounded col-span-2"
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            className="col-span-2 h-48 object-contain border rounded"
          />
        )}

        <div className="col-span-2">
          <p className="font-medium mb-2">Category</p>
          <div className="flex gap-4 flex-wrap">
            {CATEGORIES.map(c => (
              <label key={c} className="flex items-center gap-1">
                <input type="radio" name="pcategory" value={c}
                  checked={form.pcategory === c}
                  onChange={handleChange} />
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
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Category</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t text-center">
                <td className="p-3">
                  <img src={p.imageUrl} className="h-12 mx-auto" />
                </td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.pcategory}</td>
                <td className="space-x-3">
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
                <td>{o.productName}</td>
                <td>{o.quantity}</td>
                <td>₹{o.amount}</td>
                <td>{o.status}</td>
                <td>{o.orderDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
