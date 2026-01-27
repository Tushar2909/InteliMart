import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SellerOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/api/seller/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load seller orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status/${status}`);
      loadOrders();
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10">

      <h1 className="text-3xl font-semibold mb-6">Seller Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {orders.map(o => (
              <tr key={`${o.orderId}-${o.productName}`} className="border-t">

                <td className="p-3">#{o.orderId}</td>
                <td className="p-3">{o.productName}</td>
                <td className="p-3 text-center">{o.quantity}</td>
                <td className="p-3 text-center">₹{o.amount}</td>
                <td className="p-3 text-center">{o.orderDate}</td>

                <td className="p-3 text-center">
                  <span className="px-2 py-1 bg-gray-200 rounded">
                    {o.status}
                  </span>
                </td>

                <td className="p-3 text-center">

                  {o.status === "PLACED" && (
                    <button
                      onClick={() => updateStatus(o.orderId, "PACKED")}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Pack
                    </button>
                  )}

                  {o.status === "PACKED" && (
                    <button
                      onClick={() => updateStatus(o.orderId, "SHIPPED")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Ship
                    </button>
                  )}

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
