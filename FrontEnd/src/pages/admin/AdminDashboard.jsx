import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];
const CATEGORIES = ["CLOTHING","ACCESSORIES","SHOES","CROCKERY","ELECTRONICS","GROCERIES"];

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // product edit state
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [p, s, o, c, pay] = await Promise.all([
        api.get("/api/admin/products"),
        api.get("/api/admin/sellers"),
        api.get("/api/admin/orders"),
        api.get("/api/admin/customers"),
        api.get("/api/admin/payments")
      ]);

      setProducts(p.data);
      setSellers(s.data);
      setOrders(o.data);
      setCustomers(c.data);
      setPayments(pay.data);

    } catch (err) {
      console.error(err);
      alert("Admin load failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= PRODUCTS =================

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await api.delete(`/api/products/${id}`);
    loadAll();
  };

  const startEdit = (p) => {
    setEditing({ ...p });
  };

  const saveEdit = async () => {
    try {
      await api.put(`/api/products/${editing.id}`, {
        ...editing,
        price: Number(editing.price),
        unitsAvailable: Number(editing.unitsAvailable)
      });

      setEditing(null);
      loadAll();
    } catch (e) {
      alert("Product update failed");
      console.error(e);
    }
  };

  // ================= SELLERS =================

  const editSeller = async (s) => {
    const company = prompt("Company name", s.companyName);
    if (!company) return;

    await api.put(`/api/admin/sellers/${s.id}`, {
      ...s,
      companyName: company
    });

    loadAll();
  };

  const deleteSeller = async (id) => {
    if (!window.confirm("Delete seller?")) return;
    await api.delete(`/api/admin/sellers/${id}`);
    loadAll();
  };

  // ================= CUSTOMERS =================

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete customer?")) return;
    await api.delete(`/api/customers/${id}`);
    loadAll();
  };

  const viewCustomerOrders = async (id) => {
    const res = await api.get(`/api/orders/customer/${id}`);
    alert(JSON.stringify(res.data, null, 2));
  };

  // ================= ORDERS =================

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, null, {
        params: { status: status.trim() }
      });

      loadAll();
    } catch (e) {
      console.error(e);
      alert("Order status update failed");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10 space-y-12">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* ================= PRODUCT EDIT FORM ================= */}
      {editing && (
        <div className="bg-white p-6 rounded shadow space-y-3">
          <h2 className="text-xl font-semibold">Edit Product #{editing.id}</h2>

          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={editing.name}
            onChange={e=>setEditing({...editing,name:e.target.value})}
          />

          <input
            className="border p-2 w-full"
            placeholder="Price"
            value={editing.price}
            onChange={e=>setEditing({...editing,price:e.target.value})}
          />

          <select
            className="border p-2 w-full"
            value={editing.pcategory}
            onChange={e=>setEditing({...editing,pcategory:e.target.value})}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            className="border p-2 w-full"
            placeholder="Units"
            value={editing.unitsAvailable}
            onChange={e=>setEditing({...editing,unitsAvailable:e.target.value})}
          />

          <textarea
            className="border p-2 w-full"
            placeholder="Description"
            value={editing.description || ""}
            onChange={e=>setEditing({...editing,description:e.target.value})}
          />

          <div className="flex gap-4">
            <button onClick={saveEdit} className="bg-black text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={()=>setEditing(null)} className="border px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= PRODUCTS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Products</h2>
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th><th>Name</th><th>Price</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t text-center">
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.pcategory}</td>
                <td>
                  <button onClick={()=>startEdit(p)}>✏️</button>
                  <button onClick={()=>deleteProduct(p.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= SELLERS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Sellers</h2>
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th><th>Company</th><th>User</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map(s => (
              <tr key={s.id} className="border-t text-center">
                <td>{s.id}</td>
                <td>{s.companyName}</td>
                <td>{s.user?.email}</td>
                <td>
                  <button onClick={()=>editSeller(s)}>✏️</button>
                  <button onClick={()=>deleteSeller(s.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= CUSTOMERS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Customers</h2>
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-t text-center">
                <td>{c.id}</td>
                <td>{c.user?.name}</td>
                <td>{c.user?.email}</td>
                <td>
                  <button onClick={()=>viewCustomerOrders(c.id)}>📦</button>
                  <button onClick={()=>deleteCustomer(c.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= ORDERS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Orders</h2>
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th>OrderId</th><th>Customer</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.orderId} className="border-t text-center">
                <td>{o.orderId}</td>
                <td>{o.customerId}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <select value={o.status} onChange={e=>updateStatus(o.orderId,e.target.value)}>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= PAYMENTS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Payments</h2>
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr><th>PaymentId</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t text-center">
                <td>{p.id}</td>
                <td>₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
