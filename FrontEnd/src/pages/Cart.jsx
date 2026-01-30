import { useCart } from "../cart/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Cart() {
  const { cart, removeFromCart, changeQty, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [newAddress, setNewAddress] = useState({
    zipcode: "",
    state: "",
    city: "",
    street: "",
    detailAddress: ""
  });

  const total = cart.reduce(
    (sum, p) => sum + Number(p.productPrice) * Number(p.quantity),
    0
  );

  useEffect(() => {
    if (user?.id) loadAddresses();
  }, [user?.id]);

  const loadAddresses = async () => {
    const res = await api.get(`/api/addresses/customer/${user.id}`);
    setAddresses(res.data || []);
    if (res.data?.length) setSelectedAddress(res.data[0].aid);
  };

  const addAddress = async () => {
    await api.post(`/api/addresses/customer/${user.id}`, {
      ...newAddress,
      customerId: user.id
    });
    loadAddresses();
  };

  const payNow = async () => {
    if (!cart.length) return alert("Cart empty");
    if (!selectedAddress) return alert("Select address");

    const orderRes = await api.post(
      `/api/orders/place/${user.id}`,
      null,
      { params: { addressId: selectedAddress } }
    );

    const orderId = orderRes.data.orderId;

    const payRes = await api.post(`/api/payments/razorpay/${orderId}`);
    const payment = payRes.data;

    new window.Razorpay({
      key: "rzp_test_S88JK7IccT0yYB",
      amount: Number(payment.amount) * 100,
      currency: "INR",
      order_id: payment.razorpayOrderId,

      handler: async (r) => {
        await api.post(`/api/payments/verify`, null, {
          params: {
            paymentId: payment.id,
            razorpayPaymentId: r.razorpay_payment_id,
            razorpayOrderId: r.razorpay_order_id,
            signature: r.razorpay_signature
          }
        });

        await clearCart();
        navigate("/customer");
      }
    }).open();
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl mb-6">Cart</h1>

      {cart.map(p => (
        <div key={p.cartItemId} className="border p-4 mb-3 rounded">

          <b>{p.productName}</b> – ₹{p.productPrice}

          <input
            type="number"
            min="1"
            value={p.quantity}
            className="border ml-4 w-16 text-center"
            onChange={e => changeQty(p.cartItemId, Number(e.target.value))}
          />

          <button
            className="ml-4 text-red-600"
            onClick={() => removeFromCart(p.cartItemId)}
          >
            Remove
          </button>

        </div>
      ))}

      <h2 className="mt-4 font-semibold">Total: ₹{total}</h2>

      <h3 className="mt-6">Address</h3>

      {addresses.map(a => (
        <div key={a.aid}>
          <input
            type="radio"
            checked={selectedAddress === a.aid}
            onChange={() => setSelectedAddress(a.aid)}
          />
          {a.street}
        </div>
      ))}

      <input
        className="border mt-3 p-2"
        placeholder="Zip"
        value={newAddress.zipcode}
        onChange={e => setNewAddress({ ...newAddress, zipcode: e.target.value })}
      />

      <button className="ml-3 border px-4 py-2" onClick={addAddress}>
        Add Address
      </button>

      <br /><br />

      <button className="border px-6 py-2" onClick={payNow}>
        Checkout
      </button>

    </div>
  );
}
