import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../cart/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // ✅ LISTEN TO URL (Syncs with Navbar Search)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "price_asc"
  });

  // ✅ DYNAMIC FETCH: Combines Navbar Query + Local UI Filters
  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (filters.category) params.append("category", filters.category);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      params.append("sortBy", filters.sortBy);

      const res = await api.get(`/api/products/search?${params.toString()}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Inventory Node Sync Failure", err);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    // 300ms Debounce to prevent API spam while typing price
    const timer = setTimeout(() => { fetchProducts(); }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <div className="bg-white min-h-screen px-14 py-20 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-8xl font-black tracking-tighter italic uppercase leading-none">
            Selected <br /> <span className="text-slate-100">Nodes</span>
          </h1>
          {searchQuery && (
            <p className="text-[10px] font-black uppercase tracking-widest mt-4">
              Query Result: <span className="text-indigo-600 italic">"{searchQuery}"</span>
            </p>
          )}
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="flex flex-wrap items-center justify-between gap-10 mb-20 pb-10 border-b border-slate-50">
        <div className="flex gap-4">
          {["All", "Electronics", "Fashion", "Home"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat === "All" ? "" : cat })}
              className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                (filters.category === cat || (cat === "All" && !filters.category))
                  ? "bg-black text-white shadow-2xl scale-105"
                  : "bg-slate-50 text-slate-400 hover:text-black border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 bg-slate-50 px-6 py-2 rounded-2xl border border-slate-100">
            <span className="text-[9px] font-black text-slate-300 uppercase italic">Range</span>
            <input type="number" placeholder="MIN" className="w-16 bg-transparent text-[11px] font-bold outline-none border-b border-transparent focus:border-black" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} />
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <input type="number" placeholder="MAX" className="w-16 bg-transparent text-[11px] font-bold outline-none border-b border-transparent focus:border-black" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} />
          </div>

          <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className="bg-white border-2 border-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm transition-all hover:bg-black hover:text-white">
            <option value="price_asc">Price: Ascending</option>
            <option value="price_desc">Price: Descending</option>
            <option value="newest">Newest Arrivals</option>
          </select>
          {(filters.category || filters.minPrice || filters.maxPrice) && (
            <button onClick={() => setFilters({category: "", minPrice: "", maxPrice: "", sortBy: "price_asc"})} className="text-[9px] font-black uppercase text-slate-300 hover:text-black transition-colors border-b border-slate-200">Clear</button>
          )}
        </div>
      </div>

      {/* --- INVENTORY GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {products.length > 0 ? products.map((p, idx) => (
          <div key={p.id} style={{ animationDelay: `${idx * 100}ms` }} className="group bg-white rounded-[3.5rem] border border-slate-50 hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 overflow-hidden">
            <div onClick={() => navigate(`/product/${p.id}`)} className="cursor-pointer overflow-hidden bg-slate-50 aspect-[4/5]">
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
            </div>
            <div className="p-10 text-center space-y-4">
              <h2 onClick={() => navigate(`/product/${p.id}`)} className="font-black text-2xl uppercase italic cursor-pointer hover:text-slate-400 tracking-tighter">{p.name}</h2>
              <p className="text-black font-light text-3xl tracking-tighter italic">₹{p.price?.toLocaleString()}</p>
              <button onClick={(e) => { e.stopPropagation(); addToCart(p.id, 1); }} className="mt-6 w-full py-5 rounded-3xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 active:scale-95 shadow-2xl transition-all">Deploy Node</button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-40 text-center font-black uppercase text-slate-200 italic tracking-[0.8em] animate-pulse">No Inventory Nodes Found</div>
        )}
      </div>
    </div>
  );
}