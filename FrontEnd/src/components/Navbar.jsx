import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart(); 
  const navigate = useNavigate();

  const role = user?.role;

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
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-md sticky top-0 z-50">
      <Link to={homeLink} className="text-2xl font-bold text-indigo-600">
        IntelliMart
      </Link>

      {role === "ROLE_CUSTOMER" && (
        <div className="flex-1 max-w-md mx-10">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
          />
        </div>
      )}

      <div className="flex items-center gap-6 font-medium">
        {role === "ROLE_CUSTOMER" && (
          <>
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            
            {/* ✅ Updated to point to the single Customer Hub */}
            <Link to="/customer" className="hover:text-indigo-600">Profile</Link>
            
            <Link to="/cart" className="relative hover:text-indigo-600">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>
          </>
        )}

        {role === "ROLE_ADMIN" && <Link to="/admin" className="hover:text-indigo-600">Dashboard</Link>}
        {role === "ROLE_SELLER" && <Link to="/seller" className="hover:text-indigo-600">Dashboard</Link>}

        {user ? (
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}