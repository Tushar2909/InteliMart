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

      const ordersRes = await api.get("/api/customers/me/orders");
      setOrders(ordersRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen p-10">

      <h1 className="text-3xl font-semibold mb-8">Customer Dashboard</h1>

      {/* PROFILE */}
      <div className="bg-white rounded-xl shadow p-6 w-[420px] mb-10">

        <h2 className="text-xl font-medium mb-4">Profile</h2>

        <p className="mb-2">
          <b>Name:</b> {profile.user?.name || profile.name}
        </p>

        <p className="mb-2">
          <b>Email:</b> {profile.user?.email || profile.email}
        </p>

        <p>
          <b>Phone:</b> {profile.user?.phone || profile.phone}
        </p>

      </div>

      {/* ORDERS */}
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}

      <div className="space-y-6">

        {orders.map(order => (

          <div
            key={order.id}
            className="bg-white rounded-xl shadow p-6"
          >

            <div className="flex justify-between mb-4">

              <div>
                <p><b>Order ID:</b> #{order.id}</p>
                <p className="text-gray-500 text-sm">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="font-medium">₹{order.totalAmount}</p>
                <span className="text-sm px-3 py-1 rounded bg-indigo-100 text-indigo-700">
                  {order.status}
                </span>
              </div>

            </div>

            {/* ITEMS */}
            <div className="border-t pt-4 space-y-2">

              {order.orderItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product?.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}
