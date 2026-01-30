import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";

export default function Navbar() {

  const { user, logout } = useAuth();
  const { cart } = useCart();
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
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      )}

      <div className="flex items-center gap-6 font-medium">

        {role === "ROLE_CUSTOMER" && (
          <>
            <Link to="/">Home</Link>
            <Link to="/customer">Profile</Link>
            <Link to="/cart" className="relative">
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </>
        )}

        {role === "ROLE_ADMIN" && (
          <Link to="/admin">Dashboard</Link>
        )}

        {role === "ROLE_SELLER" && (
          <Link to="/seller">Dashboard</Link>
        )}

        {user ? (
          <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-lg">
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}
