import { useEffect, useState } from "react";
import api from "../../api/axios";

/** * PROFESSIONAL ICON ASSETS 
 * Replaced simple 'X' with high-contrast Red Dustbins and professional pencils.
 */
const TRASH_ICON = "🗑️";
const EDIT_ICON = "✏️";
const BOX_ICON = "📦";
const REVENUE_ICON = "💰";
const USERS_ICON = "👥";
const VENDOR_ICON = "🏢";

/** * SYSTEM ENUMERATIONS
 * ✅ FIXED: Matches your backend Status.java enum exactly.
 */
const STATUSES = ["CONFIRMED", "INTRANSIT", "DISPATCHED", "OUTFORDELIVERY", "DELIVERED", "PENDING"];
const CATEGORIES = ["CLOTHING", "ACCESSORIES", "SHOES", "CROCKERY", "ELECTRONICS", "GROCERIES"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

export default function AdminDashboard() {
  // ================= STATE MANAGEMENT =================
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= SECTIONAL EDITOR STATES =================
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductImage, setEditProductImage] = useState(null);
  const [editingSeller, setEditingSeller] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => { 
    console.log("⚡ Admin Dashboard: Performing Global Node Sync...");
    loadAll(); 
  }, []);

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
      
    } catch (err) { 
      console.error("❌ System Load Error:", err);
      alert("System load failed. Verify Backend Auth."); 
    } finally { 
      setLoading(false); 
    }
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
      
      // Multipart/Form-data restoration
      if (editProductImage) formData.append("image", editProductImage);

      await api.put(`/api/admin/products/${editingProduct.id}`, formData);
      setEditingProduct(null); 
      setEditProductImage(null); 
      loadAll();
    } catch (e) { alert("Product Protocol Failure"); }
  };

  const deleteProduct = async (id) => { 
    if (window.confirm("Permanently delete this inventory asset?")) { 
      try {
        await api.delete(`/api/admin/products/${id}`); 
        loadAll(); 
      } catch (err) { alert("Deletion failed"); }
    } 
  };

  // ================= VENDOR LOGIC =================

  const saveSellerEdit = async () => {
    try {
      await api.put(`/api/admin/sellers/${editingSeller.id}`, editingSeller);
      setEditingSeller(null); 
      loadAll();
    } catch (err) { alert("Seller Update Protocol Error"); }
  };

  const deleteSeller = async (id) => { 
    if (window.confirm("CRITICAL: Terminate vendor account?")) { 
      try {
        await api.delete(`/api/admin/sellers/${id}`); 
        loadAll(); 
      } catch (err) { alert("Vendor wipe error"); }
    } 
  };

  // ================= CLIENT LOGIC =================

  const saveCustomerEdit = async () => {
    try {
      // Direct Admin Override Mapping
      await api.put(`/api/admin/customers/${editingCustomer.id}`, editingCustomer);
      setEditingCustomer(null); 
      loadAll();
      alert("Profile Successfully Synchronized");
    } catch (err) { alert("Client Update Protocol Error"); }
  };

  const deleteCustomer = async (id) => { 
    if (window.confirm("WARNING: Wipe client profile record permanently?")) { 
      try {
        await api.delete(`/api/customers/${id}`); 
        loadAll(); 
      } catch (err) { alert("Client wipe failure"); }
    } 
  };
  
  const viewCustomerOrders = async (id) => {
    try {
        const res = await api.get(`/api/orders/customer/${id}`);
        alert(`Order History Trace [UID ${id}]:\n` + JSON.stringify(res.data, null, 2));
    } catch (err) { alert("Trace failed"); }
  };

  // ================= ORDER LIFECYCLE LOGIC =================

  const updateStatus = async (orderId, status) => {
    try {
      // Standardized to match Status.java Enum
      await api.put(`/api/admin/orders/${orderId}/status`, null, { 
        params: { status: status.trim().toUpperCase() } 
      });
      loadAll();
    } catch (e) { alert("Status Transition Denied"); }
  };

  // ================= SYSTEM STATS (BULLETPROOF MATH) =================
  // Force numeric conversion to stop NaN in Grand Total / Stats
  const totalRev = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const invValue = products.reduce((acc, curr) => acc + (Number(curr.price) * Number(curr.unitsAvailable) || 0), 0);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white font-black text-indigo-600 animate-pulse text-4xl">
        INTELLIMART <span className="text-slate-300 ml-4 italic">ADMIN_BOOT</span>
    </div>
  );

  return (
    <div className="bg-[#fcfdfe] min-h-screen p-8 lg:p-14 space-y-24">
      
      {/* 1. SYSTEM CONTROL HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-white p-14 rounded-[4rem] shadow-sm border border-slate-50 gap-10">
        <div className="space-y-4">
            <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Management Console</h1>
            <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-indigo-500 rounded-full animate-ping"></div>
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Node Connection: Authenticated Admin</p>
            </div>
        </div>
        <button 
            onClick={loadAll} 
            className="bg-slate-900 text-white px-20 py-7 rounded-[3rem] font-black shadow-2xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 text-lg"
        >
            Reload All Fragments
        </button>
      </header>

      {/* 2. ANALYTICS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-50 flex flex-col justify-between h-64 hover:shadow-xl transition-shadow">
              <p className="text-[11px] font-black text-indigo-300 uppercase tracking-widest">{REVENUE_ICON} Treasury</p>
              <h4 className="text-5xl font-black text-slate-900 tracking-tighter">₹{totalRev.toLocaleString()}</h4>
              <p className="text-xs text-green-500 font-bold uppercase tracking-widest">Revenue Cleared</p>
          </div>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-50 flex flex-col justify-between h-64">
              <p className="text-[11px] font-black text-indigo-300 uppercase tracking-widest">{USERS_ICON} Client Node</p>
              <h4 className="text-5xl font-black text-slate-900 tracking-tighter">{customers.length}</h4>
              <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">Verified Profiles</p>
          </div>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-50 flex flex-col justify-between h-64">
              <p className="text-[11px] font-black text-indigo-300 uppercase tracking-widest">{VENDOR_ICON} Partners</p>
              <h4 className="text-5xl font-black text-slate-900 tracking-tighter">{sellers.length}</h4>
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Vendor Entities</p>
          </div>
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-50 flex flex-col justify-between h-64">
              <p className="text-[11px] font-black text-indigo-300 uppercase tracking-widest">Stock Value</p>
              <h4 className="text-5xl font-black text-slate-900 tracking-tighter">₹{invValue.toLocaleString()}</h4>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">Inventory Assets</p>
          </div>
      </section>

      {/* 3. ASSET INFRASTRUCTURE */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black text-slate-800 px-8 uppercase tracking-tighter border-l-[16px] border-indigo-600">Inventory Management</h2>
        
        {editingProduct && (
          <div className="bg-white p-14 rounded-[5rem] shadow-2xl border-[6px] border-indigo-500 animate-in fade-in slide-in-from-bottom-10 duration-500 mb-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 text-[100px] font-black text-indigo-50 opacity-10 select-none">UPDATE_P</div>
            <h3 className="text-3xl font-black text-indigo-600 mb-10 border-b border-indigo-50 pb-8 uppercase tracking-[0.2em]">Override SKU Mapping: {editingProduct.id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Product Name</label>
                  <input className="w-full border-4 border-slate-50 p-6 rounded-[2rem] font-bold focus:border-indigo-400 outline-none transition-all" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} placeholder="Asset Identifier"/>
              </div>
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Market Value (₹)</label>
                  <input className="w-full border-4 border-slate-50 p-6 rounded-[2rem] font-bold focus:border-indigo-400 outline-none transition-all" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} placeholder="Valuation"/>
              </div>
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Classification</label>
                  <select className="w-full border-4 border-slate-50 p-6 rounded-[2rem] font-bold outline-none focus:border-indigo-400 transition-all cursor-pointer" value={editingProduct.pcategory} onChange={e => setEditingProduct({...editingProduct, pcategory: e.target.value})}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
              </div>
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Digital Asset (Image)</label>
                  <div className="bg-slate-50 p-5 rounded-[2rem] border-4 border-dashed border-slate-100 flex items-center justify-center">
                    <input type="file" className="text-[10px] font-black text-indigo-400" onChange={e => setEditProductImage(e.target.files[0])} />
                  </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-14">
                <button onClick={saveProductEdit} className="flex-1 bg-indigo-600 text-white py-7 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-tighter">Commit Database Update</button>
                <button onClick={() => setEditingProduct(null)} className="bg-slate-100 text-slate-400 px-20 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Abort</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[4.5rem] overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-50">
                <tr className="text-slate-400 text-[12px] font-black uppercase tracking-[0.3em]">
                    <th className="py-12 px-14">Asset ID</th>
                    <th className="py-12 px-14">Identity</th>
                    <th className="py-12 px-14">Valuation</th>
                    <th className="py-12 px-14 text-center">Global Protocol</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-indigo-50/10 transition-all group">
                  <td className="py-12 px-14 font-mono text-indigo-400 font-black text-xs">P_FRAG_{p.id}</td>
                  <td className="py-12 px-14">
                    <div className="font-black text-slate-800 text-2xl tracking-tighter mb-1">{p.name}</div>
                    <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.3em]">{p.pcategory}</div>
                  </td>
                  <td className="py-12 px-14">
                      <div className="font-black text-slate-900 text-2xl tracking-tighter leading-none mb-2">₹{p.price.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{p.unitsAvailable} Units Clear</div>
                  </td>
                  <td className="py-12 px-14">
                    <div className="flex justify-center gap-6">
                        <button onClick={() => setEditingProduct({...p})} className="bg-white border-4 border-slate-50 text-indigo-600 px-10 py-5 rounded-[2rem] font-black text-xs hover:bg-indigo-600 hover:text-white transition-all shadow-sm">{EDIT_ICON} Edit Profile</button>
                        <button onClick={() => deleteProduct(p.id)} className="bg-red-50 text-red-600 px-8 py-5 rounded-[2rem] font-black shadow-sm hover:bg-red-600 hover:text-white transition-all border-none">{TRASH_ICON}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. VENDOR CORE LAYER */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black text-slate-800 px-8 uppercase tracking-tighter border-l-[16px] border-green-600">Partner Mainframe</h2>
        
        {editingSeller && (
          <div className="bg-white p-14 rounded-[5rem] shadow-2xl border-[6px] border-green-500 animate-in fade-in slide-in-from-bottom-10 duration-500 mb-14 relative">
            <h3 className="text-3xl font-black text-green-600 mb-10 border-b border-green-50 pb-8 uppercase tracking-[0.2em]">Vendor Update Auth: SEL_{editingSeller.id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Corporate Legal Name</label>
                  <input className="w-full border-4 border-slate-50 p-7 rounded-[2rem] font-bold focus:border-green-400 outline-none transition-all" value={editingSeller.companyName} onChange={e => setEditingSeller({...editingSeller, companyName: e.target.value})} placeholder="Company Name"/>
              </div>
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-3">Administrator Handle</label>
                  <input className="w-full border-4 border-slate-50 p-7 rounded-[2rem] font-bold focus:border-green-400 outline-none transition-all" value={editingSeller.user.name} onChange={e => setEditingSeller({...editingSeller, user: {...editingSeller.user, name: e.target.value}})} placeholder="Admin Name"/>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-14">
                <button onClick={saveSellerEdit} className="flex-1 bg-green-600 text-white py-7 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-tighter">Push Sync Vendor Profile</button>
                <button onClick={() => setEditingSeller(null)} className="bg-slate-100 text-slate-400 px-20 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Abort</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[4.5rem] overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-50"><tr className="text-slate-400 text-[12px] font-black uppercase tracking-[0.3em]"><th className="py-12 px-14 uppercase tracking-widest">Entity Identity</th><th className="py-12 px-14 text-center uppercase tracking-widest">Protocol Protocol</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {sellers.map(s => (
                <tr key={s.id} className="hover:bg-green-50/10 transition-all group">
                    <td className="py-12 px-14">
                        <div className="font-black text-slate-800 text-2xl uppercase tracking-tighter mb-1">{s.companyName}</div>
                        <div className="text-[11px] font-black text-slate-400 italic underline decoration-slate-100 uppercase tracking-widest">{s.user?.email}</div>
                    </td>
                    <td className="py-12 px-14">
                        <div className="flex justify-center gap-6">
                            <button onClick={() => setEditingSeller({...s, user: {...s.user}})} className="bg-green-50 text-green-700 px-12 py-5 rounded-[2rem] font-black text-xs hover:bg-green-600 hover:text-white transition-all shadow-sm border-none tracking-tighter italic">Edit Profile</button>
                            <button onClick={() => deleteSeller(s.id)} className="bg-red-50 text-red-600 px-8 py-5 rounded-[2rem] font-black shadow-sm hover:bg-red-600 hover:text-white transition-all border-none">{TRASH_ICON}</button>
                        </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. CLIENT DIRECTORY LAYER */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black text-slate-800 px-8 uppercase tracking-tighter border-l-[16px] border-orange-600">Client Infrastructure</h2>
        
        {editingCustomer && (
          <div className="bg-white p-14 rounded-[5rem] shadow-2xl border-[6px] border-orange-500 animate-in fade-in slide-in-from-bottom-10 duration-500 mb-14 relative">
            <h3 className="text-3xl font-black text-orange-600 mb-10 border-b border-orange-50 pb-8 uppercase tracking-[0.2em] underline underline-offset-[16px] decoration-orange-100">Identity Protocol: {editingCustomer.id}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-3 tracking-widest">Full Legal Name</label>
                  <input className="w-full border-4 border-slate-50 p-7 rounded-[2rem] font-bold focus:border-orange-400 outline-none transition-all" value={editingCustomer.user.name} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, name: e.target.value}})} placeholder="Identity Name"/>
              </div>
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-3 tracking-widest">Verified Contact Node</label>
                  <input className="w-full border-4 border-slate-50 p-7 rounded-[2rem] font-bold focus:border-orange-400 outline-none transition-all" value={editingCustomer.user.number} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, number: e.target.value}})} placeholder="Mobile Sync"/>
              </div>
              <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-3 tracking-widest">Biological Identifier</label>
                  <select className="w-full border-4 border-slate-50 p-7 rounded-[2rem] font-bold outline-none focus:border-orange-400 transition-all appearance-none cursor-pointer" value={editingCustomer.user.gender} onChange={e => setEditingCustomer({...editingCustomer, user: {...editingCustomer.user, gender: e.target.value}})}>
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-14">
                <button onClick={saveCustomerEdit} className="flex-1 bg-orange-600 text-white py-7 rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-slate-900 transition-all uppercase tracking-tighter">Commit Secure Profile Sync</button>
                <button onClick={() => setEditingCustomer(null)} className="bg-slate-100 text-slate-400 px-20 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all">Abort Sync</button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[4.5rem] overflow-hidden shadow-sm border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-50"><tr className="text-slate-400 text-[12px] font-black uppercase tracking-[0.3em]"><th className="py-12 px-14 tracking-widest">Client Identity Hash</th><th className="py-12 px-14 text-center tracking-widest">Fulfilment Protocol</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-orange-50/10 transition-all border-b last:border-0 group">
                  <td className="py-12 px-14">
                      <div className="font-black text-slate-800 text-2xl tracking-tighter mb-1 uppercase">{c.user?.name}</div>
                      <div className="text-[11px] font-black text-orange-400 uppercase tracking-widest">Acc Node: {c.id}00X</div>
                  </td>
                  <td className="py-12 px-14 align-middle">
                    <div className="flex justify-center gap-6">
                        <button onClick={() => viewCustomerOrders(c.id)} className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl hover:scale-110 transition-all hover:bg-indigo-600 border-none">{BOX_ICON}</button>
                        <button onClick={() => setEditingCustomer({...c, user: {...c.user}})} className="bg-orange-50 text-orange-700 px-14 py-5 rounded-[2rem] font-black text-xs hover:bg-orange-600 hover:text-white transition-all shadow-sm border-none tracking-tighter">Edit Profile</button>
                        <button onClick={() => deleteCustomer(c.id)} className="bg-red-50 text-red-600 px-8 py-5 rounded-[2rem] font-black shadow-sm hover:bg-red-600 hover:text-white transition-all border-none">{TRASH_ICON}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. ORDER CYCLE LAYER */}
      <section className="space-y-10">
        <h2 className="text-3xl font-black text-slate-800 px-8 uppercase tracking-tighter border-l-[16px] border-purple-600">Global fulfilment Hub</h2>
        <div className="bg-white rounded-[4.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-purple-50">
              <tr className="text-purple-400 text-[12px] font-black uppercase tracking-[0.3em]"><th className="py-12 px-14 tracking-widest">Trace UID</th><th className="py-12 px-14 tracking-widest">Settlement</th><th className="py-12 px-14 tracking-widest">Delivery Protocol</th></tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {orders.map(o => (
                <tr key={o.orderId} className="border-b border-purple-50 last:border-0 hover:bg-purple-50/20 transition-all">
                  <td className="py-12 px-14">
                      <p className="font-mono text-xs text-purple-600 font-black tracking-tighter bg-purple-50 px-5 py-3 rounded-2xl inline-block shadow-inner">TRX_REF_{o.orderId}</p>
                      <p className="text-[11px] text-slate-300 font-bold mt-3 uppercase tracking-widest ml-1">Verified Transaction Node</p>
                  </td>
                  <td className="py-12 px-14">
                      <div className="font-black text-slate-900 text-3xl tracking-tighter leading-none mb-2">₹{o.totalAmount.toLocaleString()}</div>
                      <div className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Payment Integrity Cleared</div>
                  </td>
                  <td className="py-12 px-14">
                    <div className="relative group/select">
                        <select 
                            className={`border-4 rounded-[2rem] px-10 py-5 text-xs font-black outline-none transition-all cursor-pointer appearance-none shadow-sm ${
                                o.status === "DELIVERED" ? "bg-green-500 text-white border-green-400 shadow-green-100 shadow-2xl" : "bg-white border-slate-100 text-slate-700 hover:border-purple-300"
                            }`}
                            value={o.status} 
                            onChange={(e) => updateStatus(o.orderId, e.target.value)}
                        >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-xs">▼</div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. REVENUE LAYER (CARDS) */}
      <section className="space-y-14 pb-36">
        <div className="border-t-[8px] border-slate-50 pt-24">
            <h2 className="text-5xl font-black text-slate-900 px-8 tracking-tighter mb-16 uppercase underline decoration-indigo-50 underline-offset-[20px]">Revenue Analytics Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
            {payments.map(p => (
                <div key={p.id} className="group relative overflow-hidden bg-white border-4 border-slate-50 p-14 rounded-[5rem] shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.25)] hover:-translate-y-6 transition-all duration-700 cursor-help active:scale-95">
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-50 rounded-full group-hover:scale-[2.5] transition-transform duration-1000 opacity-40" />
                    <p className="text-[11px] font-black text-indigo-300 uppercase tracking-[0.4em] mb-8 relative z-10">Auth Token Node: {p.id}99X</p>
                    <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6 relative z-10 group-hover:text-indigo-600 transition-colors">₹{Number(p.amount).toLocaleString()}</p>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_green]"></div>
                        <p className="text-[11px] font-black text-green-500 uppercase tracking-widest italic underline decoration-green-100">Settled Node Protocol</p>
                    </div>
                </div>
            ))}
            </div>
        </div>
      </section>

      <footer className="text-center pb-20 border-t-2 border-slate-50 pt-10">
          <p className="text-[12px] font-black text-slate-300 uppercase tracking-[0.6em] mb-2 tracking-tighter">IntelliMart Global Management Mainframe &copy; 2026</p>
          <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest italic underline">Level 1 Administrator Access: Primary Cluster</p>
      </footer>

    </div>
  );
}