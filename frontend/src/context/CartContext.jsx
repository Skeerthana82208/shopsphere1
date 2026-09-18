import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  // Fetch cart and wishlist when user logs in or changes
  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWishlist();
    } else {
      setCart({ items: [] });
      setWishlist([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoadingCart(true);
      const { data } = await api.get('/cart');
      if (data.success) {
        setCart(data.cart || { items: [] });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoadingCart(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get('/wishlist');
      if (data.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.info('Please log in to add items to your cart');
      return false;
    }
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      if (data.success) {
        setCart(data.cart);
        toast.success(data.message || 'Added to cart!');
        return true;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      if (data.success) {
        setCart(data.cart);
        toast.info('Item removed from cart');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete('/cart');
      if (data.success) {
        setCart({ items: [] });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addToWishlist = async (productId) => {
    if (!user) {
      toast.info('Please log in to use wishlist');
      return false;
    }
    try {
      const { data } = await api.post(`/wishlist/${productId}`);
      if (data.success) {
        setWishlist(data.wishlist);
        toast.success('Added to wishlist!');
        return true;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      if (data.success) {
        setWishlist(data.wishlist);
        toast.info('Removed from wishlist');
        return true;
      }
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  // Calculations
  const cartItems = cart?.items || [];
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const cartSubtotal = cartItems.reduce((acc, item) => {
    if (!item.product) return acc;
    const price = item.product.discountPrice > 0 ? item.product.discountPrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartSubtotal,
        wishlist,
        loadingCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        fetchCart,
        fetchWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
