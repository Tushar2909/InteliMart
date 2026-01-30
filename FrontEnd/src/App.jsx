import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrders from "./pages/seller/SellerOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

export default function App() {

  const location = useLocation();
  const { token, user } = useAuth();

  const role = user?.role;

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* ROOT REDIRECT BASED ON ROLE */}
        <Route
          path="/"
          element={
            role === "ROLE_ADMIN"
              ? <Navigate to="/admin" />
              : role === "ROLE_SELLER"
              ? <Navigate to="/seller" />
              : <Products />
          }
        />

        {/* PRODUCT DETAILS (CUSTOMER ONLY LOGICALLY — UI guarded by navbar) */}
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={
            !token
              ? <Login />
              : role === "ROLE_ADMIN"
              ? <Navigate to="/admin" />
              : role === "ROLE_SELLER"
              ? <Navigate to="/seller" />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" />}
        />

        {/* CUSTOMER */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="ROLE_CUSTOMER">
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute role="ROLE_CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* SELLER */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute role="ROLE_SELLER">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute role="ROLE_SELLER">
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        {/* SELLER PROFILE PLACEHOLDER */}
        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute role="ROLE_SELLER">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PROFILE PLACEHOLDER */}
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
}
