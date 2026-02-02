import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useCart } from "../../cart/CartContext";

export default function CustomerDashboard() {
  const { cartCount } = useCart();
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState({ profile: null, addresses: [], orders: [], payments: [] });
  const [loading, setLoading] = useState(true);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ addrLine1: "", city: "", zipCode: "", state: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // ✅ STEP 1: Fetch Core Data (Profile, Orders, Payments)
      // We separate these from Addresses so one error doesn't kill the whole page
      const [profileRes, ordersRes, paymentsRes] = await Promise.all([
        api.get("/api/customers/me"),
        api.get("/api/customers/me/orders"),
        api.get("/api/customers/me/payments")
      ]);

      // ✅ STEP 2: Fetch Addresses with a "Safety Catch"
      // This prevents the 500 error from stopping the dashboard load
      let addressData = [];
      try {
        const addrRes = await api.get("/api/address/me");
        addressData = addrRes.data || [];
      } catch (addrErr) {
        console.error("Address node sync failed, but continuing dashboard...", addrErr);
      }

      setData({
        profile: profileRes.data,
        addresses: addressData,
        orders: ordersRes.data || [],
        payments: paymentsRes.data || []
      });
    } catch (err) {
      console.error("Core Dashboard sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      // ✅ Matches your PutMapping("/me")
      await api.put("/api/customers/me", data.profile);
      setIsEditingProfile(false);
      loadData();
      alert("Identity synchronized successfully");
    } catch (err) { alert("Update failed"); }
  };

  const badge = (status) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-700";
      case "PENDING": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse text-2xl uppercase italic tracking-tighter">Syncing_Hub_Data...</div>;

  return (
    <div className="bg-slate-50 min-h-screen p-8 lg:p-12 space-y-10">
      
      {/* 🚀 HUB HEADER */}
      <div className="flex justify-between items-center max-w-6xl mx-auto bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">Dashboard Hub</h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest italic">{data.profile?.user?.email}</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-slate-50 px-6 py-2 rounded-2xl flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Cart</span>
                <span className="text-xl font-black text-indigo-600">{cartCount}</span>
            </div>
            <button onClick={loadData} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">Refresh Hub</button>
        </div>
      </div>

      {/* 🧭 TAB NAVIGATION */}
      <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto pb-2">
        {['profile', 'orders', 'payments'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all ${
              activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {tab === 'profile' ? 'My Identity' : tab === 'orders' ? 'Order History' : 'Payment Ledger'}
          </button>
        ))}
      </div>

      <div className="max-w-6xl mx-auto">
        {/* 👤 IDENTITY TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-black uppercase text-[10px] tracking-widest text-slate-300">Core Attributes</h2>
                <button onClick={() => setIsEditingProfile(!isEditingProfile)} className="text-indigo-600 text-[10px] font-black uppercase underline">
                  {isEditingProfile ? "Cancel" : "Modify"}
                </button>
              </div>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <input className="w-full border-2 p-4 rounded-2xl font-bold text-sm" value={data.profile?.user?.name} onChange={e => setData({...data, profile: {...data.profile, user: {...data.profile.user, name: e.target.value}}})} />
                  <input className="w-full border-2 p-4 rounded-2xl font-bold text-sm" value={data.profile?.user?.number} onChange={e => setData({...data, profile: {...data.profile, user: {...data.profile.user, number: e.target.value}}})} />
                  <button onClick={handleProfileUpdate} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">Save Node</button>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-3xl font-black text-slate-800 tracking-tighter uppercase italic">{data.profile?.user?.name}</p>
                  <p className="text-slate-400 text-xs font-bold">{data.profile?.user?.number}</p>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h2 className="font-black uppercase text-[10px] tracking-widest text-slate-300 mb-6">Registered Shipping Nodes</h2>
              {data.addresses.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase italic">No Addresses Found in Database</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.addresses.map(addr => (
                    <div key={addr.aid} className="p-6 border-2 border-slate-50 rounded-[2rem] bg-slate-50/50">
                        <p className="text-xs font-black text-slate-700">{addr.addrLine1}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.city}, {addr.state}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📦 ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {data.orders.length === 0 ? <p className="text-center font-bold text-slate-300 uppercase p-10">No Orders recorded.</p> : 
              data.orders.map(order => (
                <div key={order.orderId} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex justify-between items-center hover:shadow-lg transition-all">
                  <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Node ID: #{order.orderId}</p>
                    <p className="font-black text-indigo-600 text-3xl tracking-tighter italic">₹{order.totalAmount?.toLocaleString()}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">{order.orderDate}</p>
                  </div>
                  <span className={`text-[10px] font-black px-6 py-2 rounded-full uppercase ${badge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))
            }
          </div>
        )}

        {/* 💳 PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {data.payments.length === 0 ? <p className="text-center font-bold text-slate-300 uppercase p-10">No Payments found.</p> : 
              data.payments.map(p => (
                <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction: {p.razorpayPaymentId || 'PENDING'}</p>
                    <p className={`text-2xl font-black uppercase italic ${p.status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500'}`}>{p.status}</p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase italic">Ref Order: #{p.orderId}</p>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{p.amount?.toLocaleString()}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}