import { useEffect, useState } from "react";
import api from "../../api/axios";

/** PROFESSIONAL ICON ASSETS */
const TRASH_ICON = "🗑️";
const EDIT_ICON = "✏️";
const BOX_ICON = "📦";
const REVENUE_ICON = "💰";
const USERS_ICON = "👥";
const VENDOR_ICON = "🏢";
const CARD_ICON = "💳";

/** ✅ FIXED: Synchronized with backend Status.java enum */
const STATUSES = ["CONFIRMED", "INTRANSIT", "DISPATCHED", "OUTFORDELIVERY", "DELIVERED", "PENDING"];
const CATEGORIES = ["CLOTHING", "ACCESSORIES", "SHOES", "CROCKERY", "ELECTRONICS", "GROCERIES"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];
const PAYMENT_STATUSES = ["FAILED", "SUCCESS", "PENDING", "REFUNDED"];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductImage, setEditProductImage] = useState(null);
  const [editingSeller, setEditingSeller] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [p, s, o, c, pay] = await Promise.all([
        api.get("/api/admin/products"),
        api.get("/api/admin/sellers"),
        api.get("/api/admin/orders"),
        api.get("/api/admin/customers"),
        api.get("/api/admin/payments"),
      ]);
      setProducts(p.data || []);
      setSellers(s.data || []);
      setOrders(o.data || []);
      setCustomers(c.data || []);
      setPayments(pay.data || []);
    } catch (err) { alert("System load failed."); } finally { setLoading(false); }
  };

  // ================= INVENTORY LOGIC =================
  const saveProductEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify({
        ...editingProduct,
        price: Number(editingProduct.price),
        unitsAvailable: Number(editingProduct.unitsAvailable)
      })], { type: "application/json" }));
      if (editProductImage) formData.append("image", editProductImage);

      await api.put(`/api/admin/products/${editingProduct.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setEditingProduct(null); setEditProductImage(null); loadAll();
      alert("Inventory Synchronized");
    } catch (e) { alert("Product Protocol Failure"); }
  };

  const deleteProduct = async (id) => { 
    if (window.confirm("Delete asset?")) { 
        await api.delete(`/api/admin/products/${id}`); loadAll(); 
    } 
  };

  // ================= VENDOR LOGIC =================
  const saveSellerEdit = async () => {
    try {
      await api.put(`/api/admin/sellers/${editingSeller.id}`, editingSeller);
      setEditingSeller(null); loadAll();
      alert("Vendor Profile Updated");
    } catch (err) { alert("Seller Update Error"); }
  };

  const deleteSeller = async (id) => { 
    if (window.confirm("Terminate vendor?")) { 
        await api.delete(`/api/admin/sellers/${id}`); loadAll(); 
    } 
  };

  // ================= CLIENT LOGIC (Fixed for Nested UserDto) =================
  const saveCustomerEdit = async () => {
    try {
      // ✅ Sending the CustomerDto which contains the nested UserDto
      await api.put(`/api/admin/customers/${editingCustomer.id}`, editingCustomer);
      setEditingCustomer(null); 
      loadAll();
      alert("Client Security Profile Updated");
    } catch (err) { alert("Client Update Protocol Error"); }
  };

  const deleteCustomer = async (id) => { 
    if (window.confirm("Wipe customer record?")) { 
      await api.delete(`/api/admin/customers/${id}`); 
      loadAll(); 
    } 
  };
  
  const viewCustomerOrders = async (id) => {
    try {
        const res = await api.get(`/api/admin/orders/customer/${id}`);
        alert(`Order History for Client ${id}:\n` + JSON.stringify(res.data, null, 2));
    } catch (err) { alert("Trace failed"); }
  };

  // ================= ORDER LOGIC =================
  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, null, { 
        params: { status: status.trim().toUpperCase() } 
      });
      loadAll();
      alert("Status Updated Successfully");
    } catch (e) { alert("Status Transition Denied"); }
  };

  const deleteOrder = async (id) => {
    if (window.confirm("Permanently delete this order record?")) {
      try {
        await api.delete(`/api/admin/orders/${id}`);
        loadAll();
      } catch (err) { alert("Order removal failed."); }
    }
  };

  // ================= PAYMENT LOGIC =================
  const updatePaymentStatus = async (paymentId, status) => {
    try {
        await api.put(`/api/admin/payments/${paymentId}/status`, null, {
            params: { status: status.toUpperCase() }
        });
        loadAll();
    } catch (err) { alert("Payment status update failed"); }
  };

  const totalRevenue = payments
    .filter(p => p.status === "SUCCESS")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const inventoryValue = products.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.unitsAvailable) || 0), 0);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse text-4xl">SYNCING_ADMIN_NODES...</div>;

  return (
    <div className="bg-[#f8fafc] min-h-screen p-8 lg:p-12 space-y-20">
      
      <header className="flex flex-col md:flex-row justify-between items-center bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 gap-8">
        <div><h1 className="text-5xl font-black text-slate-900 tracking-tighter">System Infrastructure</h1><p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">Admin Terminal</p></div>
        <button onClick={loadAll} className="bg-indigo-600 text-white px-16 py-6 rounded-[2.5rem] font-black shadow-2xl hover:bg-slate-900 transition-all">Reload Databases</button>
      </header>

      {/* STAT CARDS SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-between h-56"><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{REVENUE_ICON} Revenue</p><h4 className="text-4xl font-black text-slate-900 tracking-tighter">₹{totalRevenue.toLocaleString()}</h4><p className="text-xs text-green-500 font-bold">Verified Success</p></div>
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-between h-56"><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{USERS_ICON} Directory</p><h4 className="text-4xl font-black text-slate-900 tracking-tighter">{customers.length}</h4><p className="text-xs text-slate-400 font-bold">Active Clients</p></div>
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-between h-56"><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{VENDOR_ICON} Partners</p><h4 className="text-4xl font-black text-slate-900 tracking-tighter">{sellers.length}</h4><p className="text-xs text-indigo-500 font-bold">Verified Entities</p></div>
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex flex-col justify-between h-56"><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Inventory</p><h4 className="text-4xl font-black text-slate-900 tracking-tighter">₹{inventoryValue.toLocaleString()}</h4><p className="text-xs text-orange-500 font-bold">Asset Value</p></div>
      </section>

      {/* PRODUCTS TABLE */}
      <section className="space-y-8">
        <h2 className="text-3xl font-black text-slate-800 px-6 border-l-[12px] border-indigo-600 uppercase tracking-tighter">Asset Ledger</h2>
        {editingProduct && (
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-4 border-indigo-500 mb-12">
            <h3 className="text-2xl font-black text-indigo-600 mb-8 uppercase tracking-widest">Override SKU: {editingProduct.id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <input className="border-2 p-5 rounded-3xl font-bold" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Name"/>
              <input className="border-2 p-5 rounded-3xl font-bold" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="Price"/>
              <select className="border-2 p-5 rounded-3xl font-bold" value={editingProduct.pcategory} onChange={e => setEditingProduct({...editingProduct, pcategory: e.target.value})}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <input type="file" className="text-xs font-bold" onChange={e => setEditProductImage(e.target.files[0])} />
            </div>
            <div className="flex gap-6 mt-12"><button onClick={saveProductEdit} className="flex-1 bg-indigo-600 text-white py-6 rounded-[2rem] font-black shadow-xl uppercase">Commit Sync</button><button onClick={() => setEditingProduct(null)} className="bg-slate-100 px-16 py-6 rounded-[2rem] font-black uppercase text-xs">Abort</button></div>
          </div>
        )}
        <div className="bg-white rounded-[4rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b"><tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest"><th className="py-10 px-12">UID</th><th className="py-10 px-12">Ident</th><th className="py-10 px-12 text-center">Protocol</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/20 border-b last:border-0"><td className="py-10 px-12 font-mono text-indigo-400 font-bold">P_UID_{p.id}</td><td className="py-10 px-12 font-black text-slate-700 text-lg uppercase">{p.name}</td><td className="py-10 px-12 flex justify-center gap-5"><button onClick={() => setEditingProduct({...p})} className="bg-indigo-50 text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs">Edit</button><button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black">{TRASH_ICON}</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SELLERS TABLE */}
      <section className="space-y-8">
        <h2 className="text-3xl font-black text-slate-800 px-6 border-l-[12px] border-green-600 uppercase tracking-tighter">Partner Mainframe</h2>
        {editingSeller && (
          <div className="bg-white p-10 rounded-[4rem] border-4 border-green-500 mb-12">
            <h3 className="text-2xl font-black text-green-600 mb-8 uppercase tracking-widest">Override SEL_{editingSeller.id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <input className="border-2 p-6 rounded-3xl font-bold" value={editingSeller.companyName} onChange={e => setEditingSeller({...editingSeller, companyName: e.target.value})} placeholder="Company"/>
              <input className="border-2 p-6 rounded-3xl font-bold" value={editingSeller.user.name} onChange={e => setEditingSeller({...editingSeller, user: {...editingSeller.user, name: e.target.value}})} placeholder="Admin"/>
            </div>
            <button onClick={saveSellerEdit} className="w-full mt-10 bg-green-600 text-white py-6 rounded-[2rem] font-black uppercase">Push Sync</button>
          </div>
        )}
        <div className="bg-white rounded-[4rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b"><tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest"><th className="py-10 px-12">Entity</th><th className="py-10 px-12 text-center">Compliance</th></tr></thead>
            <tbody>
              {sellers.map(s => (
                <tr key={s.id} className="hover:bg-green-50/20 border-b last:border-0"><td className="py-10 px-12 font-black text-slate-700 text-lg uppercase">{s.companyName}</td><td className="py-10 px-12 flex justify-center gap-5"><button onClick={() => setEditingSeller({...s, user: {...s.user}})} className="bg-green-50 text-green-700 px-10 py-4 rounded-2xl font-black text-xs">Edit</button><button onClick={() => deleteSeller(s.id)} className="bg-red-50 text-red-600 px-5 py-4 rounded-2xl font-black">{TRASH_ICON}</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ✅ CUSTOMERS TABLE WITH EDIT UI */}
      <section className="space-y-8">
        <h2 className="text-3xl font-black text-slate-800 px-6 border-l-[12px] border-orange-600 uppercase tracking-tighter">Client Hub</h2>
        
        {editingCustomer && (
          <div className="bg-white p-12 rounded-[4rem] border-4 border-orange-500 mb-12 shadow-2xl">
            <h3 className="text-2xl font-black text-orange-600 mb-8 uppercase tracking-widest">Override Client Profile: {editingCustomer.user.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest font-bold">Full Name</label>
                <input className="border-2 p-6 rounded-3xl font-bold focus:border-orange-500 outline-none transition-all" value={editingCustomer.user.name} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, name: e.target.value}})} placeholder="Client Name"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest font-bold">Contact Number</label>
                <input className="border-2 p-6 rounded-3xl font-bold focus:border-orange-500 outline-none transition-all" value={editingCustomer.user.number} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, number: e.target.value}})} placeholder="Mobile Number"/>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest font-bold">Gender Specification</label>
                <select className="border-2 p-6 rounded-3xl font-bold focus:border-orange-500 outline-none transition-all appearance-none bg-white px-8" value={editingCustomer.user.gender} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, gender: e.target.value}})}>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-6 mt-12">
                <button onClick={saveCustomerEdit} className="flex-1 bg-orange-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl hover:bg-slate-900 transition-all">Commit Profile Sync</button>
                <button onClick={() => setEditingCustomer(null)} className="bg-slate-100 px-16 py-6 rounded-[2.5rem] font-black uppercase text-xs hover:bg-slate-200 transition-all">Abort</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[4rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b"><tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest"><th className="py-10 px-12">Hash</th><th className="py-10 px-12 text-center">Fulfillment</th></tr></thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-orange-50/20 border-b last:border-0 transition-all"><td className="py-10 px-12 font-black text-slate-700 text-xl tracking-tighter uppercase">{c.user?.name}</td><td className="py-10 px-12 flex justify-center gap-5"><button onClick={() => viewCustomerOrders(c.id)} className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl">{BOX_ICON}</button><button onClick={() => setEditingCustomer({...c, user: {...c.user}})} className="bg-orange-50 text-orange-700 px-12 py-4 rounded-2xl font-black text-xs">Edit</button><button onClick={() => deleteCustomer(c.id)} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black">{TRASH_ICON}</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ORDERS TABLE */}
      <section className="space-y-8">
        <h2 className="text-3xl font-black text-slate-800 px-6 border-l-[12px] border-purple-600 uppercase tracking-tighter">Settlement Hub</h2>
        <div className="bg-white rounded-[4rem] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-purple-50">
              <tr className="text-purple-400 text-[11px] font-black uppercase tracking-widest"><th className="py-10 px-12">Trace ID</th><th className="py-10 px-12">Client</th><th className="py-10 px-12">Amount</th><th className="py-10 px-12">Protocol</th><th className="py-10 px-12 text-center">Actions</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId} className="border-b hover:bg-purple-50/20">
                  <td className="py-10 px-12 font-mono text-purple-600 font-bold uppercase text-xs">TRX_{o.orderId}</td>
                  <td className="py-10 px-12 font-black text-slate-700 uppercase">CUS_REF_{o.customerId}</td>
                  <td className="py-10 px-12 font-black text-slate-900">₹{o.totalAmount}</td>
                  <td className="py-10 px-12">
                    <select className={`border-4 rounded-[1.5rem] px-8 py-4 text-xs font-black outline-none transition-all ${o.status === "DELIVERED" ? "bg-green-500 text-white border-green-400" : "bg-white"}`} value={o.status} onChange={(e) => updateStatus(o.orderId, e.target.value)}>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                  </td>
                  <td className="py-10 px-12 flex justify-center gap-5"><button onClick={() => deleteOrder(o.orderId)} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black">{TRASH_ICON}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FINANCIAL OVERSIGHT */}
      <section className="space-y-8 pb-32">
        <h2 className="text-3xl font-black text-slate-800 px-6 border-l-[12px] border-emerald-600 uppercase tracking-tighter">Financial Oversight</h2>
        <div className="bg-white rounded-[4rem] overflow-hidden shadow-sm border border-slate-50">
          <table className="w-full text-left">
            <thead className="bg-emerald-50">
              <tr className="text-emerald-400 text-[11px] font-black uppercase tracking-widest">
                <th className="py-10 px-12">Payment Hash</th>
                <th className="py-10 px-12">Order Ref</th>
                <th className="py-10 px-12">Gateway Status</th>
                <th className="py-10 px-12">Method</th>
                <th className="py-10 px-12">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(pay => (
                <tr key={pay.id} className="border-b hover:bg-emerald-50/10">
                  <td className="py-10 px-12 font-mono text-xs text-emerald-600 font-bold italic">{pay.paymentId || `PAY_INTERNAL_${pay.id}`}</td>
                  <td className="py-10 px-12 font-black text-slate-700">ORD_{pay.orderId}</td>
                  <td className="py-10 px-12">
                    <select 
                        className={`text-[10px] font-black px-5 py-2 rounded-full border-2 ${pay.status === 'SUCCESS' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        value={pay.status}
                        onChange={(e) => updatePaymentStatus(pay.id, e.target.value)}
                    >
                        {PAYMENT_STATUSES.map(ps => <option key={ps} value={ps}>{ps}</option>)}
                    </select>
                  </td>
                  <td className="py-10 px-12 font-bold text-slate-400 text-[10px] uppercase tracking-widest">{pay.paymentMethod || "UPI / CARD"}</td>
                  <td className="py-10 px-12 font-black text-slate-900">₹{pay.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {payments.length === 0 && <div className="p-20 text-center font-black text-slate-200 text-4xl uppercase tracking-tighter">Zero Liquidity Events</div>}
        </div>
      </section>

      <footer className="text-center pb-12"><p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Global Management Mainframe &copy; 2026</p></footer>
    </div>
  );
}