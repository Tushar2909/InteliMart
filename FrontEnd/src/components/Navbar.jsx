import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useCart } from "../cart/CartContext";
import { useState } from "react";

export default function Navbar({ onSearch }) {

  const { token, role, logout } = useAuth();
  const { totalItems } = useCart();
  const [query, setQuery] = useState("");

  return (
    <div className="flex justify-between items-center px-10 py-4 border-b bg-white shadow">

      <Link to="/" className="text-2xl font-bold text-indigo-600">
        IntelliMart
      </Link>

      {/* SEARCH */}
      <input
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          onSearch && onSearch(e.target.value);
        }}
        placeholder="Search by name or category..."
        className="border rounded px-4 py-2 w-[350px]"
      />

      <div className="flex gap-6 items-center">

        <Link to="/">Home</Link>

        {/* CART ONLY FOR CUSTOMER */}
        {role === "ROLE_CUSTOMER" && (
          <Link to="/cart" className="relative text-xl">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        )}

        {role === "ROLE_ADMIN" && <Link to="/admin">Admin</Link>}
        {role === "ROLE_SELLER" && <Link to="/seller">Seller</Link>}
        {role === "ROLE_CUSTOMER" && <Link to="/customer">Profile</Link>}

        {!token ? (
          <Link to="/login">Login</Link>
        ) : (
          <button onClick={logout} className="text-red-500">
            Logout
          </button>
        )}

      </div>
    </div>
  );
}
