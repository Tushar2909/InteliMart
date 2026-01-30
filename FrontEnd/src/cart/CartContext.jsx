import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!user?.id) return;
    console.log(user.id);
    const res = await api.get(`/api/cart/${user.id}`);
    setCart(res.data || []);
  };

  useEffect(() => {
    fetchCart();
  }, [user?.id]);

  const addToCart = async (productId, qty = 1) => {
    if (!user?.id) return alert("Login first");

    await api.post(`/api/cart/add/${user.id}/${productId}/${qty}`);
    fetchCart();
  };

  const changeQty = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    await api.put(`/api/cart/update/${cartItemId}`, null, {
      params: { quantity }
    });
    fetchCart();
  };

  const removeFromCart = async (cartItemId) => {
    await api.delete(`/api/cart/remove/${cartItemId}`);
    fetchCart();
  };

  const clearCart = async () => {
    await api.delete(`/api/cart/clear/${user.id}`);
    setCart([]);
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      changeQty,
      removeFromCart,
      clearCart,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
