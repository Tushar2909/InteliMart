import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CustomerDashboard() {

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const profileRes = await api.get("/api/customers/me");
      setProfile(profileRes.data);

      // ✅ backend endpoint
      const ordersRes = await api.get("/api/orders/customer");
      setOrders(ordersRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const badge = (status) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700";
      case "SHIPPED": return "bg-blue-100 text-blue-700";
      case "CANCELLED": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Customer Dashboard</h1>

        <button
          onClick={loadData}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {/* PROFILE */}
      <div className="bg-white rounded-xl shadow p-6 w-[420px] mb-10">

        <h2 className="text-xl font-medium mb-4">Profile</h2>

        <p className="mb-2">
          <b>Name:</b> {profile?.user?.name}
        </p>

        <p className="mb-2">
          <b>Email:</b> {profile?.user?.email}
        </p>

        <p>
          <b>Phone:</b> {profile?.user?.number}
        </p>

      </div>

      {/* ORDERS */}
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {orders.length === 0 && (
        <div className="bg-white p-6 rounded shadow text-gray-500">
          No orders yet.
        </div>
      )}

      <div className="space-y-6">

        {orders.map(order => (

          <div
            key={order.orderId}
            className="bg-white rounded-xl shadow p-6"
          >

            <div className="flex justify-between items-center">

              <div>
                <p className="font-medium">Order #{order.orderId}</p>
                <p className="text-gray-500 text-sm">
                  {order.orderDate}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-lg">
                  ₹{order.totalAmount}
                </p>

                <span
                  className={`text-sm px-3 py-1 rounded ${badge(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
