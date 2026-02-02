import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); 
  const navigate = useNavigate();

  const role = user?.role;

  // ✅ Captures input and updates the URL search param dynamically
  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.trim() !== "") {
      // replace: true prevents flooding the browser history
      navigate(`/?query=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const homeLink =
    role === "ROLE_ADMIN"
      ? "/admin"
      : role === "ROLE_SELLER"
      ? "/seller"
      : "/";

  return (
    <nav className="flex items-center justify-between px-16 py-8 bg-white border-b border-slate-100 sticky top-0 z-50 transition-all">
      {/* BRAND: High-end italic style */}
      <Link to={homeLink} className="text-4xl font-black tracking-tighter text-slate-900 italic uppercase">
        Intelli<span className="text-indigo-600">Mart</span>
      </Link>

      {/* SEARCH BOX: Connected to logic */}
      {role === "ROLE_CUSTOMER" && (
        <div className="flex-1 max-w-xl mx-20">
          <input
            type="text"
            placeholder="Search product nodes..."
            onChange={handleSearch}
            className="w-full px-8 py-3 bg-slate-50 border-none rounded-full text-sm focus:ring-1 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 placeholder:italic font-medium shadow-inner"
          />
        </div>
      )}

      {/* NAVIGATION: High-visibility labels */}
      <div className="flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
        {role === "ROLE_CUSTOMER" && (
          <>
            <Link to="/" className="hover:text-slate-900 transition-colors">Shop</Link>
            <Link to="/customer" className="hover:text-slate-900 transition-colors">Account</Link>
            <Link to="/cart" className="relative hover:text-slate-900 transition-colors">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-6 bg-indigo-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center italic animate-bounce shadow-lg shadow-indigo-200">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {role === "ROLE_ADMIN" && <Link to="/admin" className="hover:text-slate-900 transition-colors">Admin_Hub</Link>}
        {role === "ROLE_SELLER" && <Link to="/seller" className="hover:text-slate-900 transition-colors">Seller_Node</Link>}

        {user ? (
          <button 
            onClick={handleLogout} 
            className="text-rose-400 font-black hover:text-rose-600 transition-colors border-l border-slate-100 pl-12 ml-4"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-slate-900 text-white px-10 py-3 rounded-full text-xs font-black tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
            Authorize
          </Link>
        )}
      </div>
    </nav>
  );
}