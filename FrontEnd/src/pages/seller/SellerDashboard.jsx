import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerDashboard() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    description: ""
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/api/seller/products/${editingId}`, form);
        alert("Product updated");
      } else {
        await api.post("/api/seller/products", form);
        alert("Product added");
      }

      setForm({ name: "", price: "", category: "", description: "" });
      setEditingId(null);
      loadProducts();

    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  const edit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price,
      category: p.category || "",
      description: p.description || ""
    });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/api/seller/products/${id}`);
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

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow mb-10 grid grid-cols-2 gap-4 max-w-3xl"
      >

        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button className="bg-black text-white py-2 rounded col-span-2 hover:bg-gray-800">
          {editingId ? "Update Product" : "Add Product"}
        </button>

      </form>

      {/* PRODUCT LIST */}
      <h2 className="text-2xl font-medium mb-4">My Products</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">

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
                <td className="p-3 text-center">{p.category}</td>

                <td className="p-3 text-center space-x-3">

                  <button
                    onClick={() => edit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(p.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No products yet.
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
