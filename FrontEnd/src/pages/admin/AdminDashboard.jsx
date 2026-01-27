import { useEffect, useState } from "react";
import api from "../../api/axios";

const STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminDashboard() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [p, o, s, pay] = await Promise.all([
        api.get("/api/admin/products"),
        api.get("/api/admin/orders"),
        api.get("/api/admin/sellers"),
        api.get("/api/admin/payments")
      ]);

      setProducts(p.data);
      setOrders(o.data);
      setSellers(s.data);
      setPayments(pay.data);

    } catch (err) {
      console.error(err);
      alert("Admin load failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await api.delete(`/api/products/${id}`);
      loadAll();
    } catch {
      alert("Delete failed");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status?status=${status}`);
      loadAll();
    } catch {
      alert("Status update failed");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10 space-y-12">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* PRODUCTS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t text-center">
                <td className="p-3">{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.pcategory}</td>
                <td>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ORDERS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Orders</h2>

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">OrderId</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.orderId} className="border-t text-center">
                <td className="p-3">{o.orderId}</td>
                <td>{o.customerId}</td>
                <td>₹{o.totalAmount}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.orderId, e.target.value)}
                    className="border p-1 rounded"
                  >
                    {STATUSES.map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SELLERS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Sellers</h2>

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Id</th>
              <th>Name</th>
            </tr>
          </thead>

          <tbody>
            {sellers.map(s => (
              <tr key={s.id} className="border-t text-center">
                <td className="p-3">{s.id}</td>
                <td>{s.user?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PAYMENTS */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Payments</h2>

        <table className="w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Id</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t text-center">
                <td className="p-3">{p.id}</td>
                <td>₹{p.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
