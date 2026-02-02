import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useCart } from "../cart/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProductNode = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch specific product by ID
      const res = await api.get(`/api/products/${id}`);
      setP(res.data);
      
      if (res.data?.pcategory) {
        try {
          // ✅ Corrected: Using the dynamic search endpoint for related items
          const rel = await api.get(`/api/products/search?category=${res.data.pcategory}`);
          setRelated(rel.data.filter(x => x.id !== Number(id)).slice(0, 4));
        } catch (e) { setRelated([]); }
      }
    } catch (err) { 
      console.error("Node Sync Failed", err); 
      setP(null);
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProductNode();
  }, [id, loadProductNode]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-indigo-600 animate-pulse text-2xl uppercase italic tracking-[0.5em]">Syncing_Metadata...</div>;
  
  if (!p) return <div className="h-screen flex flex-col items-center justify-center gap-6 font-black uppercase text-slate-400 italic">Product_Node_Not_Found <button onClick={() => navigate('/')} className="px-8 py-3 border-2 border-black text-[10px]">Return_to_Inventory</button></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 space-y-24 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
        {/* --- IMAGE --- */}
        <div className="sticky top-28 bg-white p-4 rounded-[4rem] shadow-2xl border border-slate-50 overflow-hidden group">
          <img src={p.imageUrl} alt={p.name} className="w-full h-[650px] object-cover rounded-[3.5rem] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s]" />
        </div>

        {/* --- PRODUCT INFO --- */}
        <div className="space-y-12 py-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="bg-slate-900 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">{p.pcategory}</span>
              <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Node: #{p.id}</span>
            </div>
            <h1 className="text-8xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">{p.name}</h1>
            <p className="text-6xl font-black text-indigo-600 italic tracking-tighter">₹{p.price?.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 border-y border-slate-100 py-12">
            <div className="space-y-3 border-l-4 border-indigo-600 pl-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Merchant_Source</p>
              <p className="font-black text-slate-900 text-2xl italic uppercase tracking-tighter">{p.sellerName || "Verified_Seller"}</p>
            </div>
            <div className="space-y-3 border-l-4 border-slate-100 pl-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Availability</p>
              <p className={`font-black text-2xl uppercase italic tracking-tighter ${p.unitsAvailable > 0 ? "text-slate-900" : "text-rose-500"}`}>{p.unitsAvailable > 0 ? `${p.unitsAvailable}_Units` : "Node_Depleted"}</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Technical_Metadata</p>
            <p className="text-slate-500 leading-relaxed font-medium text-xl italic">{p.description || "No metadata provided."}</p>
          </div>

          {/* ✅ Functional Add to Cart */}
          <button 
            onClick={() => addToCart(p.id, 1)} 
            disabled={p.unitsAvailable <= 0} 
            className={`w-full py-8 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${p.unitsAvailable > 0 ? "bg-slate-900 text-white hover:bg-indigo-600 shadow-indigo-100" : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"}`}>
            {p.unitsAvailable > 0 ? "Deploy to Cart" : "Node_Offline"}
          </button>
        </div>
      </div>

      {/* --- RELATED NODES --- */}
      {related.length > 0 && (
        <div className="space-y-16 pt-20 border-t border-slate-100">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">Similar Marketplace Nodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {related.map(item => (
              <div key={item.id} onClick={() => navigate(`/product/${item.id}`)} className="cursor-pointer group bg-white p-6 rounded-[3.5rem] border border-slate-50 hover:shadow-2xl hover:-translate-y-4 transition-all duration-700">
                <div className="aspect-square overflow-hidden rounded-[2.5rem] mb-6 bg-slate-50">
                  <img src={item.imageUrl} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" alt={item.name} />
                </div>
                <h3 className="font-black uppercase italic text-lg text-slate-900 tracking-tighter">{item.name}</h3>
                <p className="font-black text-indigo-600 tracking-tighter italic text-xl mt-2">₹{item.price?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}