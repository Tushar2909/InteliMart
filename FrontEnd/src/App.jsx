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
  const { token } = useAuth();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!token ? <Signup /> : <Navigate to="/" />} />

        <Route path="/cart" element={
          <ProtectedRoute role="ROLE_CUSTOMER">
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/customer" element={
          <ProtectedRoute role="ROLE_CUSTOMER">
            <CustomerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/seller" element={
          <ProtectedRoute role="ROLE_SELLER">
            <SellerDashboard />
          </ProtectedRoute>
        } />

        <Route path="/seller/orders" element={
          <ProtectedRoute role="ROLE_SELLER">
            <SellerOrders />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute role="ROLE_ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  );
}
